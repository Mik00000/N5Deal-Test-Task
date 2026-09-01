"use client";

import React, { useState } from "react";
import { useRole, Role } from "@/context/RoleContext";
import RoleSwitcher from "@/components/navigation/RoleSwitcher";
import { Bell, Layers } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const NAV_TABS_BY_ROLE: Record<Role, { id: string; label: string }[]> = {
  BUYER: [
    { id: "overview", label: "Overview" },
    { id: "marketplace", label: "Marketplace" },
    { id: "interests", label: "Investment Interests" },
    { id: "saved", label: "Saved Assets" },
  ],
  SELLER: [
    { id: "overview", label: "Overview" },
    { id: "mandates", label: "Active Mandates" },
    { id: "investors", label: "Investor Pool" },
    { id: "analytics", label: "Analytics" },
  ],
  PLATFORM_MANAGER: [
    { id: "overview", label: "Overview" },
    { id: "users", label: "User Management" },
    { id: "asset-review", label: "Asset Review" },
    { id: "audit", label: "System Audit" },
  ],
};

export default function TopNavigation({ activeTab, onTabChange }: TopNavigationProps) {
  const { role, currentUser } = useRole();
  const tabs = NAV_TABS_BY_ROLE[role];
  const [internalTab, setInternalTab] = useState(tabs[0].id);

  const currentTab = activeTab || internalTab;

  const handleTabClick = (tabId: string) => {
    setInternalTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 h-16 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Left: Logo */}
      <div
        onClick={() => handleTabClick(tabs[0].id)}
        className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-all"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
            N5Deal
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none mt-1">
            Fintech M&A
          </span>
        </div>
      </div>

      {/* Center: Dynamic Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                isActive
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Controls (Role Switcher, Notifications, User Profile) */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Dropdown */}
        <RoleSwitcher />

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 transition-all shadow-xs cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200/80 mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-slate-100/70 transition-all cursor-pointer">
          <Avatar className="w-8 h-8 rounded-full border border-blue-200 bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">
              {getInitials(currentUser?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-slate-900">
              {currentUser?.name || "User"}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              {currentUser?.company || role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
