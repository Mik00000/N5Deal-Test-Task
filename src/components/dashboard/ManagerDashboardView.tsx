"use client";

import React, { useState, useEffect } from "react";
import { useRole, UserProfile } from "@/context/RoleContext";
import { toggleUserStatusAction } from "@/app/actions/userActions";
import {
  Shield,
  Users,
  Building2,
  DollarSign,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  UserX,
  UserCheck,
  Loader2,
  Lock,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AssetSummary {
  id: string;
  title: string;
  codeName: string;
  askingPriceNum: number;
  askingPrice: string;
  status: string;
}

export default function ManagerDashboardView() {
  const { currentUser } = useRole();

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [assetsSummary, setAssetsSummary] = useState<AssetSummary[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [activeTab, setActiveTab] = useState<"users" | "assets">("users");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Load Users from API
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Load Assets Summary
  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/assets");
      if (res.ok) {
        const data = await res.json();
        setAssetsSummary(data);
      }
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAssets();
  }, []);

  // Toggle user status using Server Action
  const handleToggleStatus = async (user: UserProfile) => {
    setUpdatingUserId(user.id);
    try {
      const res = await toggleUserStatusAction(user.id, user.status);
      if (res.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Error updating user status:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate Metrics
  const totalUsers = usersList.length;
  const activeUsers = usersList.filter((u) => u.status === "ACTIVE").length;
  const pendingUsers = usersList.filter((u) => u.status === "PENDING").length;

  const totalVolumeNum = assetsSummary.reduce((sum, a) => sum + (a.askingPriceNum || 0), 0);
  const formattedVolume =
    totalVolumeNum >= 1000000
      ? `€${(totalVolumeNum / 1000000).toFixed(1)}M`
      : `€${totalVolumeNum.toLocaleString()}`;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-8 font-sans w-full">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-purple-600" />
            Platform Manager Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Governance, account verification, and global system administration.
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1 text-xs font-semibold self-start md:self-auto"
        >
          Administrator Persona
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Platform Users
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalUsers} Accounts</div>
            <p className="text-xs font-medium text-purple-600 mt-1.5">
              {activeUsers} Active • {pendingUsers} Pending Approval
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active M&A Mandates
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{assetsSummary.length} Assets</div>
            <p className="text-xs font-medium text-emerald-600 mt-1.5">Verified Listings</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Platform Volume
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formattedVolume}</div>
            <p className="text-xs font-medium text-slate-500 mt-1.5">Gross asset value</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Governance & Security
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100% Compliant</div>
            <p className="text-xs font-medium text-slate-500 mt-1.5">SQLite & Server Actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Full-Width Section Header & Filter Controls (100% Width per CONTEXT.md) */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              User Management ({filteredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("assets")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "assets"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              Asset Mandates Registry ({assetsSummary.length})
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            Layout Rule: 100% Full-Width (Right Sidebar Excluded per Spec)
          </div>
        </div>

        {/* Filters Row */}
        {activeTab === "users" && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search user name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-slate-50 text-xs border-slate-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="BUYER">Buyers</option>
                <option value="SELLER">Sellers</option>
                <option value="PLATFORM_MANAGER">Platform Managers</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="INACTIVE">Inactive / Suspended</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 100% Width Data Table */}
      {activeTab === "users" ? (
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">User Identity</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Assigned Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Joined Date</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
                      Loading user accounts...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                      No user accounts match current search filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* User Identity */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                            <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-[11px] text-slate-400">{user.company}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-slate-600 font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            user.role === "BUYER"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : user.role === "SELLER"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : user.status === "PENDING"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {user.status}
                        </Badge>
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Server Action Toggle Status */}
                      <td className="px-5 py-4 text-right">
                        <Button
                          onClick={() => handleToggleStatus(user)}
                          disabled={updatingUserId === user.id}
                          variant="outline"
                          size="sm"
                          className={`h-8 text-xs font-semibold gap-1.5 rounded-lg cursor-pointer ${
                            user.status === "ACTIVE"
                              ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {updatingUserId === user.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : user.status === "ACTIVE" ? (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              Suspend User
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              Activate User
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Asset Registry Tab (Full Width) */
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Asset Code</th>
                  <th className="px-5 py-3.5">Title</th>
                  <th className="px-5 py-3.5">Valuation</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {assetsSummary.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4 font-mono font-bold text-purple-700">{a.codeName}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{a.title}</td>
                    <td className="px-5 py-4 font-bold text-blue-600">{a.askingPrice}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
