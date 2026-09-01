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

  // Modal States
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSubmittingAsset, setIsSubmittingAsset] = useState(false);

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
        const data: Asset[] = await res.json();
        setMandates(data);
      }
    } catch (err) {
      console.error("Failed to fetch seller mandates:", err);
    } finally {
      setIsLoadingMandates(false);
    }
  };

  // Load buyers from database
  const fetchBuyers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        const buyerUsers = data.filter((u: any) => u.role === "BUYER");
        setBuyers(buyerUsers);
      }
    } catch (err) {
      console.error("Failed to fetch buyers:", err);
    }
  };

  useEffect(() => {
    fetchMandates();
    fetchBuyers();
  }, []);

  // Calculate Metrics
  const totalValuationNum = mandates.reduce((sum, m) => sum + (m.askingPriceNum || 0), 0);
  const formattedTotalValuation =
    totalValuationNum >= 1000000
      ? `€${(totalValuationNum / 1000000).toFixed(1)}M`
      : `€${totalValuationNum.toLocaleString()}`;

  const totalInquiries = mandates.reduce((sum, m) => sum + (m.inquiryCount || 0), 0);

  // Publish New Asset Handler
  const handlePublishAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newAssetTitle) return;

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
          teaser: newAssetTeaser || `${newAssetTitle} - Verified Fintech Mandate.`,
          highlights: newAssetHighlights,
          sellerId: currentUser.id,
        }),
      });

      if (res.ok) {
        setIsPublishModalOpen(false);
        // Reset form
        setNewAssetTitle("");
        setNewAssetTeaser("");
        fetchMandates();
      }
    } catch (err) {
      console.error("Failed to publish new asset:", err);
    } finally {
      setIsSubmittingAsset(false);
    }
  };

  // Delete Asset Handler
  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Are you sure you want to archive/delete this active mandate?")) return;
    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMandates();
      }
    } catch (err) {
      console.error("Failed to delete asset:", err);
    }
  };

  // Send Memo Submit Handler
  const handleSendMemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemoSentSuccess(true);
    setTimeout(() => {
      setSelectedBuyer(null);
      setMemoSentSuccess(false);
      setMemoNote("");
    }, 1500);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header with Title & Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Store className="w-6 h-6 text-emerald-600" />
            Seller Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage listed M&A mandates, review inquiries, and connect with verified buyers.
          </p>
        </div>
        <Button
          onClick={() => setIsPublishModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Publish New Asset
        </Button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Asset Valuation
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formattedTotalValuation}</div>
            <p className="text-xs font-medium text-emerald-600 mt-1.5">
              Across {mandates.length} listed mandates
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Qualified Inquiries
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalInquiries}</div>
            <p className="text-xs font-medium text-emerald-600 mt-1.5">+14 this month</p>
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
            <div className="text-2xl font-bold text-slate-900">74%</div>
            <p className="text-xs font-medium text-slate-500 mt-1.5">Based on engagement score</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Avg. Time to Close
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">38 Days</div>
            <p className="text-xs font-medium text-emerald-600 mt-1.5">Industry avg: 52 days</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Active Mandates Table (Plain Text Inquiries Count ONLY per CONTEXT.md) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Mandates</h2>
            <p className="text-xs text-slate-500">Your listed assets and current buyer engagement</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 text-slate-600">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </Button>
          </div>
        </div>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Asset ID</th>
                  <th className="px-5 py-3.5">Asset Name</th>
                  <th className="px-5 py-3.5">Asking Valuation</th>
                  <th className="px-5 py-3.5">Inquiries</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Last Updated</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {isLoadingMandates ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading active mandates...
                    </td>
                  </tr>
                ) : mandates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                      No active mandates found. Click &apos;+ Publish New Asset&apos; to create one.
                    </td>
                  </tr>
                ) : (
                  mandates.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Asset ID */}
                      <td className="px-5 py-4 font-mono font-semibold">
                        <span className="bg-slate-100 border border-slate-200/80 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {m.codeName}
                        </span>
                      </td>

                      {/* Asset Name */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">{m.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{m.sector} • {m.geography}</div>
                      </td>

                      {/* Valuation */}
                      <td className="px-5 py-4 font-bold text-blue-600">{m.askingPrice}</td>

                      {/* Inquiries (STRICT CONTEXT.md RULE: Plain text numbers ONLY e.g. "14", "7", "21") */}
                      <td className="px-5 py-4 font-semibold text-slate-900 text-sm">
                        {m.inquiryCount}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            m.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : m.status === "UNDER_LOI"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {m.status === "ACTIVE" ? "Live" : m.status === "UNDER_LOI" ? "Under LOI" : "Draft"}
                        </Badge>
                      </td>

                      {/* Last Updated */}
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(m.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions Menu */}
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-500 transition-colors shadow-xs cursor-pointer">
                            <MoreHorizontal className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36 p-1 bg-white border border-slate-200 shadow-md rounded-xl z-50">
                            <DropdownMenuItem
                              onClick={() => handleDeleteAsset(m.id)}
                              className="text-xs text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2 p-2 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Archive Asset
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
      </div>

      {/* 3. Investor Pool Section (Browse Buyers) */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Investor Pool</h2>
          <p className="text-xs text-slate-500">Verified buyers matched to your Fintech asset portfolio</p>
        </div>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Investor Entity</th>
                  <th className="px-5 py-3.5">Focus Areas</th>
                  <th className="px-5 py-3.5">Budget Range</th>
                  <th className="px-5 py-3.5">Stage</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {buyers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                      No active buyers in pool.
                    </td>
                  </tr>
                ) : (
                  buyers.map((buyer, idx) => {
                    const focusAreas =
                      idx === 0
                        ? ["Payments", "WealthTech"]
                        : idx === 1
                        ? ["Banking Infrastructure", "PayTech"]
                        : ["InsurTech", "RegTech"];
                    const budget = idx === 0 ? "€5M – €25M" : idx === 1 ? "€10M – €50M" : "€2M – €15M";
                    const stage = idx === 0 || idx === 1 ? "Qualified" : "Prospecting";

                    return (
                      <tr key={buyer.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Investor */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">
                                {getInitials(buyer.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-slate-900">{buyer.name}</div>
                              <div className="text-[11px] text-slate-400">{buyer.company}</div>
                            </div>
                          </div>
                        </td>

                        {/* Focus Areas */}
                        <td className="px-5 py-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {focusAreas.map((f, i) => (
                              <span
                                key={i}
                                className="text-[11px] bg-slate-100 border border-slate-200/80 text-slate-600 px-2 py-0.5 rounded font-medium"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Budget Range */}
                        <td className="px-5 py-4 font-semibold text-slate-900">{budget}</td>

                        {/* Stage */}
                        <td className="px-5 py-4">
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                              stage === "Qualified"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {stage}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          <Button
                            onClick={() => {
                              setSelectedBuyer(buyer);
                              setMemoSentSuccess(false);
                              if (mandates.length > 0) {
                                setSelectedMandateForMemo(mandates[0].id);
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold gap-1.5 rounded-lg cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
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
      </div>

      {/* 4. Publish New Asset Modal */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="max-w-xl bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <DialogHeader className="space-y-1 pb-3 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Publish New M&A Asset Mandate
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Fill out asset specifics to list your entity on the N5Deal marketplace.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePublishAsset} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Asset Title *
              </label>
              <Input
                required
                placeholder="e.g. European PayTech Provider & FX Clearing API"
                value={newAssetTitle}
                onChange={(e) => setNewAssetTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Sector *
                </label>
                <select
                  value={newAssetSector}
                  onChange={(e) => setNewAssetSector(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Payments">Payments</option>
                  <option value="WealthTech">WealthTech</option>
                  <option value="RegTech">RegTech</option>
                  <option value="InsurTech">InsurTech</option>
                  <option value="Crypto & Digital Assets">Crypto & Digital Assets</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Jurisdiction *
                </label>
                <select
                  value={newAssetGeo}
                  onChange={(e) => setNewAssetGeo(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="UK & Nordics">UK & Nordics</option>
                  <option value="DACH Region & Switzerland">DACH & Switzerland</option>
                  <option value="Pan-European">Pan-European</option>
                  <option value="Western Europe">Western Europe</option>
                  <option value="North America & UK">North America & UK</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Asking Price *
                </label>
                <Input
                  required
                  placeholder="e.g. €25M"
                  value={newAssetValuation}
                  onChange={(e) => setNewAssetValuation(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Annual Revenue
                </label>
                <Input
                  placeholder="e.g. €6.5M ARR"
                  value={newAssetRevenue}
                  onChange={(e) => setNewAssetRevenue(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  EBITDA
                </label>
                <Input
                  placeholder="e.g. €1.8M (27%)"
                  value={newAssetEbitda}
                  onChange={(e) => setNewAssetEbitda(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Teaser Overview
              </label>
              <textarea
                rows={3}
                placeholder="High-level description of business model, client base, and license status..."
                value={newAssetTeaser}
                onChange={(e) => setNewAssetTeaser(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Feature Highlights (pipe-separated |)
              </label>
              <Input
                placeholder="FCA EMI License | SEPA Instant | 200+ Enterprise Clients"
                value={newAssetHighlights}
                onChange={(e) => setNewAssetHighlights(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
                  "Publish Mandate"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. Send Memo Outreach Modal */}
      <Dialog open={!!selectedBuyer} onOpenChange={(open) => !open && setSelectedBuyer(null)}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          {selectedBuyer && (
            <div className="space-y-4">
              <DialogHeader className="space-y-1 pb-2 border-b border-slate-100">
                <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  Send Teaser Memo to {selectedBuyer.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Target Entity: {selectedBuyer.company}
                </DialogDescription>
              </DialogHeader>

              {memoSentSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">Teaser Memo Sent Successfully!</p>
                  <p className="text-[11px] text-emerald-700">
                    {selectedBuyer.name} at {selectedBuyer.company} has received your outreach.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMemoSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Select Mandate Teaser
                    </label>
                    <select
                      value={selectedMandateForMemo}
                      onChange={(e) => setSelectedMandateForMemo(e.target.value)}
                      className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {mandates.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.codeName} — {m.title} ({m.askingPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Personalized Message Note
                    </label>
                    <textarea
                      rows={3}
                      value={memoNote}
                      onChange={(e) => setMemoNote(e.target.value)}
                      placeholder="Highlight key acquisition fit for their investment focus..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Outreach Memo
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
