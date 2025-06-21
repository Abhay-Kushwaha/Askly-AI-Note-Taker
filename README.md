# 🧠 AI Career Coach – Personalized Job Guidance App

A modern, AI-powered career coaching platform built using cutting-edge technologies like **Next.js**, **Neon DB**, **Tailwind CSS**, **Prisma**, **Inngest**, **ShadCN UI**, and **Generative AI**.

> Empower your career journey with intelligent guidance and sleek UI — blazing fast, scalable, and beautiful. 🚀🔥

---

## 🛠️ Tech Stack

| Layer       | Technologies                                                                 |
|-------------|-------------------------------------------------------------------------------|
| **Frontend**| Next.js 15, React 19, Tailwind CSS 3.4, ShadCN UI, Radix UI, Lucide Icons     |
| **Backend** | Next.js API Routes, Prisma ORM, Inngest (for background jobs/workflows)      |
| **Database**| Neon DB (PostgreSQL)                                                         |
| **AI/ML**   | Google Generative AI (`@google/generative-ai`)                               |
| **Auth**    | Clerk.dev (`@clerk/nextjs`)                                                  |
| **Forms**   | React Hook Form + Zod + @hookform/resolvers                                  |
| **UI/UX**   | ShadCN, Radix UI, Tailwind Merge, Tailwind CSS Animations                    |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ai-career-coach.git
cd ai-career-coach
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file and add:

```env
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GOOGLE_API_KEY=your_google_gen_ai_key
```

### 4. Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

---

## ✨ Features

- 🔐 Auth with Clerk.dev
- 🤖 AI Resume & Career Advice Generator (Google Generative AI)
- 🧩 Dynamic UI with ShadCN and Radix UI
- 📈 Interactive analytics (Recharts)
- 🗂️ Markdown resume editor (`@uiw/react-md-editor`)
- 📅 PDF export support (`html2pdf.js`)
- 🧪 Form validation with Zod
- 🧵 Background jobs and workflows with Inngest

---

## 🧪 Scripts

| Script         | Description                     |
|----------------|---------------------------------|
| `dev`          | Run the dev server (Turbo)      |
| `build`        | Build for production            |
| `start`        | Start production server         |
| `lint`         | Lint the codebase               |
| `postinstall`  | Run `prisma generate`           |

---

