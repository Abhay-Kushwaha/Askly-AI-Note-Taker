import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { analyzePerformance } from "@/lib/utils";

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId, answers } = await req.json();
  const quiz = await db.quiz.findUnique({ where: { id: quizId } });

  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const score = analyzePerformance(quiz.questions, answers);
  const analysis = `You scored ${score}. Focus on topics you got wrong.`;

  const feedback = await db.feedback.create({
    data: { userId, quizId, analysis },
  });

  await db.quiz.update({
    where: { id: quizId },
    data: { score, answers },
  });

  return NextResponse.json({ score, analysis });
}

export async function GET(req) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const feedbacks = await db.feedback.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(feedbacks);
}