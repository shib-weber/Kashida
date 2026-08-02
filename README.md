# 🧵 Kashida — High Fashion E-Commerce Platform

> A full-stack, highly responsive e-commerce web application designed for luxury couture, artisanal garments, and high-fashion collections. Built with **React**, **FastAPI**, **MongoDB**, **Redis**, and **Cloudinary**.

---

## 🌟 Key Features

### 🛍️ Luxury Shopping Experience (`client/`)
* **Interactive Haute Couture Gallery:** Filter products by categories (*Kurtis, Lehengas, Sarees, Shawls, Dupattas*).
* **Rich Product Detail View:** Interactive image gallery previews, custom size selections (`S`, `M`, `L`, `XL`), and quantity controls.
* **Persistent Wishlist:** Toggle items in/out of the wishlist with visual state persistence and interactive feedback.
* **1-Click Share:** Instant product link copying to clipboard with floating toast notification alerts.
* **Fail-Safe Cart System:** Dual-layer cart management that interfaces with Redis for lightning-fast caching and seamlessly falls back to local session state.

### 💼 Merchant & Admin Features (`server/`)
* **Cloud Image Uploads:** Direct binary file uploading integrated with **Cloudinary CDN**, generating optimized, auto-compressed WebP images on the fly.
* **Resilient API Layer:** Robust exception handling preventing 500 errors across missing cached items or offline database instances.
* **JWT Authentication:** Secure user authentication using standard Bearer token header flows.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Tailwind CSS, Vite |
| **Typography** | Cinzel, Cormorant Garamond, Jost |
| **Backend** | Python 3.12, FastAPI, Uvicorn, Pydantic v2 |
| **Databases** | MongoDB (Motor Async Driver), Redis (Async Cache) |
| **CDN & Storage** | Cloudinary API (Product Images) |

---

## 📁 Repository Structure

```text
Ecommerce/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, GarmentLoader, Hero)
│   │   ├── pages/              # CollectionsPage, ProductDetailPage, CartPage, etc.
│   │   └── App.jsx             # React Router setup
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # FastAPI Backend Application
│   ├── app/
│   │   ├── config.py           # Settings & Environment variables
│   │   ├── database.py         # MongoDB & Redis client connections
│   │   ├── controllers/        # Business logic (Cart, Likes, Product)
│   │   ├── routes/             # API routes (Auth, Products, Cart, Likes)
│   │   ├── schemas/            # Pydantic validation schemas
│   │   └── utils/              # Cloudinary uploader & JWT Auth helpers
│   ├── .env                    # Environment secrets (Git-ignored)
│   ├── .gitignore              # Server ignore rules
│   ├── main.py                 # FastAPI app entry point
│   └── requirements.txt        # Python dependencies
│
└── README.md                   # Root documentation