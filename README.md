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

## 🔑 Test Credentials & Multi-Module Access

For easy review, the database is seeded with default test accounts, and a special admin whitelist is enabled to let specific reviewer accounts bypass boundaries and access **both** the Patient and Doctor modules.

### 1. Dual-Role (Patient & Doctor) Admin Whitelist
Any account registered or logged in with the following emails can access **both** patient and doctor modules. When logged in under these emails, a dynamic sidebar navigation link allows you to switch between portals instantly:
* **Whitelisted Emails**:
  * `anne.liangco@whitecloak.com`
  * `donn.gamboa@whitecloak.com`
  * `miguel.fermin@whitecloak.com`
  * `thea.juego@whitecloak.com`
  * `cherubim.citco@whitecloak.com`
* **Default Password**: `Password123` (or any custom password chosen during registration)

### 2. Standard Seeded Patient Accounts
* **Email**: `patient@agapay.com`
* **Password**: `Password123`
* **Role**: Patient

### 3. Standard Seeded Doctor Accounts
* **Password**: `Password123` (all doctors)
* **Cardiology**: `elena.santos@agapay.com`
* **Pediatrics**: `sofia.chen@agapay.com`
* **Dermatology**: `marco.rivera@agapay.com`
* **Neurology**: `julian.reyes@agapay.com`
* **Pulmonology**: `arthur.cruz@agapay.com`
* **Psychiatry**: `teresa.gomez@agapay.com`

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
