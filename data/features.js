import { BrainCircuit, Briefcase, LineChart, ScrollText } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered PDF Analysis",
    description:
      "Extract key insights and important points from your uploaded notes instantly using intelligent algorithms.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interactive Q&A Chatbot",
    description:
      "Ask questions directly from your notes and get instant, context-aware answers powered by AI.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Personalized Quiz Assessments",
    description:
      "Test your understanding with auto-generated quizzes and receive scores based on your performance.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Feedback & Explanations",
    description:
      "Identify weak areas with targeted feedback and detailed explanations to improve your knowledge.",
  },
];
