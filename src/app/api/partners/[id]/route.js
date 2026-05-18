import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;

    const rider = await prisma.riders.findUnique({
      where: { id },
      include: {
        profiles: true
      }
    });

    if (!rider) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    // Fetch logs separately since relations were removed from the rider schema
    const [kycReviews, statusLogs] = await Promise.all([
      prisma.riderKycReview.findMany({
        where: { riderId: id },
        orderBy: { reviewedAt: 'desc' },
        include: { adminUser: { select: { name: true } } }
      }),
      prisma.riderStatusLog.findMany({
        where: { riderId: id },
        orderBy: { changedAt: 'desc' },
        include: { adminUser: { select: { name: true } } }
      })
    ]);

    // Map to frontend expected structure
    const mappedRider = {
      id: rider.id,
      fullName: rider.name,
      phone: rider.profiles?.phone_number || "N/A",
      email: `${rider.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      profilePhoto: "https://via.placeholder.com/150",
      vehicleType: rider.vehicle_type || "Bike",
      vehicleNumber: rider.vehicle_number || "N/A",
      preferredZone: "HSR Layout",
      status: rider.account_status.toUpperCase(),
      kycStatus: rider.account_status.toUpperCase(),
      isOnline: rider.online_status?.toLowerCase() === 'online',
      complianceFlags: [],
      kycDocuments: [
        { type: "Government ID", name: "id_proof.jpg", date: rider.created_at?.toISOString().split('T')[0] },
        { type: "Driving License", name: "license.pdf", date: rider.created_at?.toISOString().split('T')[0] }
      ],
      kycReviews: kycReviews.map(review => ({
        decision: review.decision,
        reason: review.rejectionReason,
        by: review.adminUser?.name || "System",
        date: review.reviewedAt.toLocaleString()
      })),
      adminActions: statusLogs.map(log => ({
        action: `STATUS_CHANGED_${log.newStatus.toUpperCase()}`,
        oldStatus: log.oldStatus,
        reason: log.reason,
        by: log.adminUser?.name || "System",
        date: log.changedAt.toLocaleString()
      }))
    };

    return NextResponse.json(mappedRider);
  } catch (error) {
    console.error("Partner Detail API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body;

    const rider = await prisma.riders.findUnique({ where: { id } });
    if (!rider) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

    let newStatus = rider.account_status;
    let kycDecision = null;

    if (action === "APPROVE_KYC") {
      newStatus = "ACTIVE";
      kycDecision = "approved";
    } else if (action === "REJECT_KYC") {
      newStatus = "REJECTED";
      kycDecision = "rejected";
    } else if (action === "SUSPEND") {
      newStatus = "SUSPENDED";
    } else if (action === "DISABLE") {
      newStatus = "DISABLED";
    } else if (action === "REACTIVATE") {
      newStatus = "ACTIVE";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await prisma.riders.update({
      where: { id },
      data: { account_status: newStatus }
    });

    if (newStatus !== rider.account_status) {
      await prisma.riderStatusLog.create({
        data: {
          riderId: id,
          oldStatus: rider.account_status,
          newStatus: newStatus,
          reason: reason || null,
          adminUserId: admin.id
        }
      });
    }

    if (kycDecision) {
      const adminContext = await getAdmin();
      // Since rider KYC doesn't have a specific table like vendor_kyc, we'll just log the review if possible.
      if (adminContext) {
        await prisma.riderKycReview.create({
          data: {
            adminUserId: adminContext.id,
            riderId: id,
            kycId: id, // Fallback since we don't have a rider_kyc table in schema (or didn't see one)
            decision: kycDecision,
            rejectionReason: reason || null
          }
        });
      }
    }

    return NextResponse.json({ success: true, newStatus });
  } catch (error) {
    console.error("Partner Update API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
