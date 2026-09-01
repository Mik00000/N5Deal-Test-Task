# N5Deal — B2B Fintech M&A Marketplace Prototype

A production-grade **B2B Fintech M&A Dashboard MVP Prototype** supporting three key market roles: **Buyer**, **Seller**, and **Platform Manager**.

Built in accordance with the `Technical Assignment — N5Deal Marketplace Prototype` rules with strict Light Mode corporate styling, data-driven typography, persistent SQLite storage, Server Actions, and integrated AI features.

---

## 🚀 Quick Start / Launch Instructions

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Mik00000/N5Deal-Test-Task.git
cd N5Deal-Test-Task
npm install
```

### 2. Database Migration & Seeding
Initialize the local SQLite database (`dev.db`) and seed it with mock buyers, sellers, platform managers, active mandates, and inquiries:
```bash
npx prisma db push
npx prisma db seed
```

### 3. Run Automated Tests
Execute the unit test suite covering AI match heuristics, status toggling, and currency formatting:
```bash
npm test
```

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛️ Product User Flow & Features Overview

### 1. Seller Role (`?role=SELLER`)
- **Asset Publishing**: Publish new M&A mandates with valuation, revenue, EBITDA, and regulatory highlights.
- **✨ AI Teaser Generator**: Auto-generates professional M&A teaser summaries and key highlights at the click of a button (`✨ Auto-Generate AI Teaser`).
- **Browse & Filter Buyers**: Full-width **Investor Pool** showing verified buyers, budget ranges, and focus areas, with dedicated search and sector filtering.
- **Outreach Teaser Memos**: Direct "Send Memo" modal to dispatch confidential teasers to specific institutional buyers.
- **Active Mandates Management**: Table displaying live assets with plain text inquiry counts, status pills, and deletion capability.

### 2. Buyer Role (`?role=BUYER`)
- **Marketplace Browsing**: 3-column data-heavy cards displaying asking valuations, ARR revenue, EBITDA, and regulatory credentials.
- **Multi-Parametric Search & Filtering**: Real-time keyword search, sector filter, jurisdiction filter, and valuation/revenue sorting.
- **✨ AI Mandate Match**: Intelligent heuristic engine filtering assets matching buyer criteria (PayTech, WealthTech, RegTech) with dynamic match percentage scores (`✨ 98% Match`).
- **Inquiry & NDA Submission**: Interactive modal for submitting interest and NDA requests directly to sellers.

### 3. Platform Manager Role (`?role=PLATFORM_MANAGER`)
- **100% Full-Width Governance Table**: Expanded user management table taking 100% layout width per spec.
- **Participant Administration**: Comprehensive view of all Buyers, Sellers, and Managers across the platform.
- **Server Action Status Management**: Single-click "Suspend User" / "Activate User" buttons executing Next.js Server Actions (`toggleUserStatusAction`) to mutate user account status in SQLite and revalidate UI state instantly.

---

## 🛠️ Key Technical Architecture Decisions

1. **Framework**: **Next.js 16 (App Router)** with **TypeScript** for full type-safety across server & client boundaries.
2. **Database & Persistence**: **Prisma ORM** with **SQLite** (`dev.db`). Provides real relational integrity for `User`, `Asset`, and `Inquiry` models while maintaining zero-config portability.
3. **State Management**: Custom `RoleContext` persisting active roles to `localStorage` (`n5deal_active_role`) and URL search params (`?role=...`), allowing seamless role switching.
4. **Server Actions & API Routes**: Next.js Server Actions for secure database mutations alongside REST API endpoints (`/api/assets`, `/api/users`, `/api/inquiries`).
5. **Styling & UI**: Tailwind CSS v4 with shadcn/ui primitives and Google Inter typography.
6. **Automated Testing**: Built with **Vitest** for fast unit testing of core business logic.

---

## 🤖 AI Tools Used

- **Antigravity AI Agent**: Paired for full-stack scaffolding, Prisma schema modeling, seed data creation, component styling, and automated subagent browser testing.

---

## 🔮 Future Improvements (With More Time)

1. **Production Authentication**: Replace role context switcher with session-based NextAuth.js / Auth.js (OAuth + Magic Links).
2. **True LLM API Integration**: Connect OpenAI/Anthropic API for real-time dynamic teaser generation and AI document Q&A.
3. **Virtual Data Room (VDR)**: Add S3/Cloudflare R2 document storage with encrypted NDA authorization.
4. **Multi-language Support (i18n)**: Add EN/UA language toggle across marketplace screens.

---

## 📄 License

MIT
