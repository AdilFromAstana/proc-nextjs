"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { fetchAssignmentDetailProctoring } from "@/api/assignmentDetail";
import { AssignmentEntity } from "@/types/assignment/detail";
import { QuizDetailEntity } from "@/types/quiz/quiz";
import { finishAssignment, sendAnswer } from "@/api/quiz";

const TestingProcess: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const [assignment, setAssignment] = useState<AssignmentEntity | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizDetailEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [previousQuestionIndex, setPreviousQuestionIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    loadAssignment();
  }, []);

  useEffect(() => {
    if (
      previousQuestionIndex !== null &&
      previousQuestionIndex !== currentQuestionIndex
    ) {
      updateQuestion(previousQuestionIndex);
    }
    setPreviousQuestionIndex(currentQuestionIndex);
  }, [currentQuestionIndex]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      const response = await fetchAssignmentDetailProctoring(Number(params.id));
      setAssignment(response.entity);
      setCurrentQuiz(response.entity.quizzes[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (index: number) => {
    if (!assignment || !currentQuiz) return;

    const question = currentQuiz.components[index];
    if (!question) return;

    try {
      setLoading(true);

      if (question.component_type === "OpenQuestionComponent") {
        const attempt = question.component.attempt;

        await sendAnswer(assignment.id, question.id, attempt);
      }
      if (question.component_type === "FreeQuestionComponent") {
        const attempts = question.component.attempts;

        await sendAnswer(assignment.id, question.id, attempts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveQuestion = (direction: "prev" | "next" | number) => {
    if (!currentQuiz) return;

    if (typeof direction === "number") {
      if (direction >= 0 && direction < currentQuiz.components.length) {
        setCurrentQuestionIndex(direction);
      }
    } else if (direction === "next") {
      if (currentQuestionIndex < currentQuiz.components.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } else if (direction === "prev") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
  };

  const handleFinishTest = async () => {
    if (!assignment) return;

    try {
      // Обновляем текущий вопрос перед завершением
      await updateQuestion(currentQuestionIndex);

      // Отправляем запрос на завершение теста
      await finishAssignment(assignment.id, assignment.attempt_id);

      alert("Тест завершён!");
      router.back();
    } catch (error) {
      console.error("Ошибка при завершении теста:", error);
      alert("Произошла ошибка при завершении теста");
    }
  };

  // Обработчик для OpenQuestionComponent
  const handleTextChange = (text: string) => {
    if (!currentQuiz) return;

    const updatedQuiz = { ...currentQuiz };
    const currentQuestionData = updatedQuiz.components[currentQuestionIndex];

    if (currentQuestionData.component_type === "OpenQuestionComponent") {
      currentQuestionData.component.answer = text;
      setCurrentQuiz(updatedQuiz);
    }
  };

  // Обработчик для FreeQuestionComponent
  const handleOptionChange = (optionId: number) => {
    if (!currentQuiz || !assignment) return;

    const updatedQuiz = { ...currentQuiz };
    const currentQuestionData = updatedQuiz.components[currentQuestionIndex];

    if (currentQuestionData.component_type === "FreeQuestionComponent") {
      const isMultiple = currentQuestionData.component?.is_multiple === 1;

      // Создаем базовый объект ответа
      const baseAnswer = {
        assignment_id: assignment.id,
        assignment_attempt_id: assignment.attempt_id,
        free_question_id: currentQuiz.id,
        option_id: optionId,
        id: null,
        student_id: null,
        result: null,
      };

      if (isMultiple) {
        // Множественный выбор
        const existingIndex = currentQuestionData.component.attempts.findIndex(
          (attempt: any) => attempt.option_id === optionId
        );

        if (existingIndex >= 0) {
          // Убираем ответ
          currentQuestionData.component.attempts =
            currentQuestionData.component.attempts.filter(
              (attempt: any) => attempt.option_id !== optionId
            );
        } else {
          // Добавляем ответ
          currentQuestionData.component.attempts.push(baseAnswer);
        }
      } else {
        // Одиночный выбор
        const existingIndex = currentQuestionData.component.attempts.findIndex(
          (attempt: any) => attempt.option_id === optionId
        );

        if (existingIndex >= 0) {
          // Снимаем выделение
          currentQuestionData.component.attempts = [];
        } else {
          // Снимаем все предыдущие и устанавливаем новую
          currentQuestionData.component.attempts = [baseAnswer];
        }
      }

      setCurrentQuiz(updatedQuiz);
    }
  };

  // Проверяем, выбран ли вариант
  const isOptionSelected = (optionId: number) => {
    return currentQuestionData.component?.attempts?.some(
      (attempt: any) => attempt.option_id === optionId
    );
  };

  if (loading && !assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Тест не найден</p>
          <Button onClick={() => router.back()}>Назад</Button>
        </div>
      </div>
    );
  }

  if (!currentQuiz) {
    return <div>Ошибка загрузки вопроса</div>;
  }

  const totalQuestions = currentQuiz.components.length;
  const currentQuestionData = currentQuiz.components[currentQuestionIndex];
  const currentQuestion = currentQuestionData.component?.question || "Вопрос";
  const currentQuestionOptions = currentQuestionData.component?.options || [];

  // Получаем текущий ответ для открытого вопроса
  const getCurrentAnswer = () => {
    if (currentQuestionData.component_type === "OpenQuestionComponent") {
      return currentQuestionData.component.answer || "";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {currentQuiz.name}
          </span>
        </div>
        <Button
          onClick={handleFinishTest}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Завершить
        </Button>
      </div>

      {/* Навигация по вопросам */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">
              Вопрос {currentQuestionIndex + 1} из {totalQuestions}
            </span>
            <div className="flex mt-2 space-x-2">
              {currentQuiz.components.map((question, idx) => (
                <button
                  key={question.id}
                  onClick={() => handleMoveQuestion(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    idx === currentQuestionIndex
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => handleMoveQuestion("prev")}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 flex flex-col items-center justify-center text-sm ${
                currentQuestionIndex === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="font-semibold">Пред</span>
              <div className="text-xs text-gray-500 mt-0.5">
                {currentQuestionIndex === 0 ? 1 : currentQuestionIndex} вопрос
              </div>
            </button>
            <button
              onClick={() => handleMoveQuestion("next")}
              disabled={currentQuestionIndex >= totalQuestions - 1}
              className={`px-4 py-2 flex flex-col items-center justify-center text-sm ${
                currentQuestionIndex >= totalQuestions - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="font-semibold">След</span>
              <div className="text-xs text-gray-500 mt-0.5">
                {currentQuestionIndex >= totalQuestions - 1
                  ? totalQuestions
                  : currentQuestionIndex + 2}{" "}
                вопрос
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Тип вопроса и баллы */}
          <div className="flex justify-between items-center px-4 py-2 bg-blue-50 border-b">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                {currentQuestionData.component_type}
              </span>
            </div>
            <span className="text-sm text-gray-700">
              {currentQuestionData.settings?.score_encouragement || "0 баллов"}
            </span>
          </div>

          {/* Текст вопроса */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {currentQuestion}
            </h3>

            {/* Варианты ответа (если тестовый вопрос) */}
            {currentQuestionData.component_type === "FreeQuestionComponent" &&
              currentQuestionOptions.length > 0 && (
                <div className="space-y-3 mt-4">
                  {currentQuestionOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type={
                          currentQuestionData.component?.is_multiple === 1
                            ? "checkbox"
                            : "radio"
                        }
                        checked={isOptionSelected(option.id)}
                        onChange={() => handleOptionChange(option.id)}
                        className="mt-1"
                        name={
                          currentQuestionData.component?.is_multiple === 1
                            ? undefined
                            : `question-${currentQuestionData.id}`
                        }
                      />
                      <span className="text-gray-700">{option.answer}</span>
                    </label>
                  ))}
                </div>
              )}

            {/* Текстовое поле для ответа (если открытый вопрос) */}
            {currentQuestionData.component_type === "OpenQuestionComponent" && (
              <textarea
                className="w-full p-3 border rounded-lg mt-4 focus:ring focus:ring-blue-300 focus:border-blue-500"
                placeholder="Введите ваш ответ"
                rows={4}
                value={getCurrentAnswer()}
                onChange={(e) => handleTextChange(e.target.value)}
              />
            )}

            {currentQuestionData.component?.hint && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-blue-800">
                  <span className="font-medium">Подсказка</span>
                </div>
                <p className="mt-2 text-gray-700">
                  {currentQuestionData.component.hint}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg shadow-xl overflow-hidden border-2 border-white">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      </div>
    </div>
  );
};

export default TestingProcess;
