# OM NATRAJ DANCE STUDIO

> **"Where Movement Becomes Expression."**  
> *Premier Dance Studio based in Banmore, Morena, Madhya Pradesh, India.*

A cinematic, modern, high-performance web platform designed for **OM NATRAJ DANCE STUDIO**. Built with React, GSAP, Node.js, Express, MongoDB, and direct media upload architecture.

---

## 🌟 Visual & Cinematic Highlights

- **Theatrical Dark Identity**: Deep charcoal palette (`#070709`), warm ivory, radiant gold (`#d4af37`), ember accents, and soft atmospheric stage spotlighting.
- **GSAP & ScrollTrigger Parallax**: Multi-speed depth parallax on the hero section, subtle scale transformations, and staggered editorial typography reveals.
- **Pinned Storytelling Journey**: Split-screen narrative tracking a dancer's evolution (*01 — Find Your Rhythm*, *02 — Build Your Confidence*, *03 — Own The Stage*).
- **Horizontal Gallery**: Editorial horizontal flow (*"Move. Feel. Express."*) with smooth panning on desktop and natural touch-swipe navigation on mobile devices.
- **Interactive Dance Styles**: Dynamic preview cards that reveal style imagery, age criteria, and batch schedules on hover or tap.
- **Animated Milestone Statistics**: Dynamic counters for Years of Experience, Students Trained, Dance Styles, and Events/Workshops that animate upward upon entering the viewport (all editable via Admin).
- **Direct WhatsApp Couture Inquiry Generator**: Pre-filled WhatsApp message creation for boutique products (Garba dresses, brass ghungroos, carved dandiyas) including Product Name, Selected Size, Price, and Quantity.
- **Custom Desktop Cursor**: Interactive magnetic cursor that morphs into contextual states (`VIEW`, `EXPLORE`, `PLAY`, `ORDER`). Disabled automatically on touch screens.
- **Artistic Lightbox**: Fullscreen modal for viewing high-resolution gallery photography and video reels.

---

## 🚀 Technology Stack

### Frontend (`/client`)
- **Framework**: React 18 with Vite
- **Styling**: Vanilla CSS Design System with CSS Custom Properties (variables, responsive grids, glassmorphism, hardware-accelerated animations)
- **Animation**: GSAP 3 + ScrollTrigger + IntersectionObserver
- **Icons**: Lucide React
- **Routing**: React Router v6

### Backend (`/server`)
- **Runtime**: Node.js & Express.js (REST API Architecture)
- **Database**: MongoDB & Mongoose with an automatic resilient local persistent storage engine fallback (server never crashes even without an active MongoDB daemon)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password encryption
- **Media Uploads**: Multer with direct file upload pipeline supporting Cloudinary and local static file serving (`/uploads`)

---

## 📂 Project Architecture

```
om-natraj-dance-studio/
├── client/                     # Frontend React application
│   ├── public/
│   │   ├── images/             # Editorial studio photography
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/         # Reusable components (Hero, Navbar, Footer, LeadEnquiryForm, etc.)
│   │   ├── context/            # AuthContext and StudioContext
│   │   ├── pages/              # Public pages (Home, About, Classes, Events, Gallery, Videos, Products, Contact)
│   │   │   └── admin/          # Admin pages (Dashboard, Leads, Classes, Events, Gallery, Videos, Products, Settings)
│   │   ├── services/           # API client
│   │   ├── styles/             # Modular CSS design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Express REST API
│   ├── config/                 # Database & Cloudinary configurations
│   ├── middleware/             # JWT auth & Multer upload middlewares
│   ├── models/                 # Mongoose schemas (Admin, Lead, Class, Event, Gallery, Video, Product, Settings)
│   ├── routes/                 # REST API routes (/api/auth, /api/leads, /api/classes, /api/upload, etc.)
│   ├── services/               # Resilient storage service abstraction
│   ├── utils/                  # Database auto-seeder
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── package.json                # Root orchestration scripts
```

---

## 🛠️ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on v22.19.0)
- **npm**: v9+ (tested on v10.9.3)

### 2. Running Locally

Both the client and backend can be run simultaneously:

```bash
# Terminal 1 - Start the backend (Port 5000)
cd server
npm run start

# Terminal 2 - Start the frontend (Port 5173)
cd client
npm run dev
```

Or from the root directory:
```bash
npm run dev
```

- **Public Website**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Admin Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

---

## 🔐 Admin Portal Credentials

- **URL**: `http://localhost:5173/admin/login`
- **Username**: `admin`
- **Password**: `omnatrajadmin`

### What the Admin Can Manage:
1. **Leads & Enquiries**: View incoming candidate submissions, filter by status (`NEW`, `CONTACTED`, `FOLLOW-UP`, `CONVERTED`, `CLOSED`), add internal follow-up notes, trigger direct 1-click WhatsApp follow-ups, or delete.
2. **Curriculum Classes**: Add, edit, or delete dance classes with direct image uploads.
3. **Events & Workshops**: Schedule Garba bootcamps, sangeet workshops, and concerts.
4. **Gallery Photography**: Direct photo upload from device (no manual URL entry needed), publish/unpublish toggling, and categories.
5. **Dance Videos**: Direct video and thumbnail upload, durations, and descriptions.
6. **Products Boutique**: Add Garba dresses, set pricing, assign size and color options, and stock statuses.
7. **Testimonials**: Manage client quotes and ratings.
8. **Milestone Statistics**: Update the 4 homepage animated numbers.
9. **Studio Settings**: Update phone number, WhatsApp number, email, address, and hero taglines.

---

## 📞 Studio Contact Information

- **Studio Name**: OM NATRAJ DANCE STUDIO
- **Location**: Banmore, Morena, Madhya Pradesh, India
- **Phone**: +91 9713799075
- **WhatsApp**: +91 9713799075
- **Email**: kushanikt667@gmail.com
- **YouTube**: [https://www.youtube.com/@OMNDS](https://www.youtube.com/@OMNDS)
