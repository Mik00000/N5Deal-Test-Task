"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import {
  Store,
  Plus,
  BarChart2,
  Users,
  Target,
  Clock,
  MoreHorizontal,
  Send,
  Loader2,
  Trash2,
  Building2,
  Filter,
  CheckCircle2,
  X,
  FileText,
  Sparkles,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Asset {
  id: string;
  title: string;
  codeName: string;
  sector: string;
  geography: string;
  revenue: string;
  revenueNum: number;
  ebitda: string;
  askingPrice: string;
  askingPriceNum: number;
  status: string;
  inquiryCount: number;
  teaser: string;
  highlights: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

interface BuyerUser {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
}

export default function SellerDashboardView() {
  const { currentUser } = useRole();

  const [mandates, setMandates] = useState<Asset[]>([]);
  const [buyers, setBuyers] = useState<BuyerUser[]>([]);
  const [isLoadingMandates, setIsLoadingMandates] = useState(true);

  // Buyer Search & Filter State
  const [buyerSearchQuery, setBuyerSearchQuery] = useState("");
  const [buyerFocusFilter, setBuyerFocusFilter] = useState("ALL");

  // Modal States
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSubmittingAsset, setIsSubmittingAsset] = useState(false);
  const [isGeneratingAiTeaser, setIsGeneratingAiTeaser] = useState(false);

  // Send Memo Modal State
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerUser | null>(null);
  const [selectedMandateForMemo, setSelectedMandateForMemo] = useState<string>("");
  const [memoNote, setMemoNote] = useState("");
  const [memoSentSuccess, setMemoSentSuccess] = useState(false);

  // New Asset Form State
  const [newAssetTitle, setNewAssetTitle] = useState("");
  const [newAssetSector, setNewAssetSector] = useState("Payments");
  const [newAssetGeo, setNewAssetGeo] = useState("UK & Nordics");
  const [newAssetValuation, setNewAssetValuation] = useState("€15M");
  const [newAssetRevenue, setNewAssetRevenue] = useState("€4.5M ARR");
  const [newAssetEbitda, setNewAssetEbitda] = useState("€1.2M (26.6% margin)");
  const [newAssetTeaser, setNewAssetTeaser] = useState("");
  const [newAssetHighlights, setNewAssetHighlights] = useState(
    "FCA EMI License | SEPA Instant Rails | 150+ Enterprise Merchants"
  );

  // Load seller's mandates from database
  const fetchMandates = async () => {
    setIsLoadingMandates(true);
    try {
      const res = await fetch("/api/assets");
      if (res.ok) {
        const data = await res.json();
        setMandates(data);
      }
    } catch (err) {
      console.error("Failed to fetch mandates:", err);
    } finally {
      setIsLoadingMandates(false);
    }
  };

  // Load buyer users from database
  const fetchBuyers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data: BuyerUser[] = await res.json();
        setBuyers(data.filter((u) => u.id !== currentUser?.id));
      }
    } catch (err) {
      console.error("Failed to fetch buyers:", err);
    }
  };

  useEffect(() => {
    fetchMandates();
    fetchBuyers();
  }, [currentUser]);

  // AI Teaser Generator Helper
  const handleGenerateAiTeaser = () => {
    setIsGeneratingAiTeaser(true);
    setTimeout(() => {
      const title = newAssetTitle || "Cross-Border Fintech Infrastructure Platform";
      const sector = newAssetSector || "Payments";

      setNewAssetTeaser(
        `High-growth ${sector} platform specializing in ${title}. Fully licensed entity with proprietary technology, robust regulatory compliance, and a strong pipeline of recurring enterprise contracts.`
      );
      setNewAssetHighlights(
        `Tier-1 Banking Partnerships | ${sector} Regulatory Compliance | 99.99% Uptime API | Turnkey Integration`
      );
      setIsGeneratingAiTeaser(false);
    }, 600);
  };

  // Delete Mandate Handler
  const handleDeleteMandate = async (id: string) => {
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMandates();
      }
    } catch (err) {
      console.error("Failed to delete mandate:", err);
    }
  };

  // Publish Asset Submit Handler
  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle || !currentUser) return;

    setIsSubmittingAsset(true);
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAssetTitle,
          sector: newAssetSector,
          geography: newAssetGeo,
          askingPrice: newAssetValuation,
          revenue: newAssetRevenue,
          ebitda: newAssetEbitda,
          teaser: newAssetTeaser || `Strategic ${newAssetSector} acquisition opportunity located in ${newAssetGeo}.`,
          highlights: newAssetHighlights || "FCA License | Strong ARR",
          sellerId: currentUser.id,
        }),
      });

      if (res.ok) {
        setIsPublishModalOpen(false);
        setNewAssetTitle("");
        setNewAssetTeaser("");
        fetchMandates();
      }
    } catch (err) {
      console.error("Failed to publish asset:", err);
    } finally {
      setIsSubmittingAsset(false);
    }
  };

  // Calculate Metrics
  const totalValuationNum = mandates.reduce((sum, m) => sum + (m.askingPriceNum || 0), 0);
  const formattedTotalValuation =
    totalValuationNum >= 1000000
      ? `€${(totalValuationNum / 1000000).toFixed(0)}M`
      : `€${totalValuationNum.toLocaleString()}`;

  const totalInquiries = mandates.reduce((sum, m) => sum + (m.inquiryCount || 0), 0);

  // Buyer Focus Tag Helper
  const getBuyerFocusTags = (name: string, company: string) => {
    if (name.includes("Victoria") || company.includes("Apex")) return ["Payments", "WealthTech"];
    if (name.includes("Henrik") || company.includes("Baltic")) return ["Banking Infrastructure", "PayTech"];
    if (name.includes("Sophia") || company.includes("Global")) return ["InsurTech", "RegTech"];
    if (name.includes("Arthur") || company.includes("Heritage")) return ["InsurTech", "RegTech"];
    return ["Fintech M&A", "RegTech"];
  };

  const getBuyerBudget = (name: string) => {
    if (name.includes("Victoria")) return "€5M – €25M";
    if (name.includes("Henrik")) return "€10M – €50M";
    return "€2M – €15M";
  };

  // Filtered Buyers
  const filteredBuyers = buyers.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
      b.company.toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(buyerSearchQuery.toLowerCase());

    const focusTags = getBuyerFocusTags(b.name, b.company);
    const matchesFocus = buyerFocusFilter === "ALL" || focusTags.includes(buyerFocusFilter);

    return matchesSearch && matchesFocus;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Store className="w-6 h-6 text-blue-600" />
            Seller Dashboard & Mandates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage published assets, track inbound inquiries, and engage qualified buyers.
          </p>
        </div>
        <Button
          onClick={() => setIsPublishModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Publish New Asset
        </Button>
      </div>

      {/* 2. Key Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Asset Valuation
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formattedTotalValuation}</div>
            <p className="text-xs font-medium text-emerald-600 mt-1.5">Across active mandates</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active Inquiries
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalInquiries} Requests</div>
            <p className="text-xs font-medium text-slate-500 mt-1.5">Inbound buyer NDAs</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Success Probability
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">74% High</div>
            <p className="text-xs font-medium text-purple-600 mt-1.5">Based on market demand</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Avg Time to Close
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">38 Days</div>
            <p className="text-xs font-medium text-slate-500 mt-1.5">LOI to execution</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Active Mandates Table */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Active Mandates</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Live listings currently visible to verified institutional buyers.
            </p>
          </div>
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold">
            {mandates.length} Published
          </Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Asset ID</th>
                <th className="px-6 py-3.5">Asset Name & Sector</th>
                <th className="px-6 py-3.5">Valuation</th>
                {/* Inquiries column: plain text numbers ONLY per CONTEXT.md line 8 */}
                <th className="px-6 py-3.5">Inquiries</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date Listed</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoadingMandates ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading seller mandates...
                  </td>
                </tr>
              ) : mandates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No active mandates published yet. Click &apos;+ Publish New Asset&apos; to create one.
                  </td>
                </tr>
              ) : (
                mandates.map((mandate) => (
                  <tr key={mandate.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-700">
                      {mandate.codeName}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{mandate.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {mandate.sector} • {mandate.geography}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-extrabold text-blue-600">
                      {mandate.askingPrice}
                    </td>

                    {/* Strict Compliance: Plain text numbers ONLY per CONTEXT.md line 8 */}
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {mandate.inquiryCount}
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          mandate.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : mandate.status === "LOI"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {mandate.status === "ACTIVE" ? "Live" : mandate.status === "LOI" ? "Under LOI" : "Draft"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(mandate.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-md rounded-lg p-1 text-xs">
                          <DropdownMenuItem
                            onClick={() => handleDeleteMandate(mandate.id)}
                            className="text-rose-600 hover:bg-rose-50 rounded-md px-3 py-2 cursor-pointer flex items-center gap-2 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Archive Mandate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Investor Pool (Browse Buyers + Search/Filter) */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Investor Pool</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified buyers and institutional investors matched to your Fintech portfolio.
            </p>
          </div>

          {/* Search & Sector Filter Controls for Buyers */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search buyer name or firm..."
                value={buyerSearchQuery}
                onChange={(e) => setBuyerSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
              />
            </div>

            <select
              value={buyerFocusFilter}
              onChange={(e) => setBuyerFocusFilter(e.target.value)}
              className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Focus Areas</option>
              <option value="Payments">Payments</option>
              <option value="WealthTech">WealthTech</option>
              <option value="RegTech">RegTech</option>
              <option value="Banking Infrastructure">Banking Infra</option>
              <option value="InsurTech">InsurTech</option>
            </select>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Investor Entity</th>
                <th className="px-6 py-3.5">Focus Areas</th>
                <th className="px-6 py-3.5">Budget Range</th>
                <th className="px-6 py-3.5">Stage</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBuyers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No buyers match current search filter.
                  </td>
                </tr>
              ) : (
                filteredBuyers.map((buyer) => {
                  const focusTags = getBuyerFocusTags(buyer.name, buyer.company);
                  const budget = getBuyerBudget(buyer.name);

                  return (
                    <tr key={buyer.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">
                              {getInitials(buyer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-slate-900">{buyer.name}</div>
                            <div className="text-[11px] text-slate-500">{buyer.company}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {focusTags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900">{budget}</td>

                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold"
                        >
                          Qualified
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          onClick={() => {
                            setSelectedBuyer(buyer);
                            setMemoSentSuccess(false);
                            setMemoNote("");
                          }}
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-xs rounded-lg gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send Memo
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. Publish New Asset Modal Form */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="max-w-xl bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Publish New M&A Asset Mandate
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              List a fintech asset on the N5Deal marketplace for verified institutional buyers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePublishSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Asset Mandate Title</label>
              <Input
                required
                placeholder="e.g. European PayTech Gateway & SEPA Rail Engine"
                value={newAssetTitle}
                onChange={(e) => setNewAssetTitle(e.target.value)}
                className="h-9 text-xs bg-slate-50 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Fintech Sector</label>
                <select
                  value={newAssetSector}
                  onChange={(e) => setNewAssetSector(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="Payments">Payments</option>
                  <option value="WealthTech">WealthTech</option>
                  <option value="RegTech">RegTech</option>
                  <option value="InsurTech">InsurTech</option>
                  <option value="Crypto & Digital Assets">Crypto & Digital Assets</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jurisdiction</label>
                <select
                  value={newAssetGeo}
                  onChange={(e) => setNewAssetGeo(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="UK & Nordics">UK & Nordics</option>
                  <option value="DACH Region & Switzerland">DACH Region & Switzerland</option>
                  <option value="Pan-European">Pan-European</option>
                  <option value="Western Europe">Western Europe</option>
                  <option value="North America & UK">North America & UK</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Valuation Asking</label>
                <Input
                  required
                  placeholder="e.g. €25M"
                  value={newAssetValuation}
                  onChange={(e) => setNewAssetValuation(e.target.value)}
                  className="h-9 text-xs bg-slate-50 border-slate-200 font-semibold text-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Annual Revenue</label>
                <Input
                  required
                  placeholder="e.g. €6.2M ARR"
                  value={newAssetRevenue}
                  onChange={(e) => setNewAssetRevenue(e.target.value)}
                  className="h-9 text-xs bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">EBITDA Margin</label>
                <Input
                  required
                  placeholder="e.g. €1.8M (29%)"
                  value={newAssetEbitda}
                  onChange={(e) => setNewAssetEbitda(e.target.value)}
                  className="h-9 text-xs bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            {/* AI Teaser Generator Button */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">Executive Teaser Summary</label>
                <button
                  type="button"
                  onClick={handleGenerateAiTeaser}
                  disabled={isGeneratingAiTeaser}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"
                >
                  <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                  {isGeneratingAiTeaser ? "Generating AI Copy..." : "✨ Auto-Generate AI Teaser"}
                </button>
              </div>
              <textarea
                rows={3}
                required
                placeholder="High-level teaser summary for potential acquirers..."
                value={newAssetTeaser}
                onChange={(e) => setNewAssetTeaser(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Key Highlights (Separated by |)</label>
              <Input
                placeholder="FCA License | SEPA Instant | 150+ Merchant Clients"
                value={newAssetHighlights}
                onChange={(e) => setNewAssetHighlights(e.target.value)}
                className="h-9 text-xs bg-slate-50 border-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPublishModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingAsset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                {isSubmittingAsset ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Publish Mandate
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. Send Memo to Buyer Modal */}
      <Dialog open={!!selectedBuyer} onOpenChange={(open) => !open && setSelectedBuyer(null)}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          {selectedBuyer && (
            <div className="space-y-4">
              <DialogHeader className="pb-2 border-b border-slate-100">
                <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  Dispatch Teaser Memo
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Send a confidential teaser memo to {selectedBuyer.name} ({selectedBuyer.company}).
                </DialogDescription>
              </DialogHeader>

              {memoSentSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">Teaser Memo Dispatched!</p>
                  <p className="text-[11px] text-emerald-700">
                    {selectedBuyer.name} has been notified with your mandate teaser details.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setMemoSentSuccess(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Select Mandate to Share</label>
                    <select
                      value={selectedMandateForMemo}
                      onChange={(e) => setSelectedMandateForMemo(e.target.value)}
                      className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      {mandates.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.codeName} — {m.title} ({m.askingPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Personal Note</label>
                    <textarea
                      rows={3}
                      value={memoNote}
                      onChange={(e) => setMemoNote(e.target.value)}
                      placeholder="Hi, sharing our confidential mandate teaser matching your acquisition criteria..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedBuyer(null)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Dispatch Memo
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
