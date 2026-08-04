## 🛡️ ScamShield

**Live Demo:** [scamshield-production-b342.up.railway.app](https://scamshield-production-b342.up.railway.app/login.html)

ScamShield analyzes job and internship offers for common scam red flags using a custom rule-based scoring engine, with company reputation tracking built from crowd-sourced scan history. Users can paste offer text or upload a PDF, and get an instant risk verdict — Low, Suspicious, or High — along with a plain-English explanation of exactly why it was flagged.

## Features

- 🔐 **Secure Authentication** — user registration and login with BCrypt password hashing
- 🔍 **Scam Detection Engine** — rule-based scoring across multiple red-flag categories (payment requests, urgency language, unrealistic salaries, suspicious links, free email domains)
- 📊 **Explainable Results** — every scan shows the exact reasons behind its risk score, not just a black-box verdict
- 🏢 **Company Reputation Tracking** — aggregates past scans by company name to build a crowd-sourced trust score over time
- 📄 **PDF Upload** — extract and analyze text directly from uploaded offer letters
- 📜 **Scan History** — every scan is saved and viewable, building a personal record over time

## Tech Stack

- **Backend:** Java, Spring Boot, Spring Security, Spring Data JPA
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Deployment:** Railway

## How the Detection Engine Works

Rather than a black-box ML model, ScamShield uses a transparent, rule-based scoring system — the same general approach used in many real-world fraud-detection systems. Each red flag detected in the offer text adds points to a running score:

| Signal | Points |
|---|---|
| Payment/deposit requests before hiring | +30 |
| Urgency/pressure language | +20 |
| Unrealistic salary for stated experience | +25 |
| Free email domain (Gmail, Yahoo, etc.) | +15 |
| Suspicious/shortened links | +20 |
| No verifiable company website | +10 |

The total score maps to a verdict: **0–19 = Low Risk**, **20–49 = Suspicious**, **50+ = High Risk**.

## Getting Started Locally

1. Clone the repo
2. Set up a MySQL database and update `application.properties` with your credentials
3. Run `ScamshieldApplication.java`
4. Open `http://localhost:8080/login.html`

## Known Limitations

- PDF upload works reliably in local development; there is a known issue with file handling in the current production deployment that's being investigated
- Company reputation data starts empty for any new company — it builds up as users submit scans (a natural characteristic of crowd-sourced systems, sometimes called the "cold start" problem)

## Author

Built by Abinaya Nagarajan
