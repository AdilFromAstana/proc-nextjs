// components/Assignment/AssignmentStudentResultViewer.tsx

"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Loader2,
  Camera,
  AlertTriangle,
  Video,
  CheckCircle,
  List,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { useAssignmentStudentData } from "@/hooks/useAssignmentStudentData";
import IdentitySection from "./Sections/IdentitySection";
import ViolationsSection from "./Sections/ViolationsSection";
import ResultsSection from "./Sections/ResultsSection";
import SettingsSection from "./Sections/SettingsSection";
import ActionsSection from "./Sections/ActionsSection";

interface AssignmentStudentResultViewerProps {
  assignment: any;
  student: any;
  attempt?: any;
  accessKey?: string;
  disabled?: boolean;
  fetchResults?: boolean;
  fetchScores?: boolean;
  onAttemptSelected?: (attempt: any) => void;
  onAttemptUpdated?: (student: any) => void;
  onViolationItemSelected?: (violation: any) => void;
  onSessionGroupSelected?: (session: any) => void;
}

const AssignmentStudentResultViewer: React.FC<
  AssignmentStudentResultViewerProps
> = ({
  assignment,
  student,
  attempt,
  accessKey,
  disabled = false,
  fetchResults = false,
  fetchScores = false,
  onAttemptSelected,
  onAttemptUpdated,
  onViolationItemSelected,
  onSessionGroupSelected,
}) => {
  // ✅ Все хуки в начале
  const [currentAttempt, setCurrentAttempt] = useState(attempt);
  const [actionsPage, setActionsPage] = useState(1);
  const [violationsPage, setViolationsPage] = useState(1);

  // ✅ Используем обновлённый хук
  const { data, isLoading, isError, error } = useAssignmentStudentData(
    assignment.id,
    student.id,
    currentAttempt?.id,
    fetchResults,
    fetchScores
  );

  // ✅ Обработчики
  const handleAttemptSelected = useCallback(
    (selectedAttempt: any) => {
      setCurrentAttempt(selectedAttempt);
      onAttemptSelected?.(selectedAttempt);
    },
    [onAttemptSelected]
  );

  const handleViolationItemSelected = useCallback(
    (violation: any) => {
      onViolationItemSelected?.(violation);
    },
    [onViolationItemSelected]
  );

  const handleSessionGroupSelected = useCallback(
    (session: any) => {
      onSessionGroupSelected?.(session);
    },
    [onSessionGroupSelected]
  );

  const handleAttemptResultUpdated = useCallback(
    (updatedStudent: any) => {
      onAttemptUpdated?.(updatedStudent);
    },
    [onAttemptUpdated]
  );

  // ✅ Показываем лоадер
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        Загрузка данных студента...
      </div>
    );
  }

  // ✅ Показываем ошибку
  if (isError) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">
        Ошибка загрузки данных: {error.message}
      </div>
    );
  }

  // ✅ Если данных нет
  if (!data) {
    return <div>Данные не найдены</div>;
  }

  // ✅ Деструктуризация данных
  const {
    student_assessments,
    attempts,
    actions,
    violations,
    identities,
    credibility,
    progress,
    quiz_components,
  } = data;

  // ✅ Логика отображения разделов
  const showUserContent = true; // В реальном приложении: isManager || (!assignment.isHideUsersEnabled() || assignment.isCompletedStatus())
  const showResults = quiz_components.length > 0;

  return (
    <div className="space-y-6 p-4">
      {/* Попытки */}
      {attempts.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Попытки ({attempts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {attempts.map((attempt) => (
                <Button
                  key={attempt.id}
                  variant={
                    currentAttempt?.id === attempt.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleAttemptSelected(attempt)}
                  className="rounded-full"
                >
                  №{attempt.attempt + 1} ({attempt.status}) — {attempt.points}{" "}
                  баллов
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Прогресс */}
      {progress && (
        <Card>
          <CardHeader>
            <CardTitle>Прогресс выполнения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Общий прогресс</span>
                <span>{progress.total}%</span>
              </div>
              <Progress value={progress.total} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <IdentitySection
        assignment={assignment}
        identities={identities}
        isManager={true}
      />

      <ViolationsSection
        assignment={assignment}
        isManager={true}
        onViolationSelected={() => window.open(violation.screenshot!, "_blank")}
        violations={actions.data}
      />

      <ActionsSection assignment={assignment} currentAttempt={currentAttempt} />

      {/* Результаты */}
      {/* {showResults && ( 
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Результаты теста
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quiz_components.map((component) => {
                const question = component.component;
                console.log("question: ", question);
                const userAttempt = question.attempts.find(
                  (a) => a.assignment_attempt_id === currentAttempt?.id
                );
                const selectedOption = question.options.find(
                  (o) => o.id === userAttempt?.option_id
                );
                const isCorrect = selectedOption?.is_true === 1;

                return (
                  <div
                    key={component.id}
                    className={`p-4 rounded border ${
                      isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <h4 className="font-medium mb-2">{question.question}</h4>
                    <div className="mb-2">
                      <strong>Ваш ответ:</strong>{" "}
                      {selectedOption?.answer || "Не ответил"}
                    </div>
                    <div
                      className={`text-sm ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCorrect ? "✅ Правильно" : "❌ Неправильно"}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Баллы и надёжность */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Баллы</div>
              <div className="text-2xl font-bold">
                {currentAttempt?.points || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Надёжность</div>
              <div className="text-2xl font-bold">{credibility}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <SettingsSection assignment={assignment} /> */}
    </div>
  );
};

export default AssignmentStudentResultViewer;
