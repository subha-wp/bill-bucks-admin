import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; cycleId: string }> }
) {
  try {
    const { id: merchantId, cycleId } = await params;
    const { status } = await request.json();

    // Validate status
    if (!["PAID", "PENDING", "OVERDUE"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const billingCycle = await prisma.billingCycle.update({
      where: {
        id: cycleId,
        merchantId: merchantId,
      },
      data: {
        status,
        paidAt: status === "PAID" ? new Date() : null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(billingCycle);
  } catch (error) {
    console.error("Error updating billing cycle:", error);
    return NextResponse.json(
      { error: "Failed to update billing cycle" },
      { status: 500 }
    );
  }
}
