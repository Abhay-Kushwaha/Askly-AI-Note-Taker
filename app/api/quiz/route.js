import { generateQuiz, saveQuizResult, getAssessments } from "@/actions/quiz"; // adjust path as needed

export async function GET(req) {
  // Fetch assessments
  console.log("Fetching assessments...", {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "GEMINI_API_KEY is set" : "GEMINI_API_KEY is not set",
    DATABASE_URL: process.env.DATABASE_URL ? "DATABASE_URL is set" : "DATABASE_URL is not set",
  });

  try {
    const assessments = await getAssessments();
    return Response.json({ assessments });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  // Generate quiz or save quiz result based on body
  const body = await req.json();


  if (body.action === "generateQuiz") {
    try {
      const questions = await generateQuiz();
      return Response.json({ questions });
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (body.action === "saveQuizResult") {
    const { questions, answers, score } = body;
    try {
      const result = await saveQuizResult(questions, answers, score);
      return Response.json({ result });
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
