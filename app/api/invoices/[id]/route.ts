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

      // Only merchant invoices with amount > 200 get cashback
      if (invoice.isMerchant && Number(invoice.amount) > 200) {
        // Generate a random cashback amount between 3 and 6 (inclusive)
        cashbackAmount = Math.floor(Math.random() * 4) + 3; // Random integer from 3 to 6
      }

      // Only create cashback record and update balance if there is a cashback
      if (cashbackAmount > 0) {
        await prisma.cashback.create({
          data: {
            userId: invoice.userId,
            invoiceId: invoice.id,
            amount: cashbackAmount,
            type: "MERCHANT", // Only merchant invoices get cashback
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
