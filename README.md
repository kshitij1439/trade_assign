# RateMyStore

A full-stack web application that allows users to submit ratings (1–5) for stores registered on the platform. Built with role-based access control for System Administrators, Store Owners, and Normal Users.

## Live Demo

- **Frontend:** [https://store-rate-two.vercel.app](https://store-rate-two.vercel.app)
- **Backend API:** [https://store-rate-ztov.onrender.com/api](https://store-rate-ztov.onrender.com/api)

> **Note:** Backend is hosted on Render's free tier — first request after inactivity may take ~30s to cold-start.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, TypeScript, Vite, Tailwind CSS, Shadcn UI |
| Backend   | Express.js, TypeScript, Prisma ORM  |
| Database  | PostgreSQL (Neon)                   |
| Auth      | JWT (JSON Web Tokens)               |
| Hosting   | Vercel (frontend), Render (backend) |

## Demo Accounts

All demo accounts use the password: **`Test@1234`**

### Admin
| Email                    | Role  |
|--------------------------|-------|
| admin@ratemystore.com    | ADMIN |

### Store Owners
| Email                    | Store Name                    |
|--------------------------|-------------------------------|
| rajesh@electronics.com   | Rajesh Electronics Megastore  |
| priya@fashionhub.com     | Priya Fashion Hub Boutique    |
| amit@freshmart.com       | FreshMart Grocery Superstore  |

### Normal Users
| Email              |
|--------------------|
| sneha@gmail.com    |
| vikram@gmail.com   |
| ananya@gmail.com   |
| rohan@gmail.com    |
| deepika@gmail.com  |

## Features by Role

### System Administrator
- Dashboard with total users, stores, and ratings count
- Add new stores, normal users, and admin users
- View/filter list of all users (Name, Email, Address, Role)
- View/filter list of all stores (Name, Email, Address, Rating)
- View user details (with store rating for Store Owners)
- Column sorting (ascending/descending) on all tables

### Normal User
- Sign up and log in
- View all registered stores with ratings
- Search stores by name and address
- Submit ratings (1–5) for any store
- Modify previously submitted ratings
- Update password

### Store Owner
- View dashboard with average rating and total ratings
- See list of users who rated their store
- Update password

## Form Validations

| Field    | Rules                                                     |
|----------|-----------------------------------------------------------|
| Name     | Minimum 20 characters, Maximum 60 characters              |
| Email    | Standard email format validation                          |
| Password | 8–16 characters, at least 1 uppercase, 1 special character |
| Address  | Maximum 400 characters                                    |

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database (or use [Neon](https://neon.tech) free tier)

### Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run database migrations
npx prisma migrate dev

# Seed demo data
npx ts-node prisma/seed.ts

# Start dev server
npm run dev
```

Backend runs at `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000/api
```

## Database Schema

```
User (id, name, email, password, address, role, createdAt, updatedAt)
  ├── role: ADMIN | NORMAL_USER | STORE_OWNER
  ├── has one Store (if STORE_OWNER)
  └── has many Ratings

Store (id, name, email, address, ownerId, createdAt, updatedAt)
  ├── belongs to User (owner)
  └── has many Ratings

Rating (id, value, userId, storeId, createdAt, updatedAt)
  ├── belongs to User
  ├── belongs to Store
  └── unique constraint on [userId, storeId]
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `PATCH /api/auth/password` — Update password (authenticated)

### Admin (requires ADMIN role)
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — List users (with filters & sorting)
- `GET /api/admin/users/:id` — User details
- `POST /api/admin/users` — Create user
- `GET /api/admin/stores` — List stores (with filters & sorting)
- `POST /api/admin/stores` — Create store

### Stores (requires NORMAL_USER role)
- `GET /api/stores` — List stores with user's rating

### Ratings (requires NORMAL_USER role)
- `POST /api/ratings` — Submit rating
- `PATCH /api/ratings/:id` — Update rating

### Store Owner (requires STORE_OWNER role)
- `GET /api/store-owner/dashboard` — Owner dashboard
