# ⛏️ Coal Mine Operations & Compliance Portal (SIH 2026)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue.svg)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-darkgreen.svg)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-emerald.svg)](https://www.mongodb.com/atlas)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple.svg)](https://vite-pwa-org.netlify.app)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

An enterprise-grade, real-time coal mine management, regulatory compliance, and worker grievance redressal platform engineered for **Smart India Hackathon (SIH 2026)**. The system integrates GIS mapping, on-device AI/ML text classification, computer vision OCR, field geolocation, automated risk scoring, and a cryptographic SHA-256 audit ledger.

---

## 🌟 Key Highlights & Feature Modules

### 🗺️ 1. Interactive GIS Coalfield Mapping
- **OpenStreetMap & Leaflet Integration**: Renders all registered coal mines across major Indian coalfields (BCCL, CCL, ECL, SECL, MCL, NCL, WCL, NEC) with precise district coordinates.
- **Dynamic Status Markers**: Glow-accented map pins color-coded by operational status:
  - 🟢 **Active** (`#10b981`)
  - 🟡 **Under Maintenance** (`#f59e0b`)
  - 🔴 **Closed** (`#f43f5e`)
- **Interactive Popups**: Inspect mine details, subsidiary affiliation, geographic region, and operational health with one click.

### 🤖 2. NLP Grievance Auto-Categorization (`natural` BayesClassifier)
- **Machine Learning Categorization**: Integrated Naive Bayes classifier trained on 80+ realistic Indian mining grievance samples across four standard categories:
  - 💰 **Wages** (overtime dues, salary delays, bonus reconciliation)
  - 🦺 **Safety** (roof collapse risks, defective PPE, ventilation failures, HEMM proximity)
  - 🌿 **Environmental** (coal dust suppression, effluent runoff, CAAQMS PM2.5 levels)
  - 📋 **General** (shift rosters, canteen hygiene, transport facilities)
- **Offline Serialization**: Persists model weights to `server/ml/classifier.json` with seamless rule-based keyword fallback if model is rebuilding.

### 🚨 3. Regulatory Safety Escalation Engine
- **Automated SLA Tracking**: Automatically identifies failed audits or open safety notices older than **14 days**.
- **Dynamic Escalation Flags**: Marks records with `isEscalated: true` on-the-fly, displaying flashing `⚠️ ESCALATED` badges in audit panels and dedicated counter in Portal Overview.

### 📊 4. Mine Risk Score & Predictive Analysis (`/api/mines/risk-analysis`)
- **Composite Scoring Matrix (0–100)**:
  - Evaluates critical safety infractions and failed audits within the last **90 days** (30 pts each).
  - Integrates unresolved worker grievances (15 pts each).
- **Risk Level Categorization**: Automatically ranks mines in descending risk order (**High** $\ge 60$, **Medium** $30–59$, **Low** $< 30$) to prioritize DGMS statutory inspections.

### 📍 5. Field GPS Geolocation Capture
- **HTML5 Geolocation API**: Captures exact field latitude and longitude on mobile/desktop browsers for:
  - Safety audits logged at active pit highwalls and washeries.
  - Onsite worker grievance reports.
- **Coordinate Tagging**: Automatically saves and displays coordinates (`XX.XXXX°N, YY.YYYY°E`) on inspection and grievance cards.

### 📷 6. Client-Side OCR with Tesseract.js
- **Inspection Note Scanning**: Upload photos of handwritten or printed field inspection logs.
- **Client-Side Optical Character Recognition**: Runs optical character recognition directly in the browser via `tesseract.js`, providing live progress percentage and auto-filling extracted text into the **Findings & Observations** field.

### ⛓️ 7. Cryptographic SHA-256 Hash Chain Audit Trail
- **Tamper-Evident Ledger**: Every `CREATE`, `UPDATE`, and `DELETE` event across Mines, Inspections, and Grievances is cryptographically linked to the previous entry's hash.
- **Mathematical Integrity**: Hashes `timestamp + action + entityType + entityId + recordSnapshot + previousHash` using SHA-256.
- **Live Chain Verification (`/api/audit-log`)**: Continuously verifies chain integrity and displays immutable payload snapshots in the frontend.

### 📱 8. Progressive Web App (PWA) Support
- **Mobile Installation**: Powered by `vite-plugin-pwa` with custom Web App Manifest, offline precaching, standalone display mode, and service worker runtime tile caching.

### 🛡️ 9. Role-Based Access Simulation
- **Admin**: Full control (Create, update status, and delete across all entities).
- **Inspector**: Operational access (Log audits, file grievances, view all analytics).
- **Viewer**: Read-only oversight mode for executive stakeholders and audits.

---

## 📁 Repository Architecture

