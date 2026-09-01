"use client";

import React, { useState } from "react";
import { useRole } from "@/context/RoleContext";
import TopNavigation from "@/components/navigation/TopNavigation";
import BuyerDashboardView from "@/components/dashboard/BuyerDashboardView";
import SellerDashboardView from "@/components/dashboard/SellerDashboardView";
import ManagerDashboardView from "@/components/dashboard/ManagerDashboardView";

export default function HomePage() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Header Navigation */}
      <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {role === "BUYER" && <BuyerDashboardView />}
        {role === "SELLER" && <SellerDashboardView />}
        {role === "PLATFORM_MANAGER" && <ManagerDashboardView />}
      </main>
    </div>
  );
}
