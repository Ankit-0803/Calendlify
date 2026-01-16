# 🗓️ Calendlify – Scheduling Made Simple

Calendlify is a full-stack scheduling application inspired by Calendly.  
It allows users to create event types, manage availability, and let others book meetings through a shared link.

---

## 🔗 Live Links

- 🎥 **Video Demo**  
  https://docs.google.com/videos/d/1vqmOH-kCrOXktdxyIezEyoCrfwD4DhPVEvBMmaLM_gY/edit?usp=sharing

- 🌐 **Frontend (Vercel)**  
  https://calendlify.vercel.app/

- ⚙️ **Backend API (Render)**  
  https://calendlify.onrender.com/

---

## 🚀 Features

- Create and manage event types (15 min, 30 min, etc.)
- Weekly availability with date-specific overrides
- Public booking page using event slug
- Real-time available slot calculation
- View upcoming and past meetings
- Cancel and reschedule meetings
- Time-zone aware scheduling

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- Axios
- Deployed on Vercel

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon DB)
- Prisma ORM
- express-validator
- date-fns
- Deployed on Render

---

## 🧩 Backend API Endpoints

### Event Types
| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/event-types` | List all event types |
| GET | `/api/event-types/:id` | Get event type by ID |
| GET | `/api/event-types/slug/:slug` | Get event type by slug |
| POST | `/api/event-types` | Create event type |
| PUT | `/api/event-types/:id` | Update event type |
| DELETE | `/api/event-types/:id` | Delete event type |

### Availability
| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/availability` | Get all schedules |
| GET | `/api/availability/default` | Get default availability |
| POST | `/api/availability` | Create schedule |
| PUT | `/api/availability/:id` | Update schedule |
| POST | `/api/availability/:id/overrides` | Add date override |

### Bookings
| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/bookings/slots/:slug/:date` | Get available slots |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking details |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/reschedule` | Reschedule booking |

### Meetings
| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/meetings?filter=upcoming` | Get upcoming meetings |
| GET | `/api/meetings?filter=past` | Get past meetings |
| GET | `/api/meetings/counts` | Get meeting counts |
| PUT | `/api/meetings/:id/cancel` | Cancel meeting |

---

## 🗄️ Database Schema (High Level)

- `users`
- `event_types`
- `availabilities`
- `availability_rules`
- `date_overrides`
- `bookings`

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Update `.env` file with your Neon PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed
```

### 4. Start the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```
