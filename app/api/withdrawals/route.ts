import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        take: limit,
        skip,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      }),
      prisma.withdrawal.count(),
    ]);

    return NextResponse.json({
      withdrawals,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
