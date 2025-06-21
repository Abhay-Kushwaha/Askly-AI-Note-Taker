# 🤖 Askly – AI-Powered Learning Companion
An intelligent learning assistant that helps students understand notes, ask questions, generate quizzes, and even build resumes & cover letters. Built using modern frameworks like **Next.js**, **Tailwind CSS**, **Prisma**, **Neon DB**, **ShadCN UI**, and **Generative AI** for a seamless, powerful academic experience.
> Transform the way you study – summarize PDFs, chat with your notes, assess your learning, and prepare for your future. 🚀📖

## 🛠️ Tech Stack
| Layer       | Technologies                                                                 |
|-------------|-------------------------------------------------------------------------------|
| **Frontend**| Next.js 15, React 19, Tailwind CSS 3.4, ShadCN UI, Radix UI, Lucide Icons     |
| **Backend** | Next.js API Routes, Prisma ORM, Inngest (background jobs/workflows)           |
| **Database**| Neon DB (PostgreSQL)                                                          |
| **AI/ML**   | Google Generative AI (`@google/generative-ai`)                                |
| **Auth**    | Clerk.dev (`@clerk/nextjs`)                                                   |
| **Forms**   | React Hook Form + Zod + @hookform/resolvers                                   |
| **UI/UX**   | ShadCN, Radix UI, Tailwind Merge, Tailwind Animations

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Abhay-Kushwaha/Askly-AI-Note-Taker
cd askly
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file and add:
```env
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GOOGLE_API_KEY=your_google_gen_ai_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 4. Setup Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the development server
```bash
npm run dev
```

## ✨ Features
- 🔐 Secure authentication via Clerk.dev
- 📄 Upload PDFs and extract summarized notes
- 🤖 Ask questions using an AI-powered chatbot
- 🧠 Generate interactive quizzes from your notes
- 📈 Get performance feedback and track weak points
- 📝 Create ATS-optimized resumes and cover letters
- 📄 Download content summaries and results as PDF
- 🧪 Form validation powered by Zod
- 🧵 Background workflows powered by Inngest

## 🧪 Scripts
| Script         | Description                     |
|----------------|---------------------------------|
| `dev`          | Run the dev server (Turbo)      |
| `build`        | Build for production            |
| `start`        | Start production server         |
| `lint`         | Lint the codebase               |
| `postinstall`  | Run