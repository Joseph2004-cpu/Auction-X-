# AuctionX Platform — Railway & Vercel Deployment Guide

This guide details step-by-step instructions for deploying the **AuctionX Platform** with the **Backend API, PostgreSQL Database & Redis on Railway** and the **Next.js Frontend on Vercel**.

For the classroom presentation, use the local setup first. The project is nested under `AUCTION-PLATFORM-main/AUCTION-PLATFORM-main`.

## Local classroom setup

From the nested project directory:

```powershell
docker compose up -d postgres redis
Copy-Item backend/.env.example backend/.env
Set-Location backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

In another terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

Open `http://localhost:3000` and use the demo credentials in the README. Payment uses the simulated provider and must not be used for real transactions.

---

## Architecture Overview

| Component | Platform | Primary URL / Endpoint | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Backend API** | **Railway** (Node.js Service) | `https://auction-platform-backend.up.railway.app` | Express REST API, Socket.IO WebSockets, Auth, Bidding Engine |
| **Database** | **Railway PostgreSQL** Plugin | `${{Postgres.DATABASE_URL}}` | User accounts, Auctions, Bids, Orders, Audit Logs |
| **Cache & Real-time** | **Railway Redis** Plugin | `${{Redis.REDIS_HOST}}` | Session store, Socket.IO Adapter, Rate Limiting |
| **Frontend Application** | **Vercel** | `https://auction-platform.vercel.app` | Next.js 14 App Router, Client UI, Real-time Bid Console |

---

## Part 1: Backend + PostgreSQL + Redis Deployment on Railway

### Step 1: Create a Railway Project
1. Log in to [Railway Dashboard](https://railway.app/).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select your repository (`AUCTION PLATFORM`).

### Step 2: Add PostgreSQL & Redis Plugins on Railway
1. Inside your Railway Project canvas, click **+ New** > **Database** > **Add PostgreSQL**.
2. Click **+ New** > **Database** > **Add Redis**.
3. In your Backend Service settings, set **Root Directory** to `backend`.

### Step 3: Configure Railway Environment Variables
In your Backend service **Variables** tab, add / link:

| Variable | Railway Reference / Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `4000` | (Railway manages port automatically) |
| `APP_URL` | `https://auction-platform.vercel.app` | Vercel frontend URL for CORS validation |
| `API_URL` | `${{RAILWAY_PUBLIC_DOMAIN}}` | Public backend URL |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Connects directly to Railway PostgreSQL plugin |
| `REDIS_HOST` | `${{Redis.REDIS_HOST}}` | Connects directly to Railway Redis plugin |
| `REDIS_PORT` | `${{Redis.REDIS_PORT}}` | Railway Redis port |
| `REDIS_PASSWORD` | `${{Redis.REDIS_PASSWORD}}` | Railway Redis password |
| `JWT_SECRET` | *(Random 32+ char key)* | Access Token signing key |
| `REFRESH_TOKEN_SECRET` | *(Random 32+ char key)* | Refresh Token signing key |
| `COOKIE_SECRET` | *(Random 32+ char key)* | Cookie signing key |
| `PAYMENT_PROVIDER` | `MOCK` or `PAYSTACK` / `STRIPE` | Payment provider selection |
| `PAYMENT_SECRET_KEY` | `sk_live_...` | Payment API Secret Key |
| `SMTP_HOST` | `smtp.mailtrap.io` or `smtp.sendgrid.net` | Email service host |
| `SMTP_PORT` | `587` | Email service port |
| `SMTP_USER` | `your_smtp_user` | Email service user |
| `SMTP_PASS` | `your_smtp_pass` | Email service password |
| `EMAIL_FROM` | `"AuctionX Platform" <noreply@yourdomain.com>` | Sender address |

*Note: Railway automatically runs `npx prisma migrate deploy && node dist/index.js` as defined in [`backend/railway.json`](file:///c:/Users/DELL/Desktop/AUCTION%20PLATFORM/backend/railway.json).*

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Import Project to Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository (`AUCTION PLATFORM`).

### Step 2: Configure Vercel Project Settings
1. **Framework Preset**: Next.js (automatically detected).
2. **Root Directory**: Click Edit and select `frontend`.
3. **Environment Variables**: Expand Environment Variables and add:
   ```env
   NEXT_PUBLIC_API_URL=https://<your-railway-backend-domain>.up.railway.app
   NEXT_PUBLIC_WS_URL=https://<your-railway-backend-domain>.up.railway.app
   ```
4. Click **Deploy**.

---

## Part 3: Post-Deployment Verification

1. **Backend Health Verification**:
   Open `https://<your-railway-backend-domain>.up.railway.app/health` in your browser.
   Response: `{"status":"UP","service":"AuctionX Platform API",...}`.

2. **Run Initial Database Seed**:
   Open Railway CLI or Backend Service Terminal and run:
   ```bash
   npx prisma db seed
   ```

3. **Frontend Application**:
   Open your Vercel deployment URL (`https://<your-project>.vercel.app`).
   - Register a **Bidder** or **Seller** account.
   - Verify real-time bidding, Socket.IO WebSocket connectivity, and marketplace listings!
