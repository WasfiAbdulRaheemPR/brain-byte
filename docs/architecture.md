# CivicConnect - System Architecture & Engineering Specifications

**Hackathon Problem Statement:** PS-14  
**Project:** Community Problem Reporting and Resolution Platform  
**Tagline:** Your City. Your Voice. Our Responsibility.

---

## 1. System Overview

CivicConnect is a modern civic-technology web platform designed to bridge citizens and municipal administrators. It enables citizens to report local civic issues (roads, electricity, waste, water, public infrastructure), upload geo-tagged photographic evidence, track status progression transparently, and submit satisfaction feedback upon verified administrative resolution.

Administrators are equipped with high-throughput workflow tools: real-time dashboard analytics, interactive Leaflet OpenStreetMap geographic clusters, automated and AI-assisted duplicate report detection, priority and department triage, granular audit logging, and cryptographic accountability for problem resolution.

```mermaid
flowchart TD
    subgraph Citizens
        C1[Citizen Web Portal] -->|Report Issue + Photo + GPS| API_GW[Express REST API Gateway]
        C1 -->|Track Timeline & Submit Feedback| API_GW
    end

    subgraph Administrators
        A1[Admin Dashboard & Map] -->|Triage, Assign, Update Status| API_GW
        A1 -->|Review AI Duplicates & Post Resolution Proof| API_GW
    end

    subgraph Backend Core Services
        API_GW --> Auth[JWT & Cookie Auth / RBAC]
        API_GW --> CompCtrl[Complaint Controller]
        API_GW --> AdminCtrl[Admin Controller]
        API_GW --> AISvc[AI Intelligence Engine]
        API_GW --> UploadSvc[Multer Secure Storage]
    end

    subgraph Data & Persistence
        CompCtrl --> Prisma[Prisma ORM]
        AdminCtrl --> Prisma
        Prisma --> Postgres[(PostgreSQL Database)]
        UploadSvc --> DiskStorage[(Encrypted Local/Cloud Storage)]
    end
```

---

## 2. PS-14 Core Functional Requirements & Verification

| Requirement | Implementation Component | Verification Criteria |
|---|---|---|
| **1. Multi-modal submission** | `POST /api/complaints` + Multer | Accepts text title/description, category, coordinates, up to 5 photos |
| **2. Categorization & Prioritization** | Category & Priority Enums | Roads, Streetlights, Waste, Water, Public Facilities, Other; Low/Med/High/Urgent |
| **3. Lifecycle status tracking** | `status_history` relational ledger | Immutable state transitions: SUBMITTED -> UNDER_REVIEW -> IN_PROGRESS -> RESOLVED |
| **4. Interactive GIS Map** | Leaflet + OpenStreetMap | Spatial distribution, category icons, cluster views, admin filtering |
| **5. Duplicate Detection Engine** | Heuristic + AI vector similarity | Spatial proximity + Levenshtein text match + AI semantic comparison |
| **6. Privacy & Sensitive Protection** | Geo-masking & Upload guards | Coordinates optional; image mime/buffer validation; citizen isolation |
| **7. Role-Based Access Control** | Auth Middleware + HTTP-only JWT | Strict backend policy: Citizens can only access own records; Admin routes guarded |
| **8. Unreviewed Integrity** | Workflow engine constraint | New complaints default to SUBMITTED; never published as verified until review |
| **9. Resolution Accountability** | `resolution_records` table | Resolution strictly requires administrator identity, description, and proof photo |

---

## 3. Database Entity Relationship Model

```mermaid
erDiagram
    User ||--o{ Complaint : "reports"
    User ||--o{ StatusHistory : "updates"
    User ||--o{ ResolutionRecord : "resolves"
    User ||--o{ AuditLog : "triggers"
    User ||--o{ Feedback : "submits"
    
    Category ||--o{ Complaint : "categorizes"
    Department ||--o{ Complaint : "assigned to"
    
    Complaint ||--o{ ComplaintImage : "contains"
    Complaint ||--o{ StatusHistory : "progresses through"
    Complaint ||--o| ResolutionRecord : "closed by"
    Complaint ||--o{ Feedback : "receives"
    Complaint ||--o{ DuplicateSuggestion : "matches"

    ResolutionRecord ||--o{ ResolutionImage : "evidenced by"
```

