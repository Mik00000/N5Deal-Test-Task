import { PrismaClient, Role, UserStatus, AssetStatus, InquiryStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data
  await prisma.inquiry.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.user.deleteMany();

  // Create Users (Platform Managers, Sellers, Buyers)
  console.log("Creating Users...");

  // Platform Managers
  const pm1 = await prisma.user.create({
    data: {
      name: "Alexander Vance",
      email: "alexander.vance@n5deal.com",
      role: Role.PLATFORM_MANAGER,
      company: "N5Deal Capital",
      status: UserStatus.ACTIVE,
    },
  });

  const pm2 = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      email: "elena.rostova@n5deal.com",
      role: Role.PLATFORM_MANAGER,
      company: "N5Deal Capital",
      status: UserStatus.ACTIVE,
    },
  });

  // Sellers
  const seller1 = await prisma.user.create({
    data: {
      name: "Marcus Sterling",
      email: "marcus@fintechholdings.eu",
      role: Role.SELLER,
      company: "Nordic PayTech Group",
      status: UserStatus.ACTIVE,
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      name: "Claire Dupont",
      email: "c.dupont@wealthcore.fr",
      role: Role.SELLER,
      company: "WealthCore Technologies",
      status: UserStatus.ACTIVE,
    },
  });

  const seller3 = await prisma.user.create({
    data: {
      name: "David K. Miller",
      email: "david@regtechsolutions.co.uk",
      role: Role.SELLER,
      company: "RegTech Compliance Global",
      status: UserStatus.ACTIVE,
    },
  });

  const sellerPending = await prisma.user.create({
    data: {
      name: "Julian Thorne",
      email: "julian@insurwave.io",
      role: Role.SELLER,
      company: "InsurWave Systems",
      status: UserStatus.PENDING,
    },
  });

  // Buyers
  const buyer1 = await prisma.user.create({
    data: {
      name: "Victoria Chen",
      email: "vchen@apexventures.com",
      role: Role.BUYER,
      company: "Apex Growth Ventures",
      status: UserStatus.ACTIVE,
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      name: "Henrik Lindqvist",
      email: "h.lindqvist@balticpe.com",
      role: Role.BUYER,
      company: "Baltic Private Equity",
      status: UserStatus.ACTIVE,
    },
  });

  const buyer3 = await prisma.user.create({
    data: {
      name: "Sophia Martinez",
      email: "smartinez@globalfinpartners.com",
      role: Role.BUYER,
      company: "Global Financial Partners",
      status: UserStatus.ACTIVE,
    },
  });

  const buyer4 = await prisma.user.create({
    data: {
      name: "Arthur Pendelton",
      email: "apendelton@heritagecap.co.uk",
      role: Role.BUYER,
      company: "Heritage Capital Management",
      status: UserStatus.ACTIVE,
    },
  });

  const buyerInactive = await prisma.user.create({
    data: {
      name: "Robert Langford",
      email: "rlangford@oldcapital.com",
      role: Role.BUYER,
      company: "Legacy Strategic Fund",
      status: UserStatus.INACTIVE,
    },
  });

  console.log("Creating Assets / Mandates...");

  // Seller 1 Assets
  const asset1 = await prisma.asset.create({
    data: {
      title: "Cross-Border B2B Payment Gateway & FX API Platform",
      codeName: "Project PayTech Swift",
      sector: "Payments",
      geography: "UK & Nordics",
      revenue: "€14.2M ARR",
      revenueNum: 14200000,
      ebitda: "€4.1M (28.8% margin)",
      askingPrice: "€48M",
      askingPriceNum: 48000000,
      status: AssetStatus.ACTIVE,
      inquiryCount: 14, // As per CONTEXT.md example: "14"
      teaser:
        "Established enterprise payment gateway with tier-1 banking integrations across Europe and proprietary FX clearing rails. High net revenue retention (118%) and sticky client base of 250+ mid-market merchants.",
      highlights:
        "118% NRR | 250+ Enterprise Clients | FCA Authorized EMI License | 99.999% API Uptime | €2.4B Annual Processed Volume",
      sellerId: seller1.id,
    },
  });

  const asset2 = await prisma.asset.create({
    data: {
      title: "AI-Powered Wealth & Portfolio Management Infrastructure",
      codeName: "Project WealthCore AI",
      sector: "WealthTech",
      geography: "DACH Region & Switzerland",
      revenue: "€8.7M ARR",
      revenueNum: 8700000,
      ebitda: "€2.3M (26.4% margin)",
      askingPrice: "€32M",
      askingPriceNum: 32000000,
      status: AssetStatus.ACTIVE,
      inquiryCount: 21, // As per CONTEXT.md example: "21"
      teaser:
        "Cloud-native SaaS platform offering automated portfolio rebalancing, ESG compliance scoring, and robo-advisory APIs for private banks and wealth managers.",
      highlights:
        "€14B Assets Under Administration | 42 Institutional Accounts | SOC2 Type II Certified | 40% YoY ARR Growth",
      sellerId: seller2.id,
    },
  });

  const asset3 = await prisma.asset.create({
    data: {
      title: "Automated AML & Transaction Monitoring Compliance Suite",
      codeName: "Project RegTech Shield",
      sector: "RegTech",
      geography: "Pan-European",
      revenue: "€6.1M ARR",
      revenueNum: 6100000,
      ebitda: "€1.8M (29.5% margin)",
      askingPrice: "€24M",
      askingPriceNum: 24000000,
      status: AssetStatus.ACTIVE,
      inquiryCount: 7, // As per CONTEXT.md example: "7"
      teaser:
        "Regulatory compliance engine utilizing graph neural networks for real-time sanction screening, suspicious activity reporting (SAR), and KYC verification.",
      highlights:
        "Real-time GNN Detection Engine | Fully Compliant with EU 6AMLD | 85+ Bank Customers | Zero Major Customer Churn in 3 Yrs",
      sellerId: seller3.id,
    },
  });

  const asset4 = await prisma.asset.create({
    data: {
      title: "Commercial Embedded Insurance & Claims API SaaS",
      codeName: "Project InsurStack",
      sector: "InsurTech",
      geography: "Western Europe",
      revenue: "€3.9M ARR",
      revenueNum: 3900000,
      ebitda: "€0.9M (23.0% margin)",
      askingPrice: "€16M",
      askingPriceNum: 16000000,
      status: AssetStatus.UNDER_LOI,
      inquiryCount: 18,
      teaser:
        "API-first embedded insurance orchestration software enabling e-commerce platforms and neobanks to offer real-time point-of-sale policy underwriting.",
      highlights:
        "1.2M Policies Written Annually | Modular Microservices Architecture | Multi-Carrier Integration | 55% Gross Margin",
      sellerId: seller1.id,
    },
  });

  const asset5 = await prisma.asset.create({
    data: {
      title: "Institutional Crypto Custody & Settlement Network",
      codeName: "Project DigitalVault",
      sector: "Crypto & Digital Assets",
      geography: "North America & UK",
      revenue: "€18.5M ARR",
      revenueNum: 18500000,
      ebitda: "€6.2M (33.5% margin)",
      askingPrice: "€75M",
      askingPriceNum: 75000000,
      status: AssetStatus.ACTIVE,
      inquiryCount: 29,
      teaser:
        "MPC-based hardware-secured digital asset custody solution built specifically for asset managers, hedge funds, and prime brokerages.",
      highlights:
        "$4.8B Assets in Custody | MPC & Hardware Isolation | Lloyds Underwritten Insurance Policy | ISO 27001 Certified",
      sellerId: seller2.id,
    },
  });

  console.log("Creating Inquiries / Buyer Interests...");

  await prisma.inquiry.createMany({
    data: [
      {
        assetId: asset1.id,
        buyerId: buyer1.id,
        status: InquiryStatus.NDA_SIGNED,
        notes: "Buyer requested management call and preliminary financial model.",
      },
      {
        assetId: asset1.id,
        buyerId: buyer2.id,
        status: InquiryStatus.DATA_ROOM_ACCESS,
        notes: "Full VDR access granted on Aug 18, 2026.",
      },
      {
        assetId: asset1.id,
        buyerId: buyer3.id,
        status: InquiryStatus.NEW_INQUIRY,
        notes: "Initial teaser downloaded.",
      },
      {
        assetId: asset2.id,
        buyerId: buyer1.id,
        status: InquiryStatus.DATA_ROOM_ACCESS,
        notes: "Reviewing tech stack and Swiss regulatory approvals.",
      },
      {
        assetId: asset2.id,
        buyerId: buyer4.id,
        status: InquiryStatus.LOI_SUBMITTED,
        notes: "Submitted non-binding offer at €31.5M valuation.",
      },
      {
        assetId: asset3.id,
        buyerId: buyer3.id,
        status: InquiryStatus.NDA_SIGNED,
        notes: "Compliance due diligence in progress.",
      },
    ],
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
