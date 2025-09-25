"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useRouter } from "next/navigation";
import { sendAnswer } from "@/api/quiz";
import { fetchAssignmentDetail } from "@/api/assignmentDetail";
import { AssignmentDetailResponse } from "@/types/assignment/detail";
import { QuizQuestionItem } from "@/types/quiz/quiz";

const QuestionComponent: React.FC<{
  component: QuizQuestionItem;
  selectedAnswers: Record<number, number[]>;
  openQuestionAnswers: Record<number, string>;
  handleAnswerSelect: (questionId: number, optionIndex: number) => void;
  handleOpenQuestionChange: (questionId: number, value: string) => void;
  currentComponentRef: React.RefObject<any>;
}> = ({
  component,
  selectedAnswers,
  openQuestionAnswers,
  handleAnswerSelect,
  handleOpenQuestionChange,
  currentComponentRef,
}) => {
  const currentQuestion = component.component;
  const selectedOptions = selectedAnswers[currentQuestion?.id] || [];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {component.component_type}
          </div>
          {component.settings?.group && (
            <span className="text-xs text-gray-500">
              Группа: {component.settings.group}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {component.settings.score_encouragement} Б
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>

      {component.component_type === "OpenQuestionComponent" && (
        <textarea
          ref={currentComponentRef}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
          placeholder="Введите ваш ответ..."
          value={openQuestionAnswers[currentQuestion.id] || ""}
          onChange={(e) =>
            handleOpenQuestionChange(currentQuestion.id, e.target.value)
          }
        />
      )}
      {component.component_type === "FreeQuestionComponent" && (
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedOptions.includes(index)
                  ? "bg-blue-50 border border-blue-300"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
            >
              <Checkbox
                checked={selectedOptions.includes(index)}
                onCheckedChange={() =>
                  handleAnswerSelect(currentQuestion.id, index)
                }
                className="mr-3"
              />
              <span className="flex-1">{option.answer}</span>

              {selectedOptions.includes(index) && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  ваш ответ
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TestingProcess: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const currentComponentRef = useRef<any>(null);

  const [assignment, setAssignment] = useState<AssignmentDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number[]>
  >({});
  const [openQuestionAnswers, setOpenQuestionAnswers] = useState<
    Record<number, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isFinished, setIsFinished] = useState(false);

  const [confirmFinishQuizState, setConfirmFinishQuizState] = useState(false);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      const response = await fetchAssignmentDetail(Number(params.id));
      setAssignment(response);
      //   console.log(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Собираем все компоненты из всех квизов
  const getAllComponents = () => {
    if (!assignment) return [];

    const allComponents: QuizQuestionItem[] = [];
    assignment.entity.quizzes.forEach((quiz) => {
      if (Array.isArray(quiz.components)) {
        allComponents.push(...quiz.components);
      } else {
        allComponents.push(quiz.components);
      }
    });
    return allComponents;
  };

  const allComponents = getAllComponents();

  const updateQuestion = async () => {
    if (!assignment) return;

    try {
      setLoading(true);
      const currentAssignmentId = assignment.entity.id;
      const currentComponent = allComponents[currentQuestionIndex];
      if (!currentComponent) return;

      const currentQuestion = currentComponent.component;
      let requestData: any;

      if (currentComponent.component_type === "OpenQuestionComponent") {
        console.log("currentQuestion: ", currentQuestion);
        // Для открытого вопроса - отправляем объект
        const answerValue =
          openQuestionAnswers[currentQuestion.id] ||
          currentQuestion.attempt?.answer ||
          "";

        requestData = {
          id: currentQuestion.attempt?.id || null,
          assignment_id: currentQuestion.attempt?.assignment_id,
          assignment_attempt_id: currentQuestion.attempt?.assignment_attempt_id,
          open_question_id: currentQuestion.attempt?.open_question_id,
          student_id: currentQuestion.attempt?.student_id,
          answer: answerValue,
          result: currentQuestion.attempt?.result || null,
          attachments: currentQuestion.attempt?.attachments || [],
          created_at:
            currentQuestion.attempt?.created_at || new Date().toISOString(),
          antiplagiarism_task_id:
            currentQuestion.attempt?.antiplagiarism_task_id || null,
          antiplagiarism_task:
            currentQuestion.attempt?.antiplagiarism_task || [],
          question_id: null,
          free_question_id: null,
          option_id: null,
        };
      } else if (currentComponent.component_type === "FreeQuestionComponent") {
        // Для тестового вопроса - отправляем массив
        const selectedOptionIds = selectedAnswers[currentQuestion.id] || [];

        requestData = selectedOptionIds.map((index) => {
          const option = currentQuestion.options[index];
          return {
            id: currentQuestion.attempts?.id || null,
            assignment_id: currentQuestion.attempts?.assignment_id,
            assignment_attempt_id:
              currentQuestion.attempts?.assignment_attempt_id,
            free_question_id: currentQuestion.id,
            student_id: currentQuestion.attempts?.student_id,
            option_id: option.id, // Используем id из опции
            result: currentQuestion.attempts?.result || null,
          };
        });
      }

      // Отправляем данные только если есть, что отправлять
      if (
        (Array.isArray(requestData) && requestData.length > 0) ||
        (!Array.isArray(requestData) && requestData)
      ) {
        const response = await sendAnswer(
          currentAssignmentId,
          currentComponent.id,
          requestData
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadAssignment();
    }
  }, [params.id]);

  useEffect(() => {
    updateQuestion();
  }, [currentQuestionIndex]);

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} мин.`;
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];

      if (allComponents[currentQuestionIndex].component.is_multiple === 0) {
        return {
          ...prev,
          [questionId]: [optionIndex],
        };
      }

      if (current.includes(optionIndex)) {
        return {
          ...prev,
          [questionId]: current.filter((i) => i !== optionIndex),
        };
      }

      return {
        ...prev,
        [questionId]: [...current, optionIndex],
      };
    });
  };

  // Обработчик для открытых вопросов
  const handleOpenQuestionChange = (questionId: number, value: string) => {
    setOpenQuestionAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNextQuestion = () => {
    // если последний вопрос
    if (currentQuestionIndex + 1 >= allComponents.length) {
      if (assignment.entity.is_straight_answer) {
        // если straight answer включен, показываем подтверждение
        setConfirmFinishQuizState(true);
      } else {
        // иначе завершаем квиз
        finishQuiz();
      }
      return;
    }

    // сохраняем попытку и переходим к следующему вопросу
    if (assignment.entity.is_straight_answer) {
      updateQuestion().then(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex === 0) {
      return;
    }

    // сохраняем попытку и переходим к предыдущему вопросу
    if (assignment.entity.is_straight_answer) {
      updateQuestion().then(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const selectQuestion = (index: number) => {
    // сохраняем попытку и переходим к выбранному вопросу
    if (assignment.entity.is_straight_answer) {
      updateQuestion().then(() => {
        setCurrentQuestionIndex(index);
      });
    } else {
      setCurrentQuestionIndex(index);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    setConfirmFinishQuizState(false);
    // здесь можно добавить логику завершения теста
    console.log("Тест завершен");
  };

  const finishConfirmQuiz = () => {
    setConfirmFinishQuizState(true);
  };

  // Рендер подтверждения завершения квиза
  if (confirmFinishQuizState) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
          <div className="text-center">
            <div className="text-5xl text-yellow-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-4">
              Подтверждение завершения
            </h2>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите завершить тест? После завершения вы не
              сможете изменить ответы.
            </p>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmFinishQuizState(false);
                  setCurrentQuestionIndex(0); // возвращаемся к первому вопросу
                }}
              >
                Продолжить
              </Button>
              <Button onClick={finishQuiz}>Завершить</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentComponent = allComponents[currentQuestionIndex];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <div className="p-4 flex justify-between items-center bg-white border-b">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
          {assignment.entity.name}
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span>{formatTime(timeLeft)}</span>
          </div>

          <Button
            size="sm"
            onClick={finishConfirmQuiz}
            disabled={isFinished}
            className="rounded-full"
          >
            Завершить
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Вопрос {currentQuestionIndex + 1} из {allComponents.length}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Пред
              <span className="ml-1 text-xs">
                ({currentQuestionIndex} вопрос)
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === allComponents.length - 1}
            >
              След
              <span className="ml-1 text-xs">
                ({currentQuestionIndex + 2} вопрос)
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Кнопки навигации по вопросам */}
          {allComponents.map((_, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                index === currentQuestionIndex
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-blue-300 text-blue-600"
              }`}
              onClick={() => selectQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 p-8">
        {currentComponent && (
          <QuestionComponent
            component={currentComponent}
            selectedAnswers={selectedAnswers}
            openQuestionAnswers={openQuestionAnswers}
            handleAnswerSelect={handleAnswerSelect}
            handleOpenQuestionChange={handleOpenQuestionChange}
            currentComponentRef={currentComponentRef}
          />
        )}
      </div>

      <div className="fixed bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden">
        <img
          src="https://via.placeholder.com/192x144?text=Видеосвязь"
          alt="Видеосвязь"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default TestingProcess;
