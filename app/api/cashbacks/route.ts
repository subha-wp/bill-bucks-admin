import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cashbacks = await prisma.cashback.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        invoice: {
          include: {
            merchant: true,
          },
        },
      },
    });

    return NextResponse.json(cashbacks);
  } catch (error) {
    console.error("Error fetching cashbacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashbacks" },
      { status: 500 }
    );
  }
}
