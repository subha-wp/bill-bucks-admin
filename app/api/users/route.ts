import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        balance: true,
        subscribe: true,
        referralCode: true,
        createdAt: true,
        avatarUrl: true,
        _count: {
          select: {
            invoices: true,
            withdrawals: true,
            cashbacks: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
