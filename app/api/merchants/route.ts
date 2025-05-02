import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [merchants, total] = await Promise.all([
      prisma.merchant.findMany({
        take: limit,
        skip,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.merchant.count(),
    ]);

    return NextResponse.json({
      merchants,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return NextResponse.json(
      { error: "Failed to fetch merchants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      phone,
      city,
      cashbackAmount,
      logoUrl,
      shopImageUrl,
      latitude,
      longitude,
    } = body;

    const merchant = await prisma.merchant.create({
      data: {
        name,
        address,
        phone,
        city,
        cashbackAmount,
        logoUrl,
        shopImageUrl,
        latitude,
        longitude,
      },
    });

    return NextResponse.json(merchant);
  } catch (error) {
    console.error("Error creating merchant:", error);
    return NextResponse.json(
      { error: "Failed to create merchant" },
      { status: 500 }
    );
  }
}
