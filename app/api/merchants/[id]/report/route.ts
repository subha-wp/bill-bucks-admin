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
        status: true,
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
    let lastCycleStartDate: Date;
    let lastCycleEndDate: Date;

    if (currentDay <= 14) {
      cycleStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      cycleEndDate = new Date(now.getFullYear(), now.getMonth(), 14);
      lastCycleStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 15);
      lastCycleEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      cycleStartDate = new Date(now.getFullYear(), now.getMonth(), 15);
      cycleEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      lastCycleStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      lastCycleEndDate = new Date(now.getFullYear(), now.getMonth(), 14);
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

    // Get last cycle invoices
    const lastCycleInvoices = await prisma.invoice.findMany({
      where: {
        merchantId,
        createdAt: {
          gte: lastCycleStartDate,
          lte: lastCycleEndDate,
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

    // Calculate last cycle totals
    const lastCycleTotals = lastCycleInvoices.reduce(
      (acc, invoice) => ({
        totalAmount: acc.totalAmount + Number(invoice.amount),
        totalCashback:
          acc.totalCashback + Number(invoice.cashback?.amount || 0),
      }),
      { totalAmount: 0, totalCashback: 0 }
    );

    // Get billing cycles from database
    const [currentBillingCycle, lastBillingCycle] = await Promise.all([
      prisma.billingCycle.findFirst({
        where: {
          merchantId,
          startDate: cycleStartDate,
          endDate: cycleEndDate,
        },
      }),
      prisma.billingCycle.findFirst({
        where: {
          merchantId,
          startDate: lastCycleStartDate,
          endDate: lastCycleEndDate,
        },
      }),
    ]);

    const currentCycle = {
      id: currentBillingCycle?.id || "current",
      startDate: cycleStartDate,
      endDate: cycleEndDate,
      totalInvoices: currentCycleInvoices.length,
      totalAmount: currentCycleTotals.totalAmount,
      totalCashback: currentCycleTotals.totalCashback,
      serviceCharge: currentCycleTotals.totalAmount * 0.03, // 3% service charge
      status: currentBillingCycle?.status || "PENDING",
    };

    const lastCycle = lastBillingCycle
      ? {
          id: lastBillingCycle.id,
          startDate: lastCycleStartDate,
          endDate: lastCycleEndDate,
          totalInvoices: lastCycleInvoices.length,
          totalAmount: lastCycleTotals.totalAmount,
          totalCashback: lastCycleTotals.totalCashback,
          serviceCharge: lastCycleTotals.totalAmount * 0.03,
          status: lastBillingCycle.status,
        }
      : null;

    // Get recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      where: {
        merchantId,
        createdAt: {
          gte: cycleStartDate,
          lte: cycleEndDate,
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
      lastCycle,
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
