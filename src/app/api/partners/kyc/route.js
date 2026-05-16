import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const queue = await prisma.riders.findMany({
      where: {
        account_status: {
          in: ["pending", "under_review", "kyc_submitted"]
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    // Map to frontend expected structure
    const mappedQueue = queue.map(r => {
      const diff = new Date() - new Date(r.created_at);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        id: r.id,
        fullName: r.name,
        vehicleType: r.vehicle_type || "Bike",
        submissionDate: r.created_at.toLocaleString(),
        timeWaiting: `${hours}h ${minutes}m`,
        status: r.account_status.toUpperCase()
      };
    });

    return NextResponse.json(mappedQueue);
  } catch (error) {
    console.error("Partner KYC Queue API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
