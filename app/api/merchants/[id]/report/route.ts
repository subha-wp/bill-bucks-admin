import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const merchantId = id;

    // Get merchant details
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        cashbackAmount: true,
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    // Calculate current billing cycle dates
    const now = new Date();
    const currentDay = now.getDate();
    let cycleStartDate: Date;
    let cycleEndDate: Date;

    if (currentDay <= 14) {
      cycleStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      cycleEndDate = new Date(now.getFullYear(), now.getMonth(), 14);
    } else {
      cycleStartDate = new Date(now.getFullYear(), now.getMonth(), 15);
      cycleEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Get current cycle invoices
    const currentCycleInvoices = await prisma.invoice.findMany({
      where: {
        merchantId,
        createdAt: {
          gte: cycleStartDate,
          lte: cycleEndDate,
        },
        status: "APPROVED",
      },
      include: {
        cashback: true,
      },
    });

    // Calculate current cycle totals
    const currentCycleTotals = currentCycleInvoices.reduce(
      (acc, invoice) => ({
        totalAmount: acc.totalAmount + Number(invoice.amount),
        totalCashback:
          acc.totalCashback + Number(invoice.cashback?.amount || 0),
      }),
      { totalAmount: 0, totalCashback: 0 }
    );

    const currentCycle = {
      startDate: cycleStartDate,
      endDate: cycleEndDate,
      totalInvoices: currentCycleInvoices.length,
      totalAmount: currentCycleTotals.totalAmount,
      totalCashback: currentCycleTotals.totalCashback,
      serviceCharge: currentCycleTotals.totalAmount * 0.03, // 3% service charge
      status: "PENDING" as const,
    };

    // Get previous cycles (last 3 cycles)
    const previousCycles = [];
    for (let i = 1; i <= 3; i++) {
      const cycleStart =
        currentDay <= 14
          ? new Date(
              now.getFullYear(),
              now.getMonth() - Math.ceil(i / 2),
              i % 2 === 1 ? 15 : 1
            )
          : new Date(
              now.getFullYear(),
              now.getMonth() - Math.floor(i / 2),
              i % 2 === 0 ? 15 : 1
            );

      const cycleEnd =
        currentDay <= 14
          ? new Date(
              now.getFullYear(),
              now.getMonth() - Math.floor(i / 2),
              i % 2 === 1 ? 31 : 14
            )
          : new Date(
              now.getFullYear(),
              now.getMonth() - Math.floor(i / 2),
              i % 2 === 0 ? 31 : 14
            );

      const cycleInvoices = await prisma.invoice.findMany({
        where: {
          merchantId,
          createdAt: {
            gte: cycleStart,
            lte: cycleEnd,
          },
          status: "APPROVED",
        },
        include: {
          cashback: true,
        },
      });

      const cycleTotals = cycleInvoices.reduce(
        (acc, invoice) => ({
          totalAmount: acc.totalAmount + Number(invoice.amount),
          totalCashback:
            acc.totalCashback + Number(invoice.cashback?.amount || 0),
        }),
        { totalAmount: 0, totalCashback: 0 }
      );

      previousCycles.push({
        startDate: cycleStart,
        endDate: cycleEnd,
        totalInvoices: cycleInvoices.length,
        totalAmount: cycleTotals.totalAmount,
        totalCashback: cycleTotals.totalCashback,
        serviceCharge: cycleTotals.totalAmount * 0.03,
        status: Math.random() > 0.5 ? "PAID" : "OVERDUE", // Simulated status
      });
    }

    // Get recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      where: {
        merchantId,
        createdAt: {
          gte: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Last 15 days
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        cashback: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({
      merchant,
      currentCycle,
      previousCycles,
      recentInvoices,
    });
  } catch (error) {
    console.error("Error fetching merchant report:", error);
    return NextResponse.json(
      { error: "Failed to fetch merchant report" },
      { status: 500 }
    );
  }
}
