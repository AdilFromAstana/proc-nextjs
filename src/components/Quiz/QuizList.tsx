"use client";

import { fetchQuizList } from "@/api/quiz";
import { QuizItem } from "@/types/quiz/quiz";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";

export default function QuizList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetchQuizList({ page: 1 });
        setQuizzes(response.entities.data);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить список тестов");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const handleCreateQuiz = () => {
    router.push("/quiz/create");
  };

  const handleQuizClick = (quizId: number) => {
    router.push(`/quiz/${quizId}`);
  };

  // Фильтрация тестов с поиском
  const filteredQuizzes = useMemo(() => {
    if (!searchQuery.trim()) {
      return quizzes;
    }

    const query = searchQuery.toLowerCase().trim();
    return quizzes.filter(
      (quiz) =>
        quiz.name.toLowerCase().includes(query) ||
        (quiz.description && quiz.description.toLowerCase().includes(query))
    );
  }, [searchQuery, quizzes]);

  if (loading) {
    return (
      <div className="w-full m-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Загрузка тестов...</p>
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
    <div className="w-full m-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          База тестов и задач
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-shrink-0">
          <button
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={handleCreateQuiz}
          >
            Создать
          </button>
        </div>

        <div className="flex-1 flex flex-wrap gap-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? "По вашему запросу ничего не найдено" : "Нет тестов"}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => handleQuizClick(quiz.id)}
              className="bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer rounded-lg"
            >
              <div className="flex items-start">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg"
                  style={{
                    backgroundColor: quiz.color ? `#${quiz.color}` : "#6b7280",
                  }}
                >
                  {quiz.image ? (
                    <img
                      src={quiz.image}
                      alt={quiz.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    quiz.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {quiz.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 truncate">
                    {quiz.description || "Нет описания"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function SearchInput({ searchQuery, setSearchQuery }: SearchInputProps) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <input
        type="text"
        placeholder="Поиск по названию или описанию"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md"
      />
    </div>
  );
}
