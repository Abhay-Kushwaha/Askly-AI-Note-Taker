"use client"
import { BarLoader } from "react-spinners";
import { Suspense, useEffect, useState } from "react";

export default function Layout({ children }) {
  // make a fetch requesr /api/quiz to get the assessments
  const [assessments, setAssessments] = useState([]);
  useEffect(() => {
    const fetchAssessments = async () => {
      const response = await fetch("/api/quiz");
      const data = await response.json();
      setAssessments(data.assessments);
  };
  fetchAssessments();
  }, []);
  return (
    <div className="px-20">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Dashboard</h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
