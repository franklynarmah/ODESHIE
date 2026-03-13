# ƆDESHIƐ — African Fashion & Culture Store

An ecommerce website celebrating African fashion, craftsmanship, and culture. Built as a semester project.

## Overview

ƆDESHIƐ is a full-stack ecommerce platform featuring African fashion items — from Ankara tops and Boubou dresses to Zulu beaded accessories and Moroccan artefacts. All prices are in GHC (Ghanaian Cedis).

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios

**Backend**
- Node.js + Express
- SQLite (via sql.js)
- JWT Authentication
- bcryptjs

## Features

- Browse products by category (Tops, Dresses, Jewelry, Footwear, Accessories, Trousers)
- New Arrivals and Sales sections
- Product detail page with image gallery, color/size selector, and reviews
- Shopping cart (guest + logged-in users)
- User authentication (register/login)
- Search functionality
- Dark mode
- Promo code support
- Responsive design

## Project Structure

```
ƆDESHIƐ/
├── client/          # React frontend (port 5173)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── context/
└── server/          # Express backend (port 5000)
    ├── routes/
    ├── db.js
    └── seed.js
```

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

1. Clone the repo
```bash
git clone https://github.com/franklynarmah/ODESHIE.git
cd ODESHIE
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

### Running the app

**Option 1 — Double-click `start.bat`** (Windows, opens both servers automatically)

**Option 2 — Manual (two terminals)**

```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

### Seed the database

```bash
cd server
node seed.js
```

## Pages

| Page | Route |
|------|-------|
| Home | `/` |
| Product Detail | `/product/:id` |
| Cart | `/cart` |
| Login | `/login` |
| Register | `/register` |
| Category | `/category/:category` |
| New In | `/new-in` |
| Sale | `/sale` |

## Promo Codes

| Code | Discount |
|------|----------|
| `ODESHIE20` | 20% off |
| `AFRICA10` | 10% off |
| `WELCOME15` | 15% off |

## Team

Built with love for African culture.

---

*Semester Project — 2026*
