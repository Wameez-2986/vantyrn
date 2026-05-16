import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const assignments = await prisma.vendor_assigned_templates.findMany({
      where: { vendor_id: params.id },
      include: {
        byo_templates: {
          include: {
            byo_template_groups: {
              orderBy: { display_order: 'asc' }
            }
          }
        }
      }
    });

    const templates = assignments.map(a => a.byo_templates).filter(Boolean);

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Fetch Vendor Templates Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
