# CivicConnect – Community Problem Reporting and Resolution Platform

[![PS-14 Hackathon](https://img.shields.io/badge/Hackathon-PS--14-0F9D91?style=for-the-badge)](https://github.com/WasfiAbdulRaheemPR/brain-byte)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20PostgreSQL-142B4A?style=for-the-badge)](https://github.com/WasfiAbdulRaheemPR/brain-byte)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **Tagline:** Your City. Your Voice. Our Responsibility.  
> **Domain:** Civic Technology / Smart City / Public Administration

CivicConnect is a production-grade digital platform designed to build trust and accountability between citizens and local governance. It empowers residents to document community infrastructure failures (potholes, water leakages, broken streetlights, waste overflow), track remediation in real time, and verify administrative resolution evidence.

---

## 1. Problem Statement: PS-14

Rapid urbanization often outpaces municipal maintenance monitoring. Citizens encounter broken roads, dysfunctional drainage, uncollected refuse, and electrical hazards without a transparent channel to report or monitor fixes. Concurrently, public departments struggle with duplicate submissions, unverified claims, missing geolocations, and disjointed accountability.

**CivicConnect directly addresses all PS-14 requirements:**
1. **Multi-modal Issue Submission:** Reports with high-resolution imagery, descriptive text, and optional Leaflet OpenStreetMap geotagging.
2. **Triaging & Categorization:** Pre-configured departments and categories with priority weights.
3. **Lifecycle Transparency:** Immutable timeline history tracking from submission to field resolution.
4. **Interactive GIS Map:** Real-time spatial clustering of civic issues with category and status layers.
5. **Duplicate Detection:** Composite spatial proximity, category matching, and text similarity engine to assist administrators.
6. **Privacy-Preserving Architecture:** Optional coordinates, stripped metadata, and role-guarded citizen data isolation.
7. **Strict Administrative Control:** Separation of citizen and municipal admin privileges.
8. **Fact Verification Gate:** Issues are cataloged as *Submitted* until officially reviewed by an administrator.
9. **Irreversible Accountability:** No issue is ever marked as *Resolved* without a recorded administrative record, timestamp, and optional after-repair evidence.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript & Vite
- **Styling:** Tailwind CSS with custom civic-tech design system tokens
- **Routing:** React Router v6
- **Server State & Data Fetching:** TanStack React Query & Axios
- **Form Validation:** React Hook Form with Zod schemas
- **Interactive Maps:** Leaflet with React-Leaflet and OpenStreetMap tiles
- **Analytics & Charts:** Recharts
- **Icons & Micro-animations:** Lucide React icons & Framer Motion

### Backend
- **Runtime & Framework:** Node.js & Express.js with TypeScript
- **Database ORM:** Prisma ORM with relational PostgreSQL
- **Security & Auth:** JWT in HTTP-only SameSite cookies, bcrypt password hashing, helmet, express-rate-limit, CORS
- **Validation:** Zod schema validation on all incoming payload requests
- **File Uploads:** Multer with mime-type inspection, file size capping, and unique storage keys
- **AI Intelligence:** Pluggable AI engine (Local heuristic engine + optional Gemini/OpenAI integration)

---

## 3. System Architecture

```mermaid
flowchart LR
    Citizen[Citizen User] -->|HTTPS / REST| ReactApp[React 18 + Vite Frontend]
    Admin[Municipal Admin] -->|HTTPS / REST| ReactApp
    ReactApp -->|JSON / Cookies| ExpressApp[Express.js TypeScript Server]
    ExpressApp -->|Auth / Guard| Middleware[JWT Auth & RBAC Middleware]
    Middleware --> Controllers[API Controllers]
    Controllers --> AIService[AI Intelligence Engine]
    Controllers --> PrismaORM[Prisma ORM Client]
    PrismaORM --> PostgresDB[(PostgreSQL 16 Database)]
    Controllers --> FileStorage[(Local Uploads Directory)]
```

---

## 4. Default Seed & Demo Credentials

> **Notice:** These accounts are pre-seeded for development and demonstration purposes. Change credentials before deploying to production.

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@civicconnect.gov` | `AdminSecure2026!` | Full administrative access, triage, status updates, duplicate review, resolution records |
| **Citizen (Demo)** | `citizen@example.com` | `CitizenSecure2026!` | Submit complaints, view personal tracking history, provide resolution feedback |

---

## 5. Local Setup & Installation

### Prerequisites
- Node.js (v18.0.0 or later, v20+ recommended)
- PostgreSQL (v14+ or Docker)
- npm or pnpm

### Step 1: Clone Repository
```bash
git clone https://github.com/WasfiAbdulRaheemPR/brain-byte.git civicconnect
cd civicconnect
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env` in both server and root:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` points to your PostgreSQL instance:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/civicconnect?schema=public"
JWT_SECRET="civicconnect_super_secret_jwt_key_2026_production_grade"
CLIENT_URL="http://localhost:5173"
PORT=5000
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Database Migrations & Seed
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Step 5: Start Application
Run both backend API and frontend client concurrently:
```bash
npm run dev
```
- **Citizen / Admin Frontend:** [http://localhost:5173](http://localhost:5173)
- **REST API Server:** [http://localhost:5000](http://localhost:5000)

---

## 6. Docker Deployment

Launch the complete stack (PostgreSQL, Express API, and Nginx-served React client) using Docker Compose:

```bash
docker compose up -d --build
```
- Client accessible at: [http://localhost:5173](http://localhost:5173)
- Server API accessible at: [http://localhost:5000](http://localhost:5000)
- PostgreSQL listening at: `localhost:5432`

---

## 7. Automated Testing

Execute the test suites:
```bash
# Run server integration tests
npm --workspace=server run test

# Run type check and frontend build verification
npm --workspace=client run build
```

---

## 8. GitHub Repository

- **Repository:** [https://github.com/WasfiAbdulRaheemPR/brain-byte.git](https://github.com/WasfiAbdulRaheemPR/brain-byte.git)
- **Primary Branch:** `main`
- **Commit Standard:** Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`)

