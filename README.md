# N5Deal — B2B Fintech M&A Platform Prototype

A modern, high-performance **B2B Fintech M&A Dashboard MVP Prototype** supporting three key market perspectives: **Buyer**, **Seller**, and **Platform Manager**.

Built according to the exact specifications in `CONTEXT.md` with strict Light Mode corporate styling, data-driven typography, and zero heavy SVG data visualization dependencies.

---

## 🚀 Quick Start / Launch Instructions

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd N5Deal-Test-Task
npm install
```

### 2. Database Migration & Seeding
Set up the local SQLite database (`dev.db`) and seed it with mock buyers, sellers, platform managers, and active M&A mandates:
```bash
npx prisma db push
npx prisma db seed
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Key Technical Architecture & Decisions

1. **Framework & Language**: Next.js 16 (App Router) with TypeScript for end-to-end type safety.
2. **Database & ORM**: **Prisma ORM** with **SQLite** (`dev.db`). Lightweight, zero-config relational storage perfect for rapid prototyping and local testing.
3. **UI System & Typography**:
   - **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives).
   - **Google Inter Font**: Applied globally via `next/font/google` for a sleek corporate aesthetic.
4. **State Management & Persistence**:
   - Custom `RoleContext` managing switching between `BUYER`, `SELLER`, and `PLATFORM_MANAGER` roles.
   - Syncs active perspective to `localStorage` (`n5deal_active_role`) and URL search query parameters (`?role=...`).
5. **Server Actions & API Routes**:
   - `toggleUserStatusAction`: Next.js Server Action toggling user account status (`ACTIVE` <-> `INACTIVE`) in the SQLite database.
   - `/api/assets` & `/api/inquiries`: RESTful API routes handling asset filtering, new mandate publishing, and NDA/inquiry submission.
6. **Strict Scope-Reduction Compliance**:
   - **Platform Manager Dashboard**: 100% full-width layout (right-side Activity Log and Progress Bars removed per `CONTEXT.md`).
   - **Seller Dashboard**: Inquiries column displays **plain text numbers ONLY** (e.g. `14`, `7`, `21`) without sparklines.
   - **Buyer Dashboard**: Simple text-only KPI stat cards and data-heavy text Asset Cards (no stock photos or SVGs).

---

## 🤖 AI Tools Used

- **Antigravity AI Coding Assistant**: Used for pair-programming, scaffolding Next.js App Router structure, writing Prisma schema models, generating seed data, and validating browser interaction state via subagents.

---

## 🔮 Future Improvements (With More Time)

1. **Authentication & Access Control**: Integrate NextAuth.js / Auth.js with OAuth or magic links to replace the prototype role-switcher with real session-based security.
2. **True LLM Integration**: Connect OpenAI/Anthropic API for automated acquisition thesis matching, AI deal summary generation, and intelligent VDR document indexing.
3. **Robust Data Validation**: Implement Zod schemas on both client forms and server endpoints.
4. **Virtual Data Room (VDR)**: Add encrypted file uploading (S3/Cloudflare R2) with granular permissions for NDA signers.

---

## 📄 License

MIT
