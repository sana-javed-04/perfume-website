# ⚜️ AURA ATELIER — Luxury Niche Fragrance E-Commerce

> An ultra-luxury, high-performance artisanal fragrance e-commerce web platform engineered with vanilla web technologies and responsive design.

[![Developer Portfolio](https://img.shields.io/badge/Demo-Live%20Store-d4af37?style=for-the-badge)](https://sanajaved-dev.vercel.app/)

---

## 🌟 Overview

**AURA ATELIER** is a bespoke e-commerce store designed for a luxury perfume house. It delivers a fast, seamless shopping experience with zero heavy backend dependencies, utilizing intelligent client-side storage architectures and automated WhatsApp multi-item order routing.

---

## ✨ Key Features

- **📱 Pixel-Perfect Strict Responsive Layout:** Custom media architecture optimized across Laptop (1024px+), Tablet (768px), and Ultra-Compact Mobile screens (320px–375px).
- **🛍️ Sliding Cart & Wishlist Drawers:** Persistent local storage carts with live item-level quantity controls and automatic subtotal recalculation.
- **💬 Direct WhatsApp Concierge Checkout:** Formats structured multi-item order receipts and dispatches directly to the brand's WhatsApp support desk.
- **🛡️ Secure Pin-Gated Admin Console (`admin.html`):**
  - Full catalog CRUD (Create, Edit, Delete fragrances).
  - Real-time stock amount tracking and "Sold Out" state automation.
  - Multi-image URL gallery parser.
  - **Inline Customer Review Moderation:** Delete feedback or publish official brand responses with live unread review indicator badges.
- **🧪 Dynamic Fragrance Page Engine (`product.html?id=...`):**
  - Isolated per-product customer reviews storage.
  - Olfactory scent pyramid timeline (Top, Heart, and Base notes).
  - Dynamic volume multipliers (50ml / 100ml) with instant price recalculation.
  - Interactive multi-angle image gallery switcher.
- **🌗 Dual Luxury Aesthetic Engine:** Smooth dark/light contrast theme switching with custom CSS variable tokens.

---

## 🛠️ Technology Stack

- **Core:** Semantic HTML5, Vanilla JavaScript (ES6+), Modern Modular CSS3
- **Tooling & Build:** [Vite](https://vitejs.dev/)
- **Storage Layer:** Browser `LocalStorage` & `SessionStorage` Engine
- **Icons & Typography:** Google Fonts (_Cinzel_, _Cormorant Garamond_, _Montserrat_)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Setup

```bash
# 1. Clone repository
git clone [https://github.com/sana-javed-04/perfume-website.git](https://github.com/sana-javed-04/perfume-website.git)

# 2. Navigate to directory
cd perfume-website

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```
