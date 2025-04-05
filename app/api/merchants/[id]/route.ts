import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const merchant = await prisma.merchant.findUnique({
      where: {
        id: id,
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(merchant);
  } catch (error) {
    console.error("Error fetching merchant:", error);
    return NextResponse.json(
      { error: "Failed to fetch merchant" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      category,
      openingTime,
      closingTime,
      isOpen,
      rating,
    } = body;

    // Validate required fields
    if (!name || !address || !phone || !city) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert string values to numbers where needed
    const parsedCashback = parseFloat(cashbackAmount);
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);
    const parsedRating = parseFloat(rating);

    const merchant = await prisma.merchant.update({
      where: {
        id: id,
      },
      data: {
        name,
        address,
        phone,
        city,
        cashbackAmount: parsedCashback,
        logoUrl,
        shopImageUrl,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        category,
        openingTime,
        closingTime,
        isOpen,
        rating: parsedRating,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(merchant);
  } catch (error) {
    console.error("Error updating merchant:", error);
    return NextResponse.json(
      { error: "Failed to update merchant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.merchant.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting merchant:", error);
    return NextResponse.json(
      { error: "Failed to delete merchant" },
      { status: 500 }
    );
  }
}
