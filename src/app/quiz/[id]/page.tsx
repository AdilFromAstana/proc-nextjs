// app/quiz/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import CreateQuizComponent from "@/components/Quiz/CreateQuizComponent";
import { mockQuizData } from "@/mockQuiz";
import { ApiQuizResponse } from "@/types/quizQuestion";

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const [quizData, setQuizData] = useState<ApiQuizResponse | null>(null);

  useEffect(() => {
    // Ищем тест в массиве mockQuizData по ID
    const foundQuiz = mockQuizData.find(
      (quiz) => quiz.entity.id === parseInt(params.id)
    );

    if (foundQuiz) {
      // Используем type assertion для преобразования типов
      setQuizData(foundQuiz as unknown as ApiQuizResponse);
    }
  }, [params.id]);

  if (!quizData) {
    return <div className="w-full m-8">Тест не найден</div>;
  }

  return (
    <div className="w-full m-8">
      <CreateQuizComponent initialQuiz={quizData} isEditing={true} />
    </div>
  );
}
