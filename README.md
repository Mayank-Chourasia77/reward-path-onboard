# 💳 MaxxMai Card – Onboarding Application

A full-stack onboarding web application for MaxxMai Card, built using React, Tailwind CSS, Node.js (Express), Prisma, and NeonDB (PostgreSQL). It features a multi-step user onboarding process — from account creation to profile completion and consent approval — with all user data stored securely in a cloud database.

---

## 🚀 Features

- ✅ Phone + OTP based account creation (mocked flow)
- ✅ Email + password login (alternate path)
- ✅ Multi-step onboarding: Signup → Profile → Consent → Dashboard
- ✅ Profile form to collect personal and financial details
- ✅ Consent screen with checkbox agreement before completion
- ✅ Backend with Node.js + Express + TypeScript
- ✅ ORM via Prisma with Neon PostgreSQL
- ✅ Client-side validation, error states, and loading feedback
- ✅ LocalStorage used to pass minimal user context

---

## 🛠️ Tech Stack

| Layer      | Technology               |
|------------|---------------------------|
| Frontend   | React + Vite              |
| Styling    | Tailwind CSS              |
| Backend    | Node.js + Express + TypeScript |
| ORM        | Prisma                    |
| Database   | Neon PostgreSQL (Cloud)   |
| Auth       | Mocked OTP flow           |

---

## 🧭 Application Flow

1. **Login / Create Account**
   - Users can log in using email/password or sign up via phone number + OTP (OTP mocked).
   - Data is validated client-side.
   - Backend stores account in `User` table.

2. **Profile Form**
   - Collects: Full Name, Date of Birth, City, Income Range, and Bank.
   - Data is submitted to `/api/profile` and stored in the `Profile` table linked to the user.

3. **Consent Screen**
   - User must agree to Terms and Privacy Policy.
   - Navigation blocked until agreement is checked.

4. **Dashboard**
   - Confirmation screen after successful onboarding.
   - Can be extended to show personalized data from the database.

---

## 📦 Database Schema

Using Prisma ORM connected to Neon PostgreSQL.

### 🧑 `User` Table

| Field        | Type          |
|--------------|---------------|
| `id`         | String (UUID) |
| `email`      | String?       |
| `phone`      | String?       |
| `passwordHash` | String?     |

### 🧾 `Profile` Table

| Field                | Type          |
|---------------------|---------------|
| `id`                | String (UUID) |
| `userId`            | String (FK to User) |
| `fullName`          | String        |
| `dob`               | Date          |
| `city`              | String        |
| `incomeRangeMonthly`| String        |
| `primaryBank`       | String        |
| `consentAccepted`   | Boolean       |

---

## ⚙️ Setup Instructions (Local)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd maxxmaicard-app
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment

Create a `.env` file in `/backend`:

```env
DATABASE_URL="postgresql://<your-neon-connection-string>"
```

You can get this from your Neon dashboard > project > connection string.

---

### 4. Apply DB Migrations

```bash
cd backend
npx prisma migrate dev --name init
```

To preview data:

```bash
npx prisma studio
```

---

### 5. Run the App

#### Start Backend

```bash
cd backend
npx ts-node src/index.ts
# Server runs at http://localhost:4000
```

#### Start Frontend

```bash
cd frontend
npm run dev
# Opens http://localhost:3000
```

---

## 🧪 Testing the Flow

1. Go to `http://localhost:3000`
2. Click "Create Account" tab
3. Enter 10-digit phone number and any 6-digit OTP (mocked)
4. Fill out profile form
5. Agree to terms in Consent screen
6. Arrive at Dashboard

✅ Check Neon DB to verify new user and profile entries.

---

## 📂 Project Structure

```
├── backend
│   ├── src
│   │   ├── index.ts        # Express server
│   │   └── routes          # API endpoints
│   ├── prisma
│   │   └── schema.prisma   # DB schema
│   └── .env                # Environment config
└── frontend
    └── src
        ├── components
        ├── pages
        └── App.tsx / main.tsx
```

---

## 🎥 Demo Video

🎬 Record a short 3–5 minute video demonstrating:
- Account creation
- Profile submission
- Consent checkbox
- Dashboard
- Neon DB entries via Prisma Studio

(Optional) Upload to Loom or YouTube (unlisted) and share the link.

---


## 🙌 Notes

- OTP verification is mocked — any 6-digit code is accepted.
- Backend uses mock delay (`setTimeout`) to simulate network latency.
- Styling is minimal but clean — can be extended.
- Uses localStorage to persist user session state between steps.

