"use client";

import React from "react";
import { useRole } from "@/context/RoleContext";
import { Shield, Users, Database, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ManagerDashboardView() {
  const { currentUser } = useRole();

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-purple-600" />
            Platform Manager Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">{currentUser?.name}</span> ({currentUser?.company}). Platform oversight, user approval, and governance.
          </p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1 text-xs font-semibold">
          Platform Admin
        </Badge>
      </div>

      {/* KPI Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Platform Users
            </CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">10 Accounts</div>
            <p className="text-xs font-medium text-purple-600 mt-1">8 Active | 1 Pending | 1 Inactive</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active Mandates
            </CardTitle>
            <Database className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">5 Assets</div>
            <p className="text-xs font-medium text-slate-500 mt-1">€194.5M total volume</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              System Health
            </CardTitle>
            <Activity className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100% Operational</div>
            <p className="text-xs font-medium text-slate-500 mt-1">SQLite DB Synced</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Layout Rule
            </CardTitle>
            <Shield className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">100% Full Width</div>
            <p className="text-xs font-medium text-purple-600 mt-1">Right sidebar excluded per spec</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Container Placeholder (Full 100% width per CONTEXT.md) */}
      <Card className="border-slate-200 shadow-xs bg-white w-full">
        <CardContent className="p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Platform Manager Dashboard Container (100% Width)</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            This container will display the full-width User Management data table. (Right-hand Recent Activity & Platform Health columns are excluded per CONTEXT.md rules).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
