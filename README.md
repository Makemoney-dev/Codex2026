# InvisibleScore — Credit Score for the Invisible

> **"Credit history shouldn't define your financial future."**

InvisibleScore is an explainable alternative credit and financial inclusion scoring platform for financially active individuals (gig workers, delivery partners, shopkeepers, freelancers, and first-time borrowers) who have little or no traditional credit history.

---

## 🎯 The Core Concept

Traditional credit bureaus penalize people who have never taken a formal loan or credit card, ignoring months or years of prudent financial behavior.

InvisibleScore captures **consented alternative financial signals**:
- **UPI Transaction Cadence** (frequency, regularity, volume)
- **Housing Rent Settlements** (on-time regularity, consistency)
- **Utility Bill Timeliness** (electricity, gas, water settlements)
- **Mobile Prepaid Recharges** (continuity, expiration avoidance)
- **Income Stability** (cash-flow predictability)

These signals are transformed through feature engineering into an explainable **0–900 Inclusion Score**, powered by a trained **Gradient Boosting Regressor** and **SHAP TreeExplainer** that reveals the exact plain-language positive and negative factors driving the score.

> ⚠️ **Disclaimer**: *InvisibleScore is a demonstration prototype using synthetic data. It is not an official CIBIL score, does not replace formal bureaus, and does not guarantee loan approval.*

---

## ⚡ 2-Minute Hackathon Demo Flow

| Step | Action | What to Demonstrate |
| :--- | :--- | :--- |
| **1. Landing Page** | Open `http://localhost:5173/` | Modern dark fintech landing page explaining the credit-invisible problem, 4 core pillars, and live preview gauge. |
| **2. Try Demo** | Click **"Try Demo"** | Enters the **Borrower Dashboard** for **Rahul Sharma** (Delivery Partner, Mumbai). |
| **3. Inclusion Score** | View **Score Gauge** | Shows **737 / 900** (`GOOD` band), `+28 points this month`, and `86% Data Coverage`. |
| **4. Alternative Data** | View **Signals Grid** | 4 data cards: UPI Consistency (92%), Rent Regularity (95%), Utility Bills (88%), Mobile Recharge (84%). |
| **5. Explainable AI** | View **"Why this score?"** | Real SHAP values mapped to plain language: `+ Consistent UPI activity (+42 pts)`, `+ Regular rent payments (+31 pts)`, `- Irregular income pattern (-18 pts)`. |
| **6. Score History** | View **History Chart** | Recharts Area Chart showing 6-month historical trajectory from 680 to 737. |
| **7. Privacy Center** | Open **"Privacy & Consent"** | Shows 4 data streams with toggle switches. Toggle **Utility Bills OFF** ➔ observe data coverage drop to 66% and score dynamically recalculate! Toggle back ON. |
| **8. Score Simulator** | Open **"Score Simulator"** | Adjust sliders (Rent, UPI, Bills) ➔ observe real-time hypothetical score projection (e.g. `737 → 791 (+54 pts)` into `Excellent` tier) with zero DB modification. |
| **9. Lender Assessment** | Switch to **"Lender View"** | Open Lender Portal: inspect Rahul Sharma, Priya Verma, Amit Patel. Verify **Privacy Firewall**: lenders see score, band, coverage, and factor impact, but **never raw transactions**. |
| **10. Access History** | Open **"Access History"** | Review immutable audit log proving that every lender inspection is timestamped and recorded. |

---

## 🔑 Preloaded Demo Personas

| Persona | Role | Email | Password | Profile & Score |
| :--- | :--- | :--- | :--- | :--- |
| **Rahul Sharma** | Borrower | `borrower@demo.com` | `demo123` | Delivery Partner, Mumbai • **Score 737 (Good)** • 86% Coverage |
| **Amit Patel** | Borrower | `amit@demo.com` | `demo123` | Small Retailer, Ahmedabad • **Score 737 (Good)** • High Recharge |
| **Priya Verma** | Borrower | `priya@demo.com` | `demo123` | Freelance Designer, Bengaluru • **Score 802 (Excellent)** • High Stability |
| **Sneha Joshi** | Borrower | `sneha@demo.com` | `demo123` | Micro-Vendor, Pune • **Score 651 (Good)** • Lower Cadence |
| **Mumbai Finance Ltd** | Lender | `lender@demo.com` | `demo123` | NBFC Underwriting Desk (Privacy-Preserving Score Lookup) |

---

## 🏗️ Architecture & Technology Stack

```text
React 18 + Vite + Tailwind CSS + Recharts + Lucide
                     │
            Axios HTTP Requests
                     ▼
             FastAPI Application
         ┌───────────┴───────────┐
         ▼                       ▼
   SQLite Database         ML & SHAP Engine
   (SQLAlchemy 2.0)    (GradientBoosting + TreeExplainer)
```

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Recharts, Lucide React icons, Axios.
- **Backend**: Python 3.14 / 3.11+, FastAPI, SQLite (`app.db`), SQLAlchemy 2.0, Pydantic v2.
- **Machine Learning**: scikit-learn (`GradientBoostingRegressor`), SHAP (`TreeExplainer`), NumPy, pandas, joblib.

---

## 🚀 Quick Start Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ (tested on v24.11.0) and npm

### 1. Start Backend

```bash
cd backend
python -m pip install -r requirements.txt
python seed_demo.py
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Interactive API Docs (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health status of API and database |
| `POST` | `/api/demo/login` | 1-click authentication for Borrower and Lender personas |
| `GET` | `/api/demo/borrowers` | List of all 4 preloaded demo borrower profiles |
| `GET` | `/api/score/{borrower_id}` | Latest score, score band, confidence, coverage, alt data cards, and SHAP explanations |
| `GET` | `/api/score/history/{borrower_id}` | 6-month historical score progression data for charts |
| `POST` | `/api/score/simulate/{borrower_id}` | Real-time ML hypothetical score projection from slider inputs |
| `GET` | `/api/consent/{borrower_id}` | Current consent status for UPI, Rent, Bills, and Recharge |
| `POST` | `/api/consent/{borrower_id}` | Toggle consent ON/OFF ➔ dynamically recalculates score |
| `GET` | `/api/lender/borrower/{borrower_id}` | Privacy-safe lender assessment (strictly zero raw data) |
| `GET` | `/api/lender/access-log` | Audit logs of all institutional inquiries |

---

## 🛡️ Responsible AI & Consumer Privacy Guardrails

1. **Consent-Gated Processing**: The scoring engine only incorporates features from consented alternative sources.
2. **Dynamic Adaptation**: When a consumer revokes consent for a data stream, the model substitutes neutral baseline parameters and recalculates the score in real time.
3. **Privacy Firewall**: Lenders are strictly restricted to viewing aggregated scores, score bands, confidence metrics, and high-level explainable factor labels. **Raw banking transactions, rental documents, and utility invoices are never exposed.**
4. **Transparent Audit Logging**: Every institutional query creates an immutable timestamped log accessible to the borrower.
