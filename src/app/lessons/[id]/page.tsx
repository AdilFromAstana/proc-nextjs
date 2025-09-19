"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchLessonById } from "@/api/lessons/listApi";
import LessonItemComponent from "@/components/Lessons/LessonItemComponent";
import { LessonDetailResponse } from "@/types/lessons/lessonQuestions";

export default function LessonItemPage() {
  const params = useParams();
  const [lessonData, setLessonData] = useState<LessonDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("params: ", params);
    const loadLesson = async () => {
      try {
        setLoading(true);
        const response = await fetchLessonById(Number(params.id));
        setLessonData(response);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить тест");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadLesson();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full m-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Загрузка теста...</p>
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

  return <LessonItemComponent lesson={lessonData} />;
}
