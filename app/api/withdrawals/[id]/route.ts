import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const withdrawal = await prisma.withdrawal.update({
      where: {
        id: id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(withdrawal);
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    return NextResponse.json(
      { error: "Failed to update withdrawal" },
      { status: 500 }
    );
  }
}
