"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type Role = "BUYER" | "SELLER" | "PLATFORM_MANAGER";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  company: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleContextType {
  role: Role;
  setRole: (newRole: Role) => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
  isLoadingUsers: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Fallback initial profiles in case API is loading or offline
const FALLBACK_USERS: Record<Role, UserProfile> = {
  BUYER: {
    id: "buyer-fallback-1",
    name: "Victoria Chen",
    email: "vchen@apexventures.com",
    role: "BUYER",
    company: "Apex Growth Ventures",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  SELLER: {
    id: "seller-fallback-1",
    name: "Marcus Sterling",
    email: "marcus@fintechholdings.eu",
    role: "SELLER",
    company: "Nordic PayTech Group",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  PLATFORM_MANAGER: {
    id: "pm-fallback-1",
    name: "Alexander Vance",
    email: "alexander.vance@n5deal.com",
    role: "PLATFORM_MANAGER",
    company: "N5Deal Capital",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [role, setRoleState] = useState<Role>("BUYER");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 1. Fetch users from API
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data: UserProfile[] = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to load users in RoleProvider:", err);
      } finally {
        setIsLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  // 2. Initialize role from URL query param or localStorage
  useEffect(() => {
    const urlRole = searchParams?.get("role")?.toUpperCase() as Role | null;
    const validRoles: Role[] = ["BUYER", "SELLER", "PLATFORM_MANAGER"];

    if (urlRole && validRoles.includes(urlRole)) {
      setRoleState(urlRole);
      localStorage.setItem("n5deal_active_role", urlRole);
    } else {
      const savedRole = localStorage.getItem("n5deal_active_role") as Role | null;
      if (savedRole && validRoles.includes(savedRole)) {
        setRoleState(savedRole);
      }
    }
    setIsInitialized(true);
  }, [searchParams]);

  // 3. Handle role switching
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("n5deal_active_role", newRole);

    // Sync to URL search parameters
    const params = new URLSearchParams(window.location.search);
    params.set("role", newRole);
    const newRelativePathQuery = `${window.location.pathname}?${params.toString()}`;
    
    startTransition(() => {
      router.replace(newRelativePathQuery, { scroll: false });
    });
  };

  // 4. Find active profile from fetched database users or fallback
  const currentUser =
    users.find((u) => u.role === role) || FALLBACK_USERS[role] || null;

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        users,
        isLoadingUsers,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
