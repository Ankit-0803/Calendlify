# 🗓️ Calendlify - Scheduling Made Simple

<div align="center">

[![Demo Video](https://img.shields.io/badge/🎥_Watch-Demo_Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white)]([[YOUR_DEMO_VIDEO_LINK_HERE](https://docs.google.com/videos/d/1vqmOH-kCrOXktdxyIezEyoCrfwD4DhPVEvBMmaLM_gY/edit?usp=sharing)](https://docs.google.com/videos/d/1vqmOH-kCrOXktdxyIezEyoCrfwD4DhPVEvBMmaLM_gY/edit?usp=sharing))
[![Vercel App](https://img.shields.io/badge/🚀_Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)]([[https://your-app.vercel.app/](https://calendlify.vercel.app/)](https://calendlify.vercel.app/))
[![Render API](https://img.shields.io/badge/⚙️_Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)]([https://calendlify.onrender.com](https://calendlify.onrender.com/))

</div>

---

## 🚀 Overview

**Calendlify** is a full-stack scheduling platform clone (inspired by Calendly) that streamlines meeting coordination. It allows users to create event types, set availability rules, and share booking links with invitees. Built with a modern tech stack, it features real-time scheduling, intuitive dashboards, and seamless time zone management.

## ✨ Key Features

- **Event Type Management**: Create and customize different meeting types (15min, 30min, etc.) with specific locations (Zoom, Phone, In-person).
- **Advanced Availability**: 
  - Set weekly recurring schedules.
  - Define date-specific overrides.
  - Configure scheduling windows (e.g., 60 days in advance).
  - Time zone intelligence for global coordination.
- **Booking Flow**:
  - Slick public booking pages.
  - Real-time slot calculation based on availability.
  - Instant booking confirmation.
- **Dashboard**:
  - Overview of scheduled meetings.
  - Filter meetings by status (Upcoming, Past, Canceled).
  - Quick access to copy booking links.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Deploy**: Vercel

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Neon DB)
- **ORM**: Prisma
- **Deploy**: Render

## 🏁 Getting Started Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankit-0803/Calendlify.git
   cd Calendlify
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your credentials
   # DATABASE_URL=...
   # PORT=5030
   
   npx prisma generate
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Create .env.development
   # VITE_API_URL=http://localhost:5030/api
   
   npm run dev
   ```

## 📦 Deployment

### Backend (Render)
The backend is deployed on Render as a Web Service.
- **URL**: `https://calendlify.onrender.com`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`

### Frontend (Vercel)
The frontend is deployed on Vercel.
- **URL**: `https://your-app.vercel.app`
- **Environment Variable**: `VITE_API_URL` set to the Render Backend API URL.

---

<div align="center">
  <sub>Built by Ankit Kushwaha</sub>
</div>
