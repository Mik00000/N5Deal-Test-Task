import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sector = searchParams.get("sector") || "";
    const geography = searchParams.get("geography") || "";
    const sortBy = searchParams.get("sortBy") || "newest";

    const whereClause: any = {};

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
      },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
  }
}
