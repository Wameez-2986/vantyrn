import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const riders = await prisma.riders.findMany({
      orderBy: { created_at: 'desc' }
    });

    const mappedRiders = riders.map(r => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      vehicle: r.vehicle_type || "Bicycle",
      status: r.account_status.toUpperCase(),
      isOnline: r.online_status?.toLowerCase() === 'online',
      rating: 4.5 // Mocking rating as it's not in schema
    }));

    return NextResponse.json(mappedRiders);
  } catch (error) {
    console.error("Partners API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
