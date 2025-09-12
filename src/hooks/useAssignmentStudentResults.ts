// hooks/useAssignmentStudentResults.ts
import { useState, useEffect, useCallback } from "react";
import { Assignment } from "@/types/assignment";
import { Student } from "@/types/students";
import { mockObj } from "@/apiMockData";

interface UseAssignmentStudentResultsProps {
  assignment: Assignment;
  student: Student | null;
  progress: { total: number };
  fetchResults: boolean;
  fetchScores: boolean;
  loaderRef: React.RefObject<any>;
}

export const useAssignmentStudentResults = ({
  assignment,
  student,
  progress,
  fetchResults,
  fetchScores,
  loaderRef,
}: UseAssignmentStudentResultsProps) => {
  const [currentAttempt, setCurrentAttempt] = useState<any>(null);
  const [progressStudent, setProgressStudent] = useState(progress);
  const [components, setComponents] = useState<any>([]);
  const [violations, setViolations] = useState<any>([]);
  const [identities, setIdentities] = useState<any>([]);
  const [actions, setActions] = useState<any>([]);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [studentScores, setStudentScores] = useState<any>();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [certificate, setCertificate] = useState(null);
  const [resultsChart, setResultsChart] = useState<any[]>([]);
  const [available_time, setAvailableTime] = useState<any>(null);
  const [credibility, setCredibility] = useState<number>(-1);
  const [is_started, setIsStarted] = useState<boolean | null>(null);
  const [is_finished, setIsFinished] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Computed values
  const webinarSessionsApiUrl = "/api/webinar-sessions";
  const isManager = true; // Заменить на реальную логику
  const isOwner = true; // Заменить на реальную логику
  const isReviewer = false; // Заменить на реальную логику

  // Computed proxy values
  const results = fetchResults
    ? studentResults
    : currentAttempt
    ? currentAttempt.results
    : student?.results || [];

  const scores = fetchScores
    ? studentScores
    : student?.scores || {
        getScore: () => 0,
        findScore: () => null,
        push: () => {},
        replace: () => {},
      };

  const reviewerScores = student?.reviewer_scores || {
    getScore: () => 0,
    findScore: () => null,
  };

  const currentScore = (() => {
    return student?.scores || 0;
  })();

  const totalApiUrl = assignment ? `/api/assignments/${assignment.id}` : "";
  const totalApiParams = {
    ...(student ? { context: student.id } : {}),
    ...(currentAttempt ? { assignment_attempt_id: currentAttempt.id } : {}),
  };

  const fetchTotal = useCallback(async () => {
    if (!assignment) return;

    setLoading(true);
    if (loaderRef.current) {
      loaderRef.current.show();
    }

    try {
      // Реальная логика fetch
      const mockData = mockObj.apiAssignmentsIdContextAssignmentAttemptId;

      const data = mockData.entity;

      if (data.quiz_components) {
        setComponents(data.quiz_components);
      }

      if (data.student_assessments) {
        setAssessments(data.student_assessments);
      }

      if (data.student_certificate) {
        setCertificate(data.student_certificate);
      }

      if (data.actions) {
        setActions(data.actions);
      }

      if (data.violations) {
        setViolations(data.violations);
      }

      if (data.identities) {
        setIdentities(data.identities);
      }

      if (data.progress) {
        setProgressStudent(data.progress);
      }
      if (data.results) {
        setStudentResults(data.results || []);
      }

      if (data.results_chart) {
        setResultsChart(data.results_chart);
      }

      if (data.scores) {
        setStudentScores(data.scores);
      }

      if (data.available_time) {
        setAvailableTime(data.available_time);
      }

      if (data.credibility) {
        setCredibility(data.credibility);
      }

      if (data.is_started) {
        setIsStarted(data.is_started);
      }

      if (data.is_finished) {
        setIsFinished(data.is_finished);
      }
    } catch (error) {
      console.error("Error fetching total data:", error);
    } finally {
      setLoading(false);
      if (loaderRef.current) {
        loaderRef.current.hide();
      }
    }
  }, [assignment, loaderRef]);

  return {
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
    results,
    scores,
    reviewerScores,
    currentScore,
    fetchTotal,
    loading,
  };
};
