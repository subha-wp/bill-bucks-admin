import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        take: limit,
        skip,
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
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
