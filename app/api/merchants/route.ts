import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(merchants);
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
