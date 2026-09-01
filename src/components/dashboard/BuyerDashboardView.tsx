"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import {
  Search,
  Sparkles,
  Filter,
  ArrowUpDown,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Globe,
  DollarSign,
  FileText,
  Send,
  Loader2,
  X,
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

interface Seller {
  id: string;
  name: string;
  email: string;
  company: string;
}

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
  seller: Seller;
  createdAt: string;
}

export default function BuyerDashboardView() {
  const { currentUser } = useRole();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [selectedGeography, setSelectedGeography] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [aiMatchActive, setAiMatchActive] = useState(false);

  // Modal State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Load assets from database
  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedSector !== "ALL") params.set("sector", selectedSector);
      if (selectedGeography !== "ALL") params.set("geography", selectedGeography);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/assets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (err) {
      console.error("Failed to load assets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [searchQuery, selectedSector, selectedGeography, sortBy]);

  // AI Heuristic Matcher: matches buyer target sectors (Payments, WealthTech, RegTech)
  const isAiMatched = (sector: string) =>
    ["Payments", "WealthTech", "RegTech"].includes(sector);

  const getAiScore = (sector: string) => {
    if (sector === "Payments") return "98%";
    if (sector === "WealthTech") return "94%";
    if (sector === "RegTech") return "91%";
    return "82%";
  };

  const displayedAssets = aiMatchActive
    ? assets.filter((a) => isAiMatched(a.sector))
    : assets;

  // Country Flag Helper
  const getFlag = (geo: string) => {
    if (geo.includes("UK") || geo.includes("Nordics")) return "🇬🇧 / 🇩🇰";
    if (geo.includes("DACH") || geo.includes("Switzerland")) return "🇩🇪 / 🇨🇭";
    if (geo.includes("Pan-European") || geo.includes("Western Europe")) return "🇪🇺";
    if (geo.includes("North America")) return "🇺🇸 / 🇬🇧";
    return "🌐";
  };

  // Submit Inquiry Handler
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !currentUser) return;

    setIsSubmittingInquiry(true);
    setInquirySuccess(false);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAsset.id,
          buyerId: currentUser.id,
          notes: inquiryNotes,
        }),
      });

      if (res.ok) {
        setInquirySuccess(true);
        setInquiryNotes("");
        fetchAssets();
      }
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Top KPI Cards (Simple, text-only per CONTEXT.md) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 shadow-xs bg-white hover:border-slate-300 transition-all rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Investment Interests
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12 Mandates</div>
            <p className="text-xs font-medium text-emerald-600 mt-1.5">+3 this week</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white hover:border-slate-300 transition-all rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active Inquiries
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">5 Assets</div>
            <p className="text-xs font-medium text-slate-500 mt-1.5">2 VDR Access Granted</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white hover:border-slate-300 transition-all rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              NDAs Signed
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">8 Agreements</div>
            <p className="text-xs font-medium text-emerald-600 mt-1.5">Fully Executed</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white hover:border-slate-300 transition-all rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Target Deal Range
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">€5M – €50M</div>
            <p className="text-xs font-medium text-slate-500 mt-1.5">PayTech & RegTech Focus</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Marketplace Controls (Search, Filters, AI Match, Sorting) */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search assets, licenses, keywords (e.g. PayTech, EMI, SOC2)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-slate-50/70 border-slate-200/80 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* AI Match Button */}
          <Button
            onClick={() => setAiMatchActive(!aiMatchActive)}
            className={`h-10 px-4 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              aiMatchActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs ring-2 ring-blue-500/30"
                : "bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200/80"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${aiMatchActive ? "text-amber-300 animate-pulse" : "text-blue-600"}`} />
            {aiMatchActive ? "AI Match: Active" : "AI Mandate Match"}
          </Button>
        </div>

        {/* Filter Dropdowns & Sorting Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
              <Filter className="w-3.5 h-3.5" />
              Filters:
            </div>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="h-8 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">All Sectors</option>
              <option value="Payments">Payments</option>
              <option value="WealthTech">WealthTech</option>
              <option value="RegTech">RegTech</option>
              <option value="InsurTech">InsurTech</option>
              <option value="Crypto & Digital Assets">Crypto & Digital Assets</option>
            </select>

            <select
              value={selectedGeography}
              onChange={(e) => setSelectedGeography(e.target.value)}
              className="h-8 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">All Jurisdictions</option>
              <option value="UK & Nordics">UK & Nordics</option>
              <option value="DACH Region & Switzerland">DACH & Switzerland</option>
              <option value="Pan-European">Pan-European</option>
              <option value="Western Europe">Western Europe</option>
              <option value="North America & UK">North America & UK</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="newest">Sort: Newest Listed</option>
              <option value="price-desc">Valuation: High to Low</option>
              <option value="price-asc">Valuation: Low to High</option>
              <option value="revenue-desc">Revenue: High to Low</option>
              <option value="inquiries-desc">Inquiries: Most Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Match Active Indicator Banner */}
      {aiMatchActive && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-semibold text-blue-900">
              AI Match Engine Active: Showing assets matching {currentUser?.company}&apos;s investment thesis (PayTech, WealthTech & RegTech).
            </span>
          </div>
          <button
            onClick={() => setAiMatchActive(false)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
          >
            Show All
          </button>
        </div>
      )}

      {/* 3. Asset Cards Grid (3 Columns on Desktop) */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading verified M&A assets...</p>
        </div>
      ) : displayedAssets.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No matching assets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or clear your sector filters to browse all active mandates.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedSector("ALL");
              setSelectedGeography("ALL");
              setAiMatchActive(false);
            }}
            variant="outline"
            size="sm"
            className="mt-2 text-xs"
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAssets.map((asset) => {
            const isMatched = isAiMatched(asset.sector);
            const score = getAiScore(asset.sector);

            return (
              <Card
                key={asset.id}
                className={`border shadow-xs bg-white hover:shadow-md hover:border-slate-300 transition-all rounded-xl flex flex-col justify-between overflow-hidden group ${
                  aiMatchActive && isMatched ? "border-blue-300 ring-1 ring-blue-500/20" : "border-slate-200/80"
                }`}
              >
                {/* Card Header */}
                <div className="p-5 pb-4 space-y-3 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base" role="img" aria-label="country">
                        {getFlag(asset.geography)}
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {asset.codeName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isMatched && (
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold px-2 py-0.5">
                          ✨ {score} Match
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-semibold px-2 py-0.5 ${
                          asset.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {asset.status === "ACTIVE" ? "Live Mandate" : "Under LOI"}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {asset.title}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {asset.sector}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {asset.geography}
                    </span>
                  </div>
                </div>

                {/* Financial Metrics Box */}
                <CardContent className="p-5 pt-4 space-y-4 flex-1">
                  <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-lg border border-slate-200/60 text-center">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                        Valuation
                      </span>
                      <span className="text-sm font-extrabold text-blue-600">
                        {asset.askingPrice}
                      </span>
                    </div>
                    <div className="border-x border-slate-200/60 px-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                        ARR Revenue
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {asset.revenue}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                        EBITDA
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {asset.ebitda.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Key Features & Credentials
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.highlights.split(" | ").slice(0, 3).map((h, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-100/90 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Teaser Description Snippet */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {asset.teaser}
                  </p>
                </CardContent>

                {/* Card Footer Action */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    {asset.inquiryCount} active inquiries
                  </span>
                  <Button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setInquirySuccess(false);
                    }}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    View Details & Contact
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Asset Details & Inquiry Modal */}
      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <DialogContent className="max-w-2xl bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          {selectedAsset && (
            <div className="space-y-6">
              <DialogHeader className="space-y-2 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                      {selectedAsset.codeName}
                    </span>
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                      {selectedAsset.sector}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                    {selectedAsset.status}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedAsset.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Seller: {selectedAsset.seller?.company || "Verified Seller"}</span>
                  <span>•</span>
                  <span>Jurisdiction: {selectedAsset.geography}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Asking Valuation</span>
                  <span className="text-lg font-bold text-blue-600">{selectedAsset.askingPrice}</span>
                </div>
                <div className="border-x border-slate-200 px-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Annual Revenue (ARR)</span>
                  <span className="text-sm font-bold text-slate-900">{selectedAsset.revenue}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block">EBITDA & Margin</span>
                  <span className="text-sm font-bold text-slate-700">{selectedAsset.ebitda}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Investment Teaser</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-200/60">
                  {selectedAsset.teaser}
                </p>

                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pt-2">Key Highlights & Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedAsset.highlights.split(" | ").map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded-md border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Submit NDA & Inquiry Request
                </h4>

                {inquirySuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-emerald-900">Inquiry & NDA Request Submitted!</p>
                    <p className="text-[11px] text-emerald-700">
                      The seller ({selectedAsset.seller?.company}) has been notified. You can track this request in your Investment Interests.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <textarea
                      rows={3}
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      placeholder={`Introduce ${currentUser?.company || "your fund"} and state your investment thesis or timeline...`}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedAsset(null)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmittingInquiry}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmittingInquiry ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Submit Inquiry
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
