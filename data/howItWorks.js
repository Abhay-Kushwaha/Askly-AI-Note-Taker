import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Upload Your Notes",
    description: "Start by uploading any PDF—class notes, presentations, or study material.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Extract Key Information",
    description: "Askly analyzes the document and highlights important concepts instantly.",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Chat & Learn",
    description:
      "Use the AI chatbot to ask questions, clarify doubts, and dive deeper into the material.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Assess and Improve",
    description: "Take quizzes, get scores, and review weak areas with detailed explanations.",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
