import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const where = {};

    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        {
          profiles: {
            phone_number: { contains: search, mode: 'insensitive' }
          }
        }
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customers.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          profiles: true,
          _count: {
            select: { orders: true }
          },
          orders: {
            select: { total_amount: true }
          }
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.customers.count({ where })
    ]);

    const mappedCustomers = customers.map(c => {
      const totalSpent = c.orders.reduce((sum, order) => sum + order.total_amount.toNumber(), 0);
      return {
        id: c.id,
        name: c.full_name || "Unknown",
        email: c.email || "N/A",
        phone: c.profiles?.phone_number || "N/A",
        isGuest: false,
        registeredAt: c.created_at,
        orders: c._count.orders,
        spent: `₹${totalSpent.toLocaleString()}`,
        status: c.status
      };
    });

    return NextResponse.json({
      data: mappedCustomers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Customers API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
