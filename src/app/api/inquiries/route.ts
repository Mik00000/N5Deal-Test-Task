import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, buyerId, notes } = body;

    if (!assetId || !buyerId) {
      return NextResponse.json(
        { error: "assetId and buyerId are required" },
        { status: 400 }
      );
    }

    // Upsert or create inquiry
    const inquiry = await prisma.inquiry.upsert({
      where: {
        assetId_buyerId: {
          assetId,
          buyerId,
        },
      },
      update: {
        notes: notes || "Buyer re-submitted inquiry.",
        status: "NEW_INQUIRY",
      },
      create: {
        assetId,
        buyerId,
        notes: notes || "Buyer submitted inquiry request.",
        status: "NEW_INQUIRY",
      },
    });

    // Increment asset inquiryCount
    await prisma.asset.update({
      where: { id: assetId },
      data: {
        inquiryCount: { increment: 1 },
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
