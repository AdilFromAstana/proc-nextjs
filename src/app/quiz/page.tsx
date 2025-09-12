"use client";

import { mockQuizList } from "@/mockQuiz";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";

type Props = {};

export default function QuizListPage({}: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateQuiz = () => {
    router.push("/quiz/create");
  };

  const handleQuizClick = (quizId: number) => {
    router.push(`/quiz/${quizId}`);
  };

  // Фильтрация тестов с поиском
  const filteredQuizzes = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockQuizList.entities.data;
    }

    const query = searchQuery.toLowerCase().trim();
    return mockQuizList.entities.data.filter(
      (quiz) =>
        quiz.name.toLowerCase().includes(query) ||
        (quiz.description && quiz.description.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="w-full m-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          База тестов и задач
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <button
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={handleCreateQuiz}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
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

export function SearchInput({ searchQuery, setSearchQuery }: SearchInputProps) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <input
        type="text"
        placeholder="Поиск по названию или описанию"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
      <svg
        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
