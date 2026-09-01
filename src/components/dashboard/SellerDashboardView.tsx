"use client";

import React from "react";
import { useRole } from "@/context/RoleContext";
import { Store, DollarSign, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SellerDashboardView() {
  const { currentUser } = useRole();

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Store className="w-6 h-6 text-emerald-600" />
            Seller Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">{currentUser?.name}</span> ({currentUser?.company}). Track listed mandates and buyer inquiry pipelines.
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-xs font-semibold">
          Active Seller Persona
        </Badge>
      </div>

      {/* KPI Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Portfolio Valuation
            </CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">€104.0M</div>
            <p className="text-xs font-medium text-emerald-600 mt-1">Across 3 active mandates</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Qualified Inquiries
            </CardTitle>
            <Users className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">42 Inquiries</div>
            <p className="text-xs font-medium text-emerald-600 mt-1">Plain text numbers (14, 7, 21)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Success Rate
            </CardTitle>
            <span className="text-xs font-bold text-emerald-600">%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">74%</div>
            <p className="text-xs font-medium text-slate-500 mt-1">Engagement confidence score</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Avg Time to Close
            </CardTitle>
            <Clock className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">38 Days</div>
            <p className="text-xs font-medium text-slate-500 mt-1">14 days faster than benchmark</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Container Placeholder */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Seller Dashboard View Container</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            This container will display the Active Mandates table (with plain text inquiry numbers, e.g., "14", "7", "21") and the Investor Pool directory.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
