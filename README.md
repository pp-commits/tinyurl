# 🔗 TinyLink — URL Shortener

TinyLink is a minimal, production-ready URL shortener built using **Next.js 16**, **Prisma**, and **Neon Postgres**, deployed on **Vercel**.

Users can:
- Create short links
- Optionally use a custom shortcode
- View click statistics
- Track last visited timestamps
- Delete links
- View per-link details
- Redirect via `/[code]`
- Use public API endpoints for CRUD operations

This project was built as part of a **take-home assignment** and follows all requirements including stable routes, API behavior, validation, and deployment.


---

##  Live Demo

**Frontend Deployment:**  
👉 https://tinyurl12-811a0pywf-prajwal-pawars-projects-6476d017.vercel.app/ 

**Health Check:**  
👉 https://tinyurl12-811a0pywf-prajwal-pawars-projects-6476d017.vercel.app/healthz  

---

## Tech Stack

- **Next.js 16 (App Router)**
- **React**
- **TypeScript**
- **TailwindCSS**
- **Prisma ORM**
- **Neon Serverless Postgres**
- **Vercel Serverless Deployment**

---

## 📌 Features

### Core Functionality
- Shorten any long URL
- Custom code support (`[A-Za-z0-9]{6,8}`)
- Live-updating dashboard (auto-refresh every 3s)
- Per-link stats page (`/code/[code]`)
- Last clicked timestamp + click count
- Soft-polished modern UI with TailwindCSS
- Redirect tracking via server route (`/[code]`)
- Fully deployed with public API access