# TASTE TRACK 🍽️

A campus food review platform built exclusively for NIT Kurukshetra students. Search dishes across campus restaurants, read moderated reviews, rate what you eat on taste/price/cleanliness, and — for admins — manage restaurants, menus, and the review moderation queue.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Review Moderation Flow](#review-moderation-flow)
- [Design System](#design-system)
- [Assumptions & Things to Verify](#assumptions--things-to-verify)
- [Possible Improvements](#possible-improvements)
- [License](#license)

---

## Features

### For students
- **Roll-number login** — sign in with just your roll number; the app appends `@nitkkr.ac.in` for you
- **Email OTP verification** on registration, and an OTP-based **forgot password** flow
- **Search with autocomplete** — debounced, race-condition-safe suggestions as you type
- **Browse all restaurants** from the home page, or jump straight to search results
- **Per-dish ratings** broken down by Taste, Price, and Cleanliness, plus an overall score
- **Read every approved review** on a dish — comments, individual ratings, and reviewer name (or "Anonymous")
- **Write and edit reviews** via a star-rating form on each restaurant's menu page
- **My Reviews** — track every review you've written and its moderation status (Pending / Approved / Rejected)

### For admins
- Add restaurants and food items
- **Moderation queue** with Pending / Approved / Rejected tabs
- Approve, soft-reject, or permanently delete any review
- Only **approved** reviews count toward the public rating shown in search — pending and rejected reviews never affect what students see

---

## Tech Stack

**Frontend**
- React (functional components + hooks)
- React Router (`react-router-dom`)
- Axios (via a shared `utils/api.js` instance)
- `react-icons` (Fa icon set)
- `jwt-decode` (client-side role check for nav/admin gating)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- `bcrypt` for password hashing
- `jsonwebtoken` for auth (7-day tokens, `{ userId, role }` payload)
- `nodemailer` (Gmail transport) for OTP delivery

---

## Project Structure

This layout is **inferred** from import paths seen throughout the codebase (e.g. `../utils/api`, `../models/User`) — confirm against your actual repo and adjust as needed.
```
project-root/
├── frontend/
│   └── src/
│       ├── assets/                  # (confirm this isn't meant to be "assets")
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── AdminRoute.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── Results.jsx
│       │   ├── RestaurantDetails.jsx
│       │   ├── MyReviews.jsx
│       │   └── AdminDashboard.jsx
│       ├── utils/
│       │   └── api.js
│       ├── App.jsx
│       └── config.js
└── backend/
    ├── controllers/
    │   ├── authController.js        # register, forgot/reset password
    │   ├── loginController.js       # login
    │   ├── verifyOtpController.js   # OTP verification (registration)
    │   ├── restaurantController.js
    │   ├── foodItemController.js
    │   ├── reviewController.js
    │   └── resultsController.js
    ├── models/
    │   ├── User.js
    │   ├── Restaurant.js
    │   ├── FoodItem.js
    │   └── Review.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── restaurantRoutes.js
    │   ├── foodItemRoutes.js
    │   ├── reviewRoutes.js
    │   └── resultsRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js        # verifies JWT / attaches req.user
    │   └── adminMiddleware.js       # gates admin-only routes by role
    ├── utils/
    │   ├── otpGenerator.js
    │   └── cronJobs.js              # scheduled task — see note below
    └── config.js
```
---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- A MongoDB instance (local or Atlas)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for sending OTP emails (if 2FA is enabled, which it should be)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd <project-root>

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running locally

```bash
# From /server
npm run dev      # or: node server.js / nodemon server.js

# From /client, in a separate terminal
npm start         # or: npm run dev, depending on your bundler
```

---

## Environment Variables

Backend `.env` (adjust names to match what `config.js` actually reads):

| Variable      | Description                                      |
|---------------|---------------------------------------------------|
| `MONGO_URI`   | MongoDB connection string                         |
| `JWT_SECRET`  | Secret used to sign/verify JWTs                   |
| `EMAIL_USER`  | Gmail address used to send OTP emails             |
| `EMAIL_PASS`  | Gmail App Password (not your regular password)    |
| `PORT`        | Port the Express server listens on (e.g. `5000`)  |

Frontend: check `utils/api.js` for whether it expects an API base URL from an env var (e.g. `VITE_API_URL` or `REACT_APP_API_URL`) or has one hardcoded.

---

## API Reference

All endpoints are prefixed with your API base URL (e.g. `http://localhost:5000/api`).

### Auth (`/auth`)

| Method | Endpoint                       | Auth | Body                                  | Description                                      |
|--------|---------------------------------|------|----------------------------------------|---------------------------------------------------|
| POST   | `/auth/register`               | —    | `{ name, email, password }`            | Creates/updates an unverified user, emails an OTP |
| POST   | `/auth/verify-otp`             | —    | `{ email, otp }`                       | Verifies OTP, marks account verified, returns JWT |
| POST   | `/auth/login`                  | —    | `{ email, password }`                  | Returns a JWT on success                          |
| POST   | `/auth/forgot-password`        | —    | `{ email }`                            | Emails a password-reset OTP                       |
| POST   | `/auth/reset-password`         | —    | `{ email, otp, newPassword }`          | Verifies OTP and updates the password             |

### Restaurants (`/restaurants`)

| Method | Endpoint         | Auth  | Body                                          | Description               |
|--------|-------------------|-------|-------------------------------------------------|----------------------------|
| GET    | `/restaurants`    | —     | —                                                | List all restaurants       |
| POST   | `/restaurants`    | Admin | `{ name, address, contactInfo, imageUrl }`      | Add a restaurant           |

### Food Items (`/food-items`)

| Method | Endpoint              | Auth  | Body                                                     | Description                                  |
|--------|------------------------|-------|-------------------------------------------------------------|------------------------------------------------|
| POST   | `/food-items`         | Admin | `{ restaurantId, name, description, price }`               | Add a food item to a restaurant                |
| GET    | `/food-items/:id`     | —     | —                                                             | Get a restaurant + its menu (`:id` = restaurant ID) |

### Reviews (`/reviews`)

| Method | Endpoint                          | Auth  | Body / Query                                                          | Description                                    |
|--------|-------------------------------------|-------|---------------------------------------------------------------------------|--------------------------------------------------|
| POST   | `/reviews`                         | User  | `{ itemId, tasteRating, priceRating, cleanlinessRating, comment }`        | Create or update your review for a food item     |
| GET    | `/reviews/my-review/:itemId`       | User  | —                                                                           | Check if you've already reviewed this item        |
| GET    | `/reviews`                         | User  | —                                                                           | All of *your* reviews, `{ reviews: [...] }`       |
| GET    | `/reviews/admin/queue`             | Admin | `?status=pending\|approved\|rejected`                                      | Reviews in a given moderation state               |
| PUT    | `/reviews/:id/approve`             | Admin | —                                                                           | Approve a review                                  |
| PUT    | `/reviews/:id/reject`              | Admin | —                                                                           | Soft-reject (hide, don't delete) a review         |
| DELETE | `/reviews/:id`                     | Admin | —                                                                           | Permanently delete a review                       |

### Search (`/results`)

| Method | Endpoint                | Auth | Query      | Description                                                                 |
|--------|---------------------------|------|-------------|---------------------------------------------------------------------------------|
| GET    | `/results`                | —    | `?q=`       | Search food items; returns each with avg ratings and its **approved** reviews  |
| GET    | `/results/suggestions`    | —    | `?q=`       | Autocomplete suggestions — array of matching food item names                    |

---

## Data Models

**User**
```
name, email (unique, must end in @nitkkr.ac.in), passwordHash,
role ('user' | 'admin', default 'user'), isVerified,
otp, otpExpires, timestamps
```

**Restaurant**
```
name, address, contactInfo, imageUrl
```

**FoodItem**
```
name, description, price, restaurantId (ref Restaurant)
```

**Review**
```
itemId (ref FoodItem), restaurantId (ref Restaurant), userId (ref User),
tasteRating, priceRating, cleanlinessRating (1–5 each),
comment, isAnonymous, status ('pending' | 'approved' | 'rejected'), timestamps
```
A unique compound index on `(itemId, userId)` means each user can only have one review per food item — submitting again updates the existing one rather than creating a duplicate.

---

## Review Moderation Flow

1. A student submits a review → saved with `status: 'pending'`.
2. It appears in the admin's **Pending** queue.
3. Admin **approves**, **rejects**, or **permanently deletes** it.
4. Only reviews with `status: 'approved'` are included in the `/results` aggregation — they're the only ones that affect a dish's public average rating or appear in its review list.

---

## Design System

The UI follows a consistent "campus order-ticket" visual language across every page:

- **Palette**: kraft-paper background, near-black ink text, mustard-gold accent — green/amber/red reserved for success/warning/danger states (rating chips, status badges)
- **Type**: Archivo Black for headings, Inter for body text, IBM Plex Mono for labels, counts, and ratings
- **Motif**: cards styled like order tickets — dashed dividers, punch-hole details, hard offset shadows instead of soft blurs

Fonts are loaded via a Google Fonts `@import` in each page's inline styles. If your deployment has a strict CSP blocking external font loading, everything falls back to system fonts gracefully.

---

## Assumptions & Things to Verify

Since this README was written from code shared across a conversation rather than the full repo, double-check:

- [ ] Exact env var names read by `config.js`
- [ ] Whether `GET /restaurants` and `GET /results*` are actually public (no `authMiddleware`) — the frontend assumes they are
- [ ] Whether `utils/api.js` attaches the JWT automatically (e.g. an axios request interceptor reading `localStorage.getItem('token')`) — every authenticated call in the frontend assumes this happens somewhere
- [ ] Whether `AdminRoute.jsx` checks the JWT's `role` claim specifically, not just whether a token exists
- [ ] Actual folder structure, if it differs from the layout above

---

## Possible Improvements

- Reviews currently default to non-anonymous — there's no UI toggle in the review form for a student to mark a review anonymous, even though the model and admin dashboard both support `isAnonymous`
- Rate limiting on `/auth/forgot-password` and `/auth/register` (OTP request spam)
- Pagination on `/results` and the admin moderation queue for larger datasets
- A dedicated "About" or "Contact" page, since the footer links there are currently placeholders pointing at existing routes only

---

## License

Not yet specified — add a `LICENSE` file and update this section (MIT is a common default for student projects).
