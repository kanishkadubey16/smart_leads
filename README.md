# Smart Leads

Smart Leads is a modern, production-grade SaaS CRM pipeline manager. Built with a full MERN stack (MongoDB, Express, React, Node.js), it provides robust Role-Based Access Control (RBAC) allowing both Admins and Sales Users to manage leads seamlessly from a unified, internship-ready UI.

## Features
- **Shared Dashboard Architecture**: A beautiful, minimal SaaS-style UI shared identically between Admins and Sales Users. Restricted actions (like Lead Deletion or CSV Export) are safely hidden for Sales Users while maintaining UI integrity.
- **Advanced Backend Search & Filtering**: Complex query builder supporting regex search, enum-based status/source filtering, and chronological sorting.
- **Robust Pagination**: Full backend-driven pagination optimized for scale.
- **Secure Authentication**: JWT-based stateless authentication with `bcrypt` password hashing.
- **Validation Everywhere**: End-to-end `zod` validation on both the frontend inputs and backend API routes.
- **Dynamic Stats Engine**: MongoDB aggregation pipeline resolving dynamic high-level statistics cards in real-time.

## Tech Stack
**Frontend:** React 18, TypeScript, TailwindCSS, React Router DOM, Axios, React Hook Form, Zod, Lucide React.
**Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JSONWebToken, express-async-handler, json2csv.

## Project Structure
```text
Smart_Leads/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI elements (Navbar, StatsCard, Modals)
│   │   ├── context/         # React Contexts
│   │   ├── hooks/           # useAuth hook for global state
│   │   ├── layouts/         # ProtectedLayout, AuthLayout
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── services/        # Axios interceptors and API wrappers
│   │   ├── types/           # Shared TypeScript interfaces
│   │   └── utils/           # Date formatting
│   └── Dockerfile           # Multi-stage Vite to NGINX build
│
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Connection
│   │   ├── controllers/     # Express Request/Response orchestration
│   │   ├── interfaces/      # Mongoose interfaces
│   │   ├── middlewares/     # JWT, RBAC, Validation, centralized error handling
│   │   ├── models/          # User and Lead Mongoose schemas
│   │   ├── routes/          # Express Routers
│   │   ├── scripts/         # DB Seed scripts
│   │   ├── services/        # Mongoose query logic & business logic
│   │   ├── types/           # Enums
│   │   ├── utils/           # Response wrapper & AppError
│   │   └── validators/      # Zod backend schemas
│   └── Dockerfile           # Node.js Alpine build
│
└── docker-compose.yml       # Full-stack orchestration
```

## Local Development Setup

### 1. Environment Variables
Create a `.env` file in the `backend/` directory:


### 2. Backend Initialization
```bash
cd backend
npm install
npm run dev
```
*The backend will automatically compile TypeScript and run on `http://localhost:8080` using `ts-node-dev`.*

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start a Vite dev server on `http://localhost:5173`.*

### 4. Database Seeding (Optional)
To quickly populate the database with a test Admin user and 20 mock leads:
```bash
cd backend
npx ts-node src/scripts/seed.ts
```
*Login details for the seeded admin:*
**Email**: `sarah@smartleads.app`
**Password**: `password`

## Docker Deployment
To run the entire application via Docker Containers:
```bash
# Make sure to set your .env variables or pass them to docker-compose
docker-compose up --build -d
```
* The frontend will be served at `http://localhost:80`
* The backend API will be running at `http://localhost:8080`

## API Routes Overview

**Authentication:**
- `POST /api/auth/register` - Create new user (Sales or Admin)
- `POST /api/auth/login` - Authenticate & return JWT
- `GET /api/auth/me` - Get current user profile (Protected)

**Leads:**
- `GET /api/leads` - Fetch paginated, filtered, sorted leads & dashboard stats (Protected)
- `POST /api/leads` - Create new lead (Protected)
- `PUT /api/leads/:id` - Update existing lead (Protected)
- `DELETE /api/leads/:id` - Delete lead (Protected, **Admin Only**)
- `GET /api/leads/export/csv` - Export filtered leads to CSV (Protected, **Admin Only**)
