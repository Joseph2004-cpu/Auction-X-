# AuctionX — Secure Real-Time Online Auction Platform

[![Production Security](https://img.shields.io/badge/Security-OWASP--Compliant-emerald.svg)](./SECURITY.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Express-4.19-green.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)

**AuctionX** is a full-stack, real-time online auction marketplace built to production security, concurrency, and architecture standards based on the 100 Master Software Development Prompt specifications.

---

## 🌟 Key Features

- **Bank-Grade Concurrency-Safe Bidding Engine**: Server-side bid execution protected against race conditions using PostgreSQL row-level locks (`SELECT ... FOR UPDATE`).
- **Real-Time WebSocket Sync**: Instant bid broadcasts, live countdown timer synchronization, and anti-sniping extension alerts powered by Socket.IO.
- **Anti-Sniping Engine**: Automatically extends auction closing time by 2 minutes if a bid is placed within the final 30 seconds.
- **Automatic Proxy Bidding**: Computes minimum incremental bids on behalf of proxy bidders without exposing max bids.
- **Strict Role-Based Access Control (RBAC)**: Granular permissions for Guests, Buyers, Sellers, Moderators, and Administrators.
- **Immutable Audit Logging & Security Event Scoring**: Tracks all sensitive system operations (`BID_ACCEPTED`, `USER_SUSPENDED`, `LISTING_APPROVED`) with IP risk scoring.
- **Pluggable Payment Abstraction Layer**: Supports server-to-server webhook confirmation and idempotent payment state transitions.
- **2FA Multi-Factor Authentication**: Supports TOTP authenticator applications (Google Authenticator, Authy) and backup recovery codes.

---

## 🏗 System Architecture

```
                                  +-----------------------+
                                  |   Next.js Frontend    |
                                  |  (React/Tailwind/TS)  |
                                  +-----------+-----------+
                                              |
                                    HTTP REST / WebSockets
                                              |
                                  +-----------v-----------+
                                  |  Express API Server   |
                                  |   & Socket.IO Node    |
                                  +-----+-----------+-----+
                                        |           |
               +------------------------+           +------------------------+
               |                                                             |
     +---------v----------+                                        +---------v----------+
     | PostgreSQL (Primary)|                                        |    Redis Store     |
     |   - Bids           |                                        |  - Rate Limits     |
     |   - Auctions       |                                        |  - WS Pub/Sub      |
     |   - Users & RBAC   |                                        |  - BullMQ Queues   |
     |   - Audit & Security|                                        +---------+----------+
     +--------------------+                                                  |
                                                                   +---------v----------+
                                                                   |  Background Worker |
                                                                   |  - Expiry Engine   |
                                                                   |  - Anti-Sniping    |
                                                                   |  - Email/Notifs    |
                                                                   +--------------------+
```

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, TypeScript, Socket.IO, PostgreSQL (Prisma ORM), Redis, Argon2id, Zod, Winston.
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Socket.io-client, Zustand.
- **DevOps**: Docker, Docker Compose.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ & npm
- PostgreSQL 15+
- Redis 7+

### Environment Setup

1. Copy `.env.example` to `backend/.env`:
   ```bash
   cp .env.example backend/.env
   ```

2. Install backend & frontend dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Initialize Database & Seed Demo Data:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```

4. Run Local Development Servers:
   - Backend API: `npm run dev` (Runs on http://localhost:4000)
   - Frontend Web: `cd ../frontend && npm run dev` (Runs on http://localhost:3000)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@auctionx.com` | `Password123!` |
| **Seller** | `seller@auctionx.com` | `Password123!` |
| **Buyer** | `buyer@auctionx.com` | `Password123!` |

---

## 🧪 Testing & Verification

Run automated Jest unit tests:
```bash
cd backend
npm test
```
