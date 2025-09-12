import React, { useState, useEffect, useCallback, useRef } from "react";
import { Assignment } from "@/types/assignment";
import OverlayLoaderComponent from "@/components/Chunks/OverlayLoaderComponent";

import { useAssignmentStudentResults } from "@/hooks/useAssignmentStudentResults";
import { useAssignmentStudentActions } from "@/hooks/useAssignmentStudentActions";
import AttemptSelector from "./Sections/AttemptSelector";
import IdentitySection from "./Sections/IdentitySection";
import ViolationsSection from "./Sections/ViolationsSection";
import VideoRecordsSection from "./Sections/VideoRecordsSection";
import ResultsSection from "./Sections/ResultsSection";
import ActionsSection from "./Sections/ActionsSection";
import ScoringSection from "./Sections/ScoringSection";
import CertificateSection from "./Sections/CertificateSection";
import SettingsSection from "./Sections/SettingsSection";
import ModalsContainer from "./Sections/ModalsContainer";
import { Student } from "@/types/students";
import { mockObj } from "@/apiMockData";

interface AssignmentStudentResultViewerProps {
  viewer: "owner" | "reviewer" | "proctor";
  assignment: Assignment;
  student: Student;
  progress: {
    total: number;
  };
  fetchResults: boolean;
  disabled: boolean;
  fetchScores: boolean;
  onAttemptSelected: () => null;
  onAttemptUpdated: () => null;
}

const AssignmentStudentResultViewerComponent: React.FC<
  AssignmentStudentResultViewerProps
> = ({
  viewer = "owner",
  assignment,
  student = mockObj.apiAssignmentsIdContextAssignmentAttemptId.entity,
  progress = { total: 0 },
  fetchResults = false,
  fetchScores = false,
  disabled = false,
  onAttemptSelected,
  onAttemptUpdated,
}) => {
  const loaderRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Основной хук для управления данными
  const {
    currentAttempt,
    setCurrentAttempt,
    progressStudent,
    components,
    violations,
    identities,
    actions,
    studentResults,
    studentScores,
    assessments,
    certificate,
    resultsChart,
    available_time,
    credibility,
    is_started,
    is_finished,
    webinarSessionsApiUrl,
    isManager,
    isOwner,
    isReviewer,
    results = [],
    scores,
    reviewerScores,
    currentScore,
    fetchTotal,
    loading,
  } = useAssignmentStudentResults({
    assignment,
    student,
    progress,
    fetchResults,
    fetchScores,
    loaderRef,
  });

  // Хук для управления действиями
  const {
    handleAttemptSelected,
    handleAttemptResultUpdated,
    handleSessionGroupSelected,
    handleViolationItemSelected,
    updateScore,
  } = useAssignmentStudentActions({
    assignment,
    student,
    currentAttempt,
    setCurrentAttempt,
    onAttemptSelected,
    onAttemptUpdated,
    fetchTotal,
    loaderRef,
    isReviewer,
    reviewerScores,
    scores,
    disabled,
  });

  // Watch для currentAttempt
  useEffect(() => {
    if (student?.attempts) {
      student.attempts.forEach((attempt) => {
        if (attempt.status === "active") {
          setCurrentAttempt(
            mockObj.apiAssignmentsIdContextAssignmentAttemptId.entity
              .attempts[0]
          );
        }
      });
    }

    fetchTotal();

    const interval = setInterval(() => {
      // Watch logic
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [student, fetchTotal]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  if (!assignment || !student) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет данных для отображения
      </div>
    );
  }

  return (
    <div className="student-result-component space-y-6 relative">
      {/* <OverlayLoaderComponent /> */}

      {student?.attempts && (
        <AttemptSelector
          attempts={student.attempts}
          currentAttempt={currentAttempt}
          onAttemptSelected={handleAttemptSelected}
        />
      )}

      <IdentitySection
        assignment={assessments}
        isManager={isManager}
        identities={student.identities}
      />

      <ViolationsSection
        assignment={assignment}
        isManager={isManager}
        violations={violations}
        onViolationSelected={handleViolationItemSelected}
      />

      <VideoRecordsSection
        assignment={assignment}
        student={student}
        isManager={isManager}
        webinarSessionsApiUrl={webinarSessionsApiUrl}
        onSessionSelected={handleSessionGroupSelected}
      />

      <ResultsSection
        assignment={assignment}
        student={student}
        isOwner={isOwner}
        isReviewer={isReviewer}
        results={results || []}
        components={components}
        resultsChart={resultsChart}
        currentAttempt={currentAttempt}
        disabled={disabled}
        onResultUpdated={handleAttemptResultUpdated}
      />

      {/*<ActionsSection
        assignment={assignment}
        student={student}
        currentAttempt={currentAttempt}
        actions={actions}
      />

      <ScoringSection
        assignment={assignment}
        student={student}
        isOwner={isOwner}
        currentAttempt={currentAttempt}
        currentScore={currentScore}
        disabled={disabled}
        updateScore={updateScore}
        scores={scores}
        reviewerScores={reviewerScores}
        isReviewer={isReviewer}
      />

      {assignment.certificate_id && (
        <CertificateSection
          assignment={assignment}
          student={student}
          certificate={certificate}
          disabled={disabled}
          isFinished={is_finished}
          onCertificateChange={fetchTotal}
        />
      )}

      {!disabled && (
        <SettingsSection
          assignment={assignment}
          student={student}
          available_time={available_time}
          is_started={is_started}
          is_finished={is_finished}
          onSettingsChange={fetchTotal}
        />
      )}

      <ModalsContainer
        viewer={viewer}
        assignment={assignment}
        student={student}
        currentContext="owner"
        disabled={disabled}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        onResultUpdated={handleAttemptResultUpdated}
      /> */}
    </div>
  );
};

export default AssignmentStudentResultViewerComponent;
