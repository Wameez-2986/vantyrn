import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const quickFilter = searchParams.get("quickFilter") || "ALL";
    const statusFilter = searchParams.get("status") || "ALL";

    const where = {};

    // 1. Quick Filter Tabs
    if (quickFilter === "ACTIVE") {
      where.status = {
        in: ["payment_successful", "accepted", "preparing", "ready", "out_for_delivery"]
      };
    } else if (quickFilter === "FLAGGED") {
      where.OR = [
        { is_flagged: true },
        {
          status: { in: ["payment_successful", "placed", "pending", "pending_vendor"] },
          created_at: { lt: new Date(Date.now() - 300000) } // SLA breached (> 5 minutes)
        }
      ];
    } else if (quickFilter === "COMPLETED") {
      where.status = "delivered";
    } else if (quickFilter === "CANCELLED") {
      where.status = "cancelled";
    }

    // 2. Status Filter Dropdown (refines where clause if not ALL)
    if (statusFilter !== "ALL") {
      if (statusFilter === "FLAGGED") {
        where.OR = [
          { is_flagged: true },
          {
            status: { in: ["payment_successful", "placed", "pending", "pending_vendor"] },
            created_at: { lt: new Date(Date.now() - 300000) }
          }
        ];
      } else if (statusFilter === "PENDING_VENDOR") {
        where.status = {
          in: ["pending_vendor", "payment_successful"]
        };
      } else {
        where.status = statusFilter.toLowerCase();
      }
    }

    // 3. Search query (Order ID/shortId prefix or Customer Phone)
    if (search) {
      const orConditions = [
        { customers: { profiles: { phone_number: { contains: search, mode: 'insensitive' } } } }
      ];

      const isHex = /^[0-9a-fA-F]{1,8}$/.test(search);
      if (isHex) {
        const hexSearch = `${search.toLowerCase()}%`;
        const rawResults = await prisma.$queryRaw`
          SELECT id::text FROM customer.orders 
          WHERE id::text LIKE ${hexSearch}
        `;
        const matchingIds = rawResults.map(r => r.id);
        if (matchingIds.length > 0) {
          orConditions.push({ id: { in: matchingIds } });
        }
      } else {
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(search);
        if (isUuid) {
          orConditions.push({ id: search });
        }
      }
      where.OR = orConditions;
    }

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          created_at: true,
          total_amount: true,
          status: true,
          is_flagged: true,
          customers: { select: { full_name: true } },
          vendors: { select: { business_name: true } },
          _count: { select: { order_items: true } }
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.orders.count({ where })
    ]);

    const mappedOrders = orders.map(o => {
      const pendingStatuses = ['payment_successful', 'placed', 'pending', 'pending_vendor'];
      const isPendingVendor = o.status && pendingStatuses.includes(o.status.toLowerCase());
      const isSlaBreached = isPendingVendor && (Date.now() - new Date(o.created_at).getTime() > 300000);
      const isFlagged = o.is_flagged || isSlaBreached;

      return {
        id: o.id,
        shortId: o.id.slice(0, 8).toUpperCase(),
        customerName: o.customers?.full_name || "Unknown",
        vendorName: o.vendors?.business_name || "Unknown",
        items: o._count.order_items,
        amount: `₹${o.total_amount.toNumber().toLocaleString()}`,
        status: isFlagged && isPendingVendor ? "FLAGGED" : o.status.toUpperCase(),
        isFlagged: isFlagged,
        time: o.created_at
      };
    });

    return NextResponse.json({
      data: mappedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Orders API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
