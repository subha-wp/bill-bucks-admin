import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // Validate status
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.update({
      where: {
        id: id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        merchant: true,
      },
    });

    // If invoice is approved, handle cashback
    if (status === "APPROVED") {
      let cashbackAmount = 0;

      // Check invoice amount to determine cashback type
      if (invoice.isMerchant) {
        if (Number(invoice.amount) > 1000) {
          // For invoices > 3000, give 1% cashback
          cashbackAmount = Math.floor(Number(invoice.amount) * 0.01);
        } else if (Number(invoice.amount) > 200) {
          // For merchant invoices with amount > 200 but <= 3000, give random 3-6 cashback
          cashbackAmount = Math.floor(Math.random() * 4) + 3; // Random integer from 3 to 6
        }
      }

      // Only create cashback record and update balance if there is a cashback
      if (cashbackAmount > 0) {
        await prisma.cashback.create({
          data: {
            userId: invoice.userId,
            invoiceId: invoice.id,
            amount: cashbackAmount,
            type: invoice.isMerchant ? "MERCHANT" : "STANDARD",
          },
        });

        // Update user balance
        await prisma.user.update({
          where: {
            id: invoice.userId,
          },
          data: {
            balance: {
              increment: cashbackAmount,
            },
          },
        });
      }
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
