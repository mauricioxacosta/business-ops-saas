# Flame Fusion — Business Operations Platform

A full-stack digital ordering and operations platform for small restaurants, built as a real, deployed extension of my final-year university project (a digital-transformation consultancy engagement for a real Valencia restaurant).

**Live demo:** https://business-ops-saas.onrender.com

## What it does

**Customer-facing**
- QR-code menu ordering, no login required
- Real-time stock decrement on order

**Owner-facing** (password-protected)
- Live order management
- Dashboard with revenue, order count, and top-selling items
- Menu management (add, edit, delete items)
- Inventory Intelligence: ABC analysis and Economic Order Quantity (EOQ) recommendations
- Reports with custom date-range filtering
- Fully responsive, mobile-first admin panel

## Stack

- **Frontend/Backend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Database:** PostgreSQL via Prisma ORM
- **Charts:** Recharts
- **Auth:** Cookie-based session authentication with route middleware
- **Deployment:** Render (app hosting) + Neon (serverless Postgres)

## Running locally

```bash
npm install
docker compose up -d       # starts a local Postgres instance
npx prisma migrate dev     # applies the schema
npm run dev
```

You'll need a `.env` file with `DATABASE_URL`, `OWNER_PASSWORD`, and `NEXT_PUBLIC_SITE_URL` set — see `.env.example` if present, or `prisma/schema.prisma` for the expected `DATABASE_URL` format.

## Background

This project builds on my FYP (COC253): a real consultancy engagement diagnosing operational pain points for a Valencia restaurant — manual ordering, no inventory tracking, no digital presence — and designing (but not implementing) a digital solution. This repository is that unimplemented solution, built for real.