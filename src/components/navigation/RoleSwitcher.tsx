"use client";

import React from "react";
import { useRole, Role } from "@/context/RoleContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, ShoppingBag, Store, ChevronDown, Check } from "lucide-react";

const ROLE_CONFIG: Record<
  Role,
  { label: string; description: string; icon: React.ElementType; badgeClass: string }
> = {
  BUYER: {
    label: "Buyer Dashboard",
    description: "Search assets & track interests",
    icon: ShoppingBag,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  SELLER: {
    label: "Seller Dashboard",
    description: "Manage mandates & inquiries",
    icon: Store,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  PLATFORM_MANAGER: {
    label: "Platform Manager",
    description: "System admin & user management",
    icon: Shield,
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export default function RoleSwitcher() {
  const { role, setRole } = useRole();

  const activeConfig = ROLE_CONFIG[role];
  const ActiveIcon = activeConfig.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-colors shadow-xs outline-none focus:ring-2 focus:ring-blue-500/20">
        <div className="flex items-center gap-1.5">
          <ActiveIcon className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-900">{activeConfig.label}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-64 p-1.5 bg-white border border-slate-200 shadow-lg rounded-xl z-50">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium tracking-wider text-slate-400 uppercase">
            Switch Perspective
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 border-slate-100" />
          {(Object.keys(ROLE_CONFIG) as Role[]).map((r) => {
            const config = ROLE_CONFIG[r];
            const IconComp = config.icon;
            const isSelected = r === role;

            return (
              <DropdownMenuItem
                key={r}
                onClick={() => setRole(r)}
                className={`flex items-start justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "bg-slate-100/80 text-slate-900" : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-md border mt-0.5 ${config.badgeClass}`}>
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      {config.label}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                      {config.description}
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 mt-1" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
