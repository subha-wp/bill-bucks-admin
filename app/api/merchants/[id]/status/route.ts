import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const merchantId = id;
    const { status } = await request.json();

    // Validate status
    if (!["ACTIVE", "SUSPENDED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(merchant);
  } catch (error) {
    console.error("Error updating merchant status:", error);
    return NextResponse.json(
      { error: "Failed to update merchant status" },
      { status: 500 }
    );
  }
}
