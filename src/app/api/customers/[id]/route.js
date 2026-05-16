import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const customer = await prisma.customers.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            vendors: true
          },
          orderBy: { created_at: 'desc' },
          take: 10
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Map to frontend expected structure
    const mappedCustomer = {
      id: customer.id,
      fullName: customer.full_name,
      phone: customer.phone,
      email: customer.email || "N/A",
      profilePhoto: "https://via.placeholder.com/150",
      registrationDate: customer.created_at.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isGuest: false,
      addresses: [
        { type: "Home", detail: "402, Sunshine Apts, HSR Layout Sector 2, Bangalore - 560102" }
      ],
      ageVerification: {
        status: "VERIFIED",
        expiryDate: "2028-12-31",
        documentType: "Aadhar Card"
      },
      orders: customer.orders.map(order => ({
        id: order.id.slice(0, 8).toUpperCase(),
        vendor: order.vendors?.business_name || "Unknown Vendor",
        amount: `₹${order.total_amount.toNumber().toLocaleString()}`,
        status: order.status.toUpperCase(),
        date: order.created_at.toISOString().split('T')[0]
      })),
      feedback: []
    };

    return NextResponse.json(mappedCustomer);
  } catch (error) {
    console.error("Customer Detail API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
