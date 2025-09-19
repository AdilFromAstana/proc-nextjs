// components/Assignment/AssignmentStudentResultViewer.tsx

"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Loader2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAssignmentStudentData } from "@/hooks/useAssignmentStudentData";
import IdentitySection from "./Sections/IdentitySection";
import ViolationsSection from "./Sections/ViolationsSection";
import ResultsSection from "./Sections/ResultsSection";
import SettingsSection from "./Sections/SettingsSection";
import ActionsSection from "./Sections/ActionsSection";
import VideoRecordsSection from "./Sections/VideoRecordsSection";
import StudentAttemptList from "./StudentAttemptList";

interface AssignmentStudentResultViewerProps {
  assignment: any;
  student: any;
  attempt?: any;
  accessKey?: string;
  disabled?: boolean;
  fetchResults?: boolean;
  fetchScores?: boolean;
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
  onAttemptUpdated,
  onViolationItemSelected,
  onSessionGroupSelected,
}) => {
  const [currentAttempt, setCurrentAttempt] = useState<any>(null);

  const { data, isLoading, isError, error } = useAssignmentStudentData(
    assignment.id,
    student.id,
    currentAttempt?.id,
    fetchResults,
    fetchScores
  );

  useEffect(() => {
    if (student?.attempts) {
      student.attempts.forEach((attempt: any) => {
        if (attempt.status === "active") {
          setCurrentAttempt(attempt);
        }
      });
    }

    if (!currentAttempt && student?.attempts?.length > 0) {
      const firstAttempt = student.attempts[0];
      setCurrentAttempt(firstAttempt);
    }
  }, []);

  const handleAttemptSelected = useCallback((selectedAttempt: any) => {
    const needAttempt = student.attempts.find((attempt: any) => {
      return attempt.id === selectedAttempt.id;
    });
    setCurrentAttempt(needAttempt);
  }, []);

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

  const results = useMemo(() => {
    if (fetchResults && data?.results) {
      return data.results;
    }

    if (currentAttempt?.results) {
      return currentAttempt.results;
    }

    if (student?.results) {
      return student.results;
    }

    return [];
  }, [fetchResults, data?.results, currentAttempt, student?.results]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        Загрузка данных студента...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">
        Ошибка загрузки данных: {error?.message || "Неизвестная ошибка"}
      </div>
    );
  }

  const {
    student_assessments,
    attempts,
    actions,
    violations,
    identities,
    credibility,
    progress,
    quiz_components,
    available_time,
    is_started,
    is_finished,
  } = data || {};

  const showUserContent = true;
  const showResults = quiz_components && quiz_components.length > 0;

  return (
    <div className="space-y-6 relative border-x-1">
      {/* Попытки */}
      <StudentAttemptList
        attempts={attempts}
        currentAttempt={currentAttempt}
        handleAttemptSelected={handleAttemptSelected}
      />

      {/* Фото идентификации */}
      {showUserContent && identities && identities.length > 0 && (
        <IdentitySection
          assignment={assignment}
          identities={identities}
          isManager={true}
        />
      )}

      {/* Нарушения */}
      {showUserContent &&
        violations &&
        violations.data &&
        violations.data.length > 0 && (
          <ViolationsSection
            assignment={assignment}
            isManager={true}
            onViolationSelected={handleViolationItemSelected}
            violations={violations.data}
          />
        )}

      {/* Видеозаписи */}
      {showUserContent && (
        <VideoRecordsSection
          assignment={assignment}
          student={student}
          isManager={true}
          onViolationSelected={handleViolationItemSelected}
        />
      )}

      {/* Результаты */}
      {showResults && results && results.length > 0 && (
        <ResultsSection
          onResultUpdated={() => null}
          assignment={assignment}
          student={student}
          currentAttempt={currentAttempt}
          assessments={student_assessments || []}
          components={quiz_components || []}
          results={results}
          disabled={disabled}
          isOwner={true}
          isReviewer={true}
        />
      )}

      {/* Действия */}
      <ActionsSection
        assignmentId={assignment.id} // ID задания (обязательно)
        studentId={student.id} // ID студента (обязательно)
        attemptId={currentAttempt?.id} // ID попытки (опционально)
        clickable={true} // Разрешить клик по нарушениям
        refreshing={false} // Не обновлять автоматически (данные уже есть)
        live={false} // Не использовать WebSocket (статичные данные)
        interval={0} // Не нужен таймер
        onViolationSelected={(violation) => {
          // Обработка выбора нарушения (например, открытие модального окна)
          handleViolationItemSelected(violation);
        }}
      />

      {/* Настройки */}
      <SettingsSection
        assignment={assignment}
        student={student}
        is_started={is_started}
        is_finished={is_finished}
        available_time={available_time}
        onSettingsChange={() => null}
      />
    </div>
  );
};

export default AssignmentStudentResultViewer;
