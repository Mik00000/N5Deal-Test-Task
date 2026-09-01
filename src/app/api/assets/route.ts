import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AssetStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sector = searchParams.get("sector") || "";
    const geography = searchParams.get("geography") || "";
    const sellerId = searchParams.get("sellerId") || "";
    const sortBy = searchParams.get("sortBy") || "newest";

    const whereClause: any = {};

    if (sellerId) {
      whereClause.sellerId = sellerId;
    }

    if (sector && sector !== "ALL") {
      whereClause.sector = sector;
    }

    if (geography && geography !== "ALL") {
      whereClause.geography = geography;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { codeName: { contains: search } },
        { teaser: { contains: search } },
        { sector: { contains: search } },
        { highlights: { contains: search } },
      ];
    }

    let orderByClause: any = { createdAt: "desc" };

    if (sortBy === "price-asc") {
      orderByClause = { askingPriceNum: "asc" };
    } else if (sortBy === "price-desc") {
      orderByClause = { askingPriceNum: "desc" };
    } else if (sortBy === "revenue-desc") {
      orderByClause = { revenueNum: "desc" };
    } else if (sortBy === "inquiries-desc") {
      orderByClause = { inquiryCount: "desc" };
    }

    const assets = await prisma.asset.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        _count: {
          select: { inquiries: true },
        },
      },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      codeName,
      sector,
      geography,
      revenue,
      revenueNum,
      ebitda,
      askingPrice,
      askingPriceNum,
      teaser,
      highlights,
      sellerId,
      status,
    } = body;

    if (!title || !sector || !sellerId || !askingPrice) {
      return NextResponse.json(
        { error: "Missing required fields (title, sector, sellerId, askingPrice)" },
        { status: 400 }
      );
    }

    // Generate unique codeName if not provided
    const generatedCodeName =
      codeName || `Project ${sector.replace(/[^a-zA-Z]/g, "")}-${Math.floor(100 + Math.random() * 900)}`;

    const parsedPriceNum = askingPriceNum || parseFloat(askingPrice.replace(/[^0-9.]/g, "")) * 1000000 || 10000000;
    const parsedRevNum = revenueNum || parseFloat((revenue || "").replace(/[^0-9.]/g, "")) * 1000000 || 2000000;

    const asset = await prisma.asset.create({
      data: {
        title,
        codeName: generatedCodeName,
        sector,
        geography: geography || "Pan-European",
        revenue: revenue || "€2.5M ARR",
        revenueNum: parsedRevNum,
        ebitda: ebitda || "€0.8M (25% margin)",
        askingPrice,
        askingPriceNum: parsedPriceNum,
        status: status ? (status as AssetStatus) : AssetStatus.ACTIVE,
        teaser: teaser || `${title} - Verified fintech M&A opportunity.`,
        highlights: highlights || "Enterprise Clients | Fully Licensed | High Growth",
        sellerId,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}
