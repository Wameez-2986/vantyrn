import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Next 16 dynamic params need to be awaited
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const optionGroups = await prisma.product_customization_groups.findMany({
      where: { product_id: id },
      include: {
        product_customization_options: {
          orderBy: { display_order: 'asc' }
        }
      },
      orderBy: { display_order: 'asc' }
    });

    return NextResponse.json(optionGroups);
  } catch (error) {
    console.error("Customizations API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
