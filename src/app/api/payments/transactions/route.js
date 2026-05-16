import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    
    const transactions = await prisma.payment_transactions.findMany({
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            customers: {
              select: { full_name: true, phone: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error("Payment Transactions API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
