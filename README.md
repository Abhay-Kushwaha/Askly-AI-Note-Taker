# 🤖 Askly – AI-Powered Learning Companion
An intelligent learning assistant that helps students understand notes, ask questions, generate quizzes, and even build resumes & cover letters. Built using modern frameworks like **Next.js**, **Tailwind CSS**, **Drizzle ORM**, **Neon DB**, **ShadCN UI**, and **Generative AI** for a seamless, powerful academic experience.
> Transform the way you study – summarize PDFs, chat with your notes, assess your learning, and prepare for your future. 🚀

## 🛠️ Tech Stack
| Layer           | Technologies & Frameworks                                                                                 |
|----------------|------------------------------------------------------------------------------------------------------------|
| **Frontend**   | **Next.js** – React framework for SSR/SSG & routing <br>**TypeScript** – Typed JavaScript <br>**Tailwind CSS** – Utility-first CSS <br>**ShadCN UI** – Accessible UI components <br>**Radix UI** – Primitives for building UI <br>**Lucide Icons** – Icon library <br>**tailwind-merge** – Utility for merging Tailwind classes |
| **Backend**    | **Next.js API Routes** – Serverless backend <br>**Drizzle ORM** – Type-safe SQL ORM <br>**Drizzle-kit** – Drizzle migration tool <br>**Drizzle-orm/neon-http** – Drizzle adapter for Neon <br>**Axios** – Promise-based HTTP client |
| **Database**   | **Neon Database Serverless** – Serverless PostgreSQL <br>**PostgreSQL** – Relational database <br>**Pinecone** – Vector database for AI/semantic search |
| **AI/ML**      | **OpenAI API** – Generative AI <br>**OpenAI Edge** – Edge-optimized OpenAI API <br>**Google Generative AI** – Google’s AI models |
| **Auth**       | **Clerk** / **@clerk/nextjs** – Authentication & user management |
| **Cloud/Infra**| **AWS SDK** – AWS cloud services integration |

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Abhay-Kushwaha/Askly-AI-Note-Taker
cd Askly-AI-Note-Taker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file and add:
```env
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>
GOOGLE_API_KEY=<your_google_gen_ai_key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_S3_ACCESS_KEY_ID=<your_s3_access_key_id>
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=<your_s3_secret_access_key>
NEXT_PUBLIC_S3_BUCKET_NAME=<your_s3_bucket_name>
NEXT_PUBLIC_S3_REGION=<your_s3_region>
PINECONE_ENVIRONMENT=<your_pinecone_environment>
PINECONE_API_KEY=<your_pinecone_api_key>
```

### 4. Run the development server
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