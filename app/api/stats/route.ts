import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalRevenue,
      totalCashbacks,
      pendingWithdrawals,
      activeUsers,
      recentTransactions,
    ] = await Promise.all([
      prisma.invoice.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "APPROVED",
        },
      }),
      prisma.cashback.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.withdrawal.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "PENDING",
        },
      }),
      prisma.user.count(),
      prisma.invoice.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
        where: {
          status: "APPROVED",
        },
      }),
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      totalCashbacks: totalCashbacks._sum.amount || 0,
      pendingWithdrawals: pendingWithdrawals._sum.amount || 0,
      activeUsers,
      recentTransactions,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