```text
sih26024/
├── client/                         # React 19 + Vite Frontend (PWA)
│   ├── public/
│   │   ├── favicon.svg             # Portal vector icon
│   │   └── icons.svg
│   ├── src/
│   │   ├── App.jsx                 # Master Operations Portal Component
│   │   ├── index.css               # Design system tokens & styling
│   │   └── main.jsx                # React DOM root entry
│   ├── index.html                  # HTML5 entry with PWA meta tags
│   ├── vite.config.js              # Vite config with VitePWA & /api proxy
│   └── package.json
│
├── server/                         # Node.js + Express REST API
│   ├── config/
│   │   └── db.js                   # Mongoose MongoDB connection
│   ├── ml/
│   │   ├── trainingData.js         # 80+ realistic labeled grievance samples
│   │   ├── trainClassifier.js      # Natural BayesClassifier training script
│   │   └── classifier.json         # Serialized ML model
│   ├── models/
│   │   ├── Mine.js                 # Mine schema (coordinates, capacity, status)
│   │   ├── Inspection.js           # Audit schema (findings, severity, GPS)
│   │   ├── Grievance.js            # Grievance schema (category, status, GPS)
│   │   └── AuditLog.js             # SHA-256 chained audit ledger schema
│   ├── routes/
│   │   └── api.js                  # Complete REST API route handlers
│   ├── .env.example                # Environment variable template
│   ├── .env                        # Local environment variables
│   ├── seed.js                     # Multi-subsidiary database seeder
│   ├── server.js                   # Express server entry point
│   └── package.json
│
├── .gitignore
├── package.json                    # Workspace scripts & concurrently runner
└── README.md                       # Project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node.js v20 / v24)
- **npm**: v9+
- **MongoDB Atlas** account (or local MongoDB daemon)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Riyansh-07/sih26024.git
cd sih26024
npm run install:all
```

### 2. Configure Environment Variables
Create or verify `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sih26024?retryWrites=true&w=majority
```

*(Optional)* For production frontend deployment, create `client/.env`:
```env
VITE_API_URL=https://your-backend-service.onrender.com
```

### 3. Train NLP Machine Learning Classifier
Train the Naive Bayes model on mining grievance datasets:
```bash
npm run train-model
```

### 4. Seed Database with Realistic Data
Populate 25 mines across 8 CIL subsidiaries, 120+ safety inspections, 60+ grievances, and initial cryptographic audit blocks:
```bash
npm run seed
```

### 5. Start Development Servers
Run both backend (`localhost:5000`) and Vite frontend (`localhost:3000`) concurrently:
```bash
npm run dev
```

---

## 📡 REST API Reference

### Health & Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service uptime and MongoDB connection state |
| `GET` | `/api/mines/risk-analysis` | 0–100 composite risk calculation sorted descending |
| `GET` | `/api/audit-log` | Fetches SHA-256 audit ledger with chain verification |

### Mine Operations (`/api/mines`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/mines` | Fetch all registered coal mines |
| `GET` | `/api/mines/:id` | Fetch single mine by ObjectId |
| `POST` | `/api/mines` | Register new mine site *(Logged to Audit Trail)* |
| `PUT` | `/api/mines/:id` | Update mine parameters *(Logged to Audit Trail)* |
| `DELETE`| `/api/mines/:id` | Delete mine record *(Logged to Audit Trail)* |

### Safety Audits & Inspections (`/api/inspections`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/inspections` | Fetch all audits with on-the-fly escalation tags |
| `GET` | `/api/inspections/:id` | Fetch single inspection audit |
| `POST` | `/api/inspections` | Log safety/environmental audit *(Logged to Audit Trail)* |
| `DELETE`| `/api/inspections/:id` | Remove inspection record *(Logged to Audit Trail)* |

### Worker Grievances (`/api/grievances`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/grievances` | Fetch all grievances with populated mine info |
| `GET` | `/api/grievances/:id` | Fetch single grievance record |
| `POST` | `/api/grievances` | Submit grievance *(ML Auto-Categorized & Audited)* |
| `PUT` | `/api/grievances/:id` | Update grievance status *(In-Review / Resolved)* |
| `DELETE`| `/api/grievances/:id` | Delete grievance record *(Logged to Audit Trail)* |

---

## 🚀 Deployment Guide

### Backend Deployment (Render Free Tier)
1. Push repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `NODE_ENV` = `production`

### Frontend Deployment (Vercel)
1. Create a new project on [Vercel](https://vercel.com) from your repository.
2. Set **Root Directory**: `client`
3. Framework Preset: **Vite**
4. Add Environment Variable:
   - `VITE_API_URL` = `https://<your-render-backend-url>.onrender.com`
5. Deploy.

---

## 🛠️ Technology Stack Summary

- **Frontend**: React 19, Vite, Leaflet, React-Leaflet, Tesseract.js, Vite-Plugin-PWA, Vanilla CSS Tokens
- **Backend**: Node.js, Express.js, Natural (NLP), Crypto (SHA-256), Mongoose ODM
- **Database**: MongoDB Atlas
- **ML / AI**: Natural BayesClassifier, Tesseract OCR Engine

---

## 📄 License
This project is developed for the Smart India Hackathon 2026 and is released under the [MIT License](LICENSE).
