# Calendlify Backend

A Node.js/Express.js backend API for Calendlify - a Calendly clone scheduling application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Validation**: express-validator
- **Date Handling**: date-fns

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

## API Endpoints

### Event Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/event-types` | List all event types |
| GET | `/api/event-types/:id` | Get event type by ID |
| GET | `/api/event-types/slug/:slug` | Get event type by slug |
| POST | `/api/event-types` | Create event type |
| PUT | `/api/event-types/:id` | Update event type |
| DELETE | `/api/event-types/:id` | Delete event type |

### Availability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability` | Get all schedules |
| GET | `/api/availability/default` | Get default availability |
| POST | `/api/availability` | Create schedule |
| PUT | `/api/availability/:id` | Update schedule |
| POST | `/api/availability/:id/overrides` | Add date override |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/slots/:slug/:date` | Get available slots |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking details |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/reschedule` | Reschedule booking |

### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meetings?filter=upcoming` | Get upcoming meetings |
| GET | `/api/meetings?filter=past` | Get past meetings |
| GET | `/api/meetings/counts` | Get meeting counts |
| PUT | `/api/meetings/:id/cancel` | Cancel meeting |

## Database Schema

The application uses the following tables:
- `users` - Default user (no auth required)
- `event_types` - Event types with name, duration, slug
- `availabilities` - Availability schedules
- `availability_rules` - Weekly rules (day/time)
- `date_overrides` - Date-specific overrides
- `bookings` - Scheduled meetings

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js          # Sample data seeder
├── src/
│   ├── config/
│   │   └── database.js  # Prisma client
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Validation & error handling
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── app.js           # Express app entry point
└── .env                 # Environment variables
```
