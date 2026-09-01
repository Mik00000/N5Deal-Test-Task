/**
 * Unit Test Suite for N5Deal M&A Platform Core Logic
 */
import { describe, it, expect } from "vitest";

// AI Match Heuristic Helper Functions
function isAiMatched(sector: string): boolean {
  return ["Payments", "WealthTech", "RegTech"].includes(sector);
}

function calculateAiMatchScore(sector: string): number {
  if (sector === "Payments") return 98;
  if (sector === "WealthTech") return 94;
  if (sector === "RegTech") return 91;
  return 82;
}

// User Status Toggle Helper
function toggleUserStatus(currentStatus: "ACTIVE" | "INACTIVE" | "PENDING"): "ACTIVE" | "INACTIVE" {
  return currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
}

// Currency / Volume Formatting Helper
function formatVolume(amount: number): string {
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`;
  }
  return `€${amount.toLocaleString("en-US")}`;
}

describe("N5Deal Platform Core Logic Unit Tests", () => {
  describe("AI Mandate Matcher", () => {
    it("should match target sectors Payments, WealthTech, and RegTech", () => {
      expect(isAiMatched("Payments")).toBe(true);
      expect(isAiMatched("WealthTech")).toBe(true);
      expect(isAiMatched("RegTech")).toBe(true);
      expect(isAiMatched("Crypto & Digital Assets")).toBe(false);
      expect(isAiMatched("Real Estate")).toBe(false);
    });

    it("should return high match confidence scores for target sectors", () => {
      expect(calculateAiMatchScore("Payments")).toBe(98);
      expect(calculateAiMatchScore("WealthTech")).toBe(94);
      expect(calculateAiMatchScore("RegTech")).toBe(91);
      expect(calculateAiMatchScore("InsurTech")).toBe(82);
    });
  });

  describe("Server Action & User Status Logic", () => {
    it("should correctly toggle status from ACTIVE to INACTIVE and back", () => {
      expect(toggleUserStatus("ACTIVE")).toBe("INACTIVE");
      expect(toggleUserStatus("INACTIVE")).toBe("ACTIVE");
      expect(toggleUserStatus("PENDING")).toBe("ACTIVE");
    });
  });

  describe("Volume & Valuation Formatter", () => {
    it("should format millions and thousands correctly", () => {
      expect(formatVolume(194500000)).toBe("€194.5M");
      expect(formatVolume(15000000)).toBe("€15.0M");
      expect(formatVolume(500000)).toBe("€500,000");
    });
  });
});
