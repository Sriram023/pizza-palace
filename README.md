# 🍕 Pizza Palace — MERN Stack

A production-ready online pizza ordering platform built as a student final project.

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router + axios + react-hot-toast
- **Backend:** Node.js + Express 4 + MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **Theme:** warm red / orange, Inter font, responsive mobile-first

> ⚠️ This project does NOT run inside the Lovable preview tab (Lovable runs on a Cloudflare Worker which can't host Express / MongoDB). Run it locally as described below.

## 📁 Project structure

```
pizza-palace/
├── server/   ← Express + MongoDB REST API   (port 5000)
└── client/   ← React + Vite frontend         (port 5173)
```

## ✅ Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - Local MongoDB (`mongodb://127.0.0.1:27017`), or
  - A free MongoDB Atlas cluster (`mongodb+srv://...`)

## 🚀 Quick start

### 1. Backend

```bash
cd server
cp .env.example .env       # then edit .env — fill MONGO_URI and JWT_SECRET
npm install
npm run seed               # creates 10 pizzas + admin + demo customer
npm run dev                # http://localhost:5000
```

### 2. Frontend (new terminal)

```bash
cd client
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

Open <http://localhost:5173> 🍕

## 👤 Demo accounts (created by `npm run seed`)

| Role     | Email                       | Password      |
|----------|-----------------------------|---------------|
| Admin    | `admin@pizzapalace.test`    | `Admin@12345` |
| Customer | `demo@pizzapalace.test`     | `Demo@12345`  |

## 🛡️ Promoting a user to admin (manual, via MongoDB)

After someone registers normally, promote them with a one-liner:

```bash
# in mongosh
use pizza_palace
db.users.updateOne({ email: "their@email.com" }, { $set: { role: "admin" } })
```

They must log out and log back in for the new JWT to carry the admin role.

## 🔑 Environment variables

`server/.env`
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pizza_palace
JWT_SECRET=replace_me_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

`client/.env`
```
VITE_API_URL=http://localhost:5000/api
```

## 📡 REST API reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Route               | Auth | Body                            |
|--------|---------------------|------|---------------------------------|
| POST   | `/auth/register`    | —    | `{ name, email, password }`     |
| POST   | `/auth/login`       | —    | `{ email, password }`           |
| GET    | `/auth/profile`     | user | —                               |
| PUT    | `/auth/profile`     | user | `{ name?, email? }`             |

### Pizzas
| Method | Route             | Auth  | Notes                                                  |
|--------|-------------------|-------|--------------------------------------------------------|
| GET    | `/pizzas`         | —     | Query: `search`, `category`, `available`               |
| GET    | `/pizzas/:id`     | —     |                                                        |
| POST   | `/pizzas`         | admin | `{ name, description, price, category, imageUrl, isAvailable? }` |
| PUT    | `/pizzas/:id`     | admin | partial update                                         |
| DELETE | `/pizzas/:id`     | admin |                                                        |

### Orders
| Method | Route                    | Auth  | Body                                              |
|--------|--------------------------|-------|---------------------------------------------------|
| POST   | `/orders`                | user  | `{ items:[{pizza, size, qty}], deliveryAddress }` |
| GET    | `/orders/my`             | user  | own orders                                        |
| GET    | `/orders`                | admin | all orders                                        |
| PUT    | `/orders/:id/status`     | admin | `{ status }`                                      |
| DELETE | `/orders/:id`            | admin |                                                   |

Order statuses: `Pending → Confirmed → Preparing → Out for Delivery → Delivered` (plus `Cancelled`).

## 🧱 Data models

- **User**: `name, email, passwordHash, role ('customer'|'admin'), timestamps`
- **Pizza**: `name, description, price, category ('Veg'|'Non-Veg'|'Specialty'), imageUrl, isAvailable, timestamps`
- **Order**: `customerId → User, items[{pizza, name, size, qty, priceAtOrder}], totalAmount, status, deliveryAddress{...}, timestamps`

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT (7-day expiry) sent as `Authorization: Bearer <token>`
- `auth` middleware verifies JWT, `admin` middleware checks role
- `helmet` for secure HTTP headers
- `cors` restricted to `CLIENT_URL`
- `express-rate-limit` on `/api/auth/*` (50 reqs / 15 min)
- All mutating routes validated with `express-validator`
- Order totals are **recomputed on the server** — client prices are never trusted
- Secrets live in `.env`, never in code

## ✨ Features delivered

- Hero landing page with featured pizzas, categories, "why us", testimonials, footer
- Menu with search + category chips + availability filter, skeleton loaders, empty states
- Pizza detail page with size selector (Small/Medium/Large) and quantity stepper
- Cart persisted in `localStorage`, qty edit, remove, live totals (subtotal + 5% tax + ₹40 delivery)
- Checkout form with validation and success confirmation
- Register / Login with JWT, secure logout
- Customer "My Orders" page with status badges and timestamps
- Admin dashboard with revenue / orders-today / pending / pizzas KPIs
- Admin pizza CRUD with availability toggle (instant update)
- Admin order management with status dropdown and filter chips
- Role-based protected routes (`ProtectedRoute`, `AdminRoute`)
- Responsive mobile/tablet/desktop, toast notifications, accessible labels

## 🧪 Suggested demo flow (for your presentation)

1. Open `/` — show the hero, featured pizzas, categories, testimonials
2. Open `/menu` — search "paneer", switch category to Non-Veg, toggle availability filter
3. Click a pizza → choose Large → quantity 2 → Add to cart
4. Open `/cart` → adjust qty → Checkout
5. Sign in as the demo customer → fill address → Place order → success screen
6. Open `/orders` to see the new order with `Pending` status
7. Log out, log in as **admin** → `/admin` for KPIs
8. `/admin/pizzas` → edit a pizza, toggle availability
9. `/admin/orders` → change the order's status to `Out for Delivery` → switch back to customer to see live status update

## 🗒️ Notes for your report

- Folder structure follows the typical MVC pattern: `models/`, `controllers/`, `routes/`, `middleware/`
- Frontend uses Context API for auth + cart — no Redux, easy to explain in an interview
- Server-side price recomputation is the kind of detail examiners love — be ready to talk about it
- `seed.js` is intentionally idempotent so you can reseed safely before the demo

Happy slicing! 🍕