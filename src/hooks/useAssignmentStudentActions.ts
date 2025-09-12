import { useCallback } from "react";

interface UseAssignmentStudentActionsProps {
  assignment: any;
  student: any;
  currentAttempt: any;
  setCurrentAttempt: (attempt: any) => void;
  onAttemptSelected?: (student: any, attempt: any) => void;
  onAttemptUpdated?: (student: any, component: any, result: any) => void;
  fetchTotal: () => void;
  loaderRef: React.RefObject<any>;
  isReviewer: boolean;
  reviewerScores: any;
  scores: any;
  disabled: boolean;
}

export const useAssignmentStudentActions = ({
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
}: UseAssignmentStudentActionsProps) => {
  const handleAttemptSelected = useCallback(
    (attempt: any) => {
      setCurrentAttempt(attempt);
      if (onAttemptSelected && student) {
        onAttemptSelected(student, attempt);
      }
    },
    [setCurrentAttempt, onAttemptSelected, student]
  );

  const handleAttemptResultUpdated = useCallback(
    (component: any, result: any) => {
      if (onAttemptUpdated && student) {
        onAttemptUpdated(student, component, result);
      }
    },
    [onAttemptUpdated, student]
  );

  const handleSessionGroupSelected = useCallback(
    (sessions: any, violation: any = null) => {
      console.log("Session group selected:", sessions, violation);
    },
    []
  );

  const handleViolationItemSelected = useCallback((violation: any) => {
    console.log("Violation selected:", violation);
  }, []);

  const updateScore = useCallback(
    async (value: number) => {
      if (disabled) return;
      console.log("Update score:", value);
    },
    [disabled]
  );

  return {
    handleAttemptSelected,
    handleAttemptResultUpdated,
    handleSessionGroupSelected,
    handleViolationItemSelected,
    updateScore,
  };
};
