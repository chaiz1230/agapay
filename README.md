# Agapay Telehealth Platform

Agapay is a modern full-stack telehealth MVP built for the Philippine healthcare system. It provides a seamless portal for patients to book consultations, consult specialized doctors, review medical history, and access health resources.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide React Icons
* **Backend**: Next.js Server Actions and Route Handlers
* **Database**: PostgreSQL with Prisma ORM
* **Authentication**: NextAuth.js v5 (Credentials Provider)

---

## 📖 System Documentation

For the latest full summary of the frontend, backend, database, architecture, and dependencies, see [docs/implementation-2026-05-27.md](docs/implementation-2026-05-27.md).

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Create a `.env` file in the root folder:
```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db_name>"
NEXTAUTH_SECRET="your-jwt-secret-key"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Sync Database & Run Seeds
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
