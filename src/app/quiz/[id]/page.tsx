"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizDetailResponse } from "@/types/quiz/quiz";
import { fetchQuizById } from "@/api/quiz";
import QuizEditor from "@/components/Quiz/QuizEditor";
import { useTranslations } from "next-intl";

export default function QuizItemPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizById(Number(params.id));
      setQuizData(response);
      setError(null);
    } catch (err) {
      setError("Не удалось загрузить тест");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [params.id]);

  const handleUpdateQuiz = (updatedQuiz: QuizDetailResponse) => {
    setQuizData(updatedQuiz);
  };

  const handleClose = () => {
    router.push("/quiz");
  };

  if (loading) {
    return (
      <div className="w-full m-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">{t("label-upload")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full m-8">
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <QuizEditor
      quiz={quizData}
      quizId={Number(params.id)}
      onUpdateQuiz={handleUpdateQuiz}
      onClose={handleClose}
    />
  );
}
