/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type === "merchant") {
      where.isMerchant = true;
    } else if (type === "non-merchant") {
      where.isMerchant = false;
    }

    if (search) {
      where.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          merchant: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        take: limit,
        skip,
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          merchant: true,
          cashback: true,
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      invoices,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
