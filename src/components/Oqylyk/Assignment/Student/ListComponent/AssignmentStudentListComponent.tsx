"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudentListComponent from "@/components/Oqylyk/Student/StudentListComponent";
import {
  getStudentFullName,
  getActiveAttempt,
  getStudentScore,
  getReviewerResult,
  Student,
} from "@/types/students";
import {
  AssignmentStudentListComponentProps,
  getStudentFilterFields,
  getStudentFilterParams,
  isPointSystemEnabled,
  isProctoringEnabled,
  studentSortByOptions,
} from "@/types/assignment";
import StudentFilterComponent from "@/components/Oqylyk/Student/StudentFilterComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AssignmentStudentResultViewerComponent from "../AssignmentStudentResultViewerComponent";

const AssignmentStudentListComponent: React.FC<
  AssignmentStudentListComponentProps
> = ({
  assignment,
  isOwner = false,
  isReviewer = false,
  isProctor = false,
  isManager = false,
  viewer = null,
  page = 1,
  totalPages = 1,
  students = [], // Вместо mockObj
  loading = false,
  onStudentSelected,
  onSetStudentListPage,
  onStudentAttemptSelected,
  onStudentAttemptUpdated,
  showStudentSettings = (v) => null,
  copyReportUrl = (v) => null,
  showLoader = () => null,
  hideLoader = () => null,
}) => {
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const handleStudentClick = useCallback(
    (student: Student) => {
      // Toggle selection для показа деталей
      if (selectedStudentId === student.id.toString()) {
        setSelectedStudentId(null);
      } else {
        setSelectedStudentId(student.id.toString());
        onStudentSelected?.(student);
      }
    },
    [selectedStudentId, onStudentSelected]
  );

  const renderStudentResults = useCallback(
    (student: Student) => {
      // Логика отображения результатов как во Vue
      const hasAttempts = student.attempts && student.attempts.length > 0;

      if (hasAttempts) {
        return (
          <div className="assignment-student-attempt-list">
            {student.attempts?.map((attempt) => (
              <div
                key={`attempt-${attempt.id}`}
                className={`assignment-result-list ${
                  attempt.status === "active" ? "active" : ""
                }`}
              >
                {attempt.results?.map((result: any, index: number) => {
                  let displayResult = result;
                  if (isReviewer) {
                    displayResult = getReviewerResult(student, result);
                  }

                  // Здесь должна быть логика getClassName()
                  const className = displayResult.className || "default";
                  const hasPoints =
                    isPointSystemEnabled(assignment) &&
                    displayResult.points !== undefined;

                  return (
                    <div
                      key={`result-${index}`}
                      className={`assignment-result-item ${className} ${
                        hasPoints ? "info" : ""
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        );
      }

      // OLD VIEW, WITHOUT ATTEMPTS
      return (
        <div className="assignment-student-attempt-list">
          <div className="assignment-result-list active">
            {student.results?.map((result: any, index: number) => {
              let displayResult = result;
              if (isReviewer) {
                displayResult = getReviewerResult(student, result);
              }

              const className = displayResult.className || "default";
              const hasPoints =
                isPointSystemEnabled(assignment) &&
                displayResult.points !== undefined;

              return (
                <div
                  key={`old-result-${index}`}
                  className={`assignment-result-item ${className} ${
                    hasPoints ? "info" : ""
                  }`}
                />
              );
            })}
          </div>
        </div>
      );
    },
    [isReviewer, assignment]
  );

  const renderPointsOrScore = useCallback(
    (student: Student) => {
      if (isPointSystemEnabled(assignment)) {
        const attempt = getActiveAttempt(student);
        if (attempt && attempt.points !== undefined) {
          return (
            <div
              className={`assignment-points-wrap ${
                attempt.points > 0 ? "active" : ""
              }`}
            >
              <div className="assignment-points-label">{attempt.points}</div>
            </div>
          );
        }
        return (
          <div
            className={`assignment-points-wrap ${
              student.points && student.points > 0 ? "active" : ""
            }`}
          >
            <div className="assignment-points-label">{student.points || 0}</div>
          </div>
        );
      }

      // SCORE
      const score = getStudentScore(student);
      return (
        <div className={`assignment-score-wrap score-${score || "0"}`}>
          <div className="assignment-score-label">{score || "0"}</div>
        </div>
      );
    },
    [assignment]
  );

  const renderCredibility = useCallback(
    (student: Student) => {
      if (
        !isProctoringEnabled(assignment) ||
        student.credibility === undefined
      ) {
        return null;
      }

      let credibilityClass = "credibility-empty";
      if (student.credibility >= 0) {
        if (student.credibility <= 10) credibilityClass = "credibility-5";
        else if (student.credibility <= 30) credibilityClass = "credibility-4";
        else if (student.credibility <= 60) credibilityClass = "credibility-3";
        else if (student.credibility <= 70) credibilityClass = "credibility-2";
        else credibilityClass = "credibility-1";
      }

      return (
        <div className={`assignment-credibility-wrap ${credibilityClass}`}>
          <div className="assignment-credibility-label">
            {student.credibility === -1 ? "?" : student.credibility}
          </div>
        </div>
      );
    },
    [assignment]
  );

  return (
    <div className="assignment-student-list-component">
      <StudentFilterComponent
        fields={getStudentFilterFields(assignment)}
        params={{ assignment_id: assignment.id }}
        page={page}
        onPageChange={onSetStudentListPage}
        onLoading={showLoader}
        onLoaded={hideLoader}
        onFilterUpdate={() => console.log("Filter updated")}
      >
        {({ students, filter }) => (
          <>
            <StudentListComponent
              className="assignment-student-result-list"
              entities={students}
              selectable={false}
              multiple={false}
              pagination={true}
              page={page}
              totalPages={students.getTotalPages?.() || 1}
              loadingPlaceholderCount={10}
              onPaged={onSetStudentListPage}
              onItemClicked={handleStudentClick}
              extendedStudentId={selectedStudentId}
              renderData={(student: Student) => (
                <div className="flex items-center justify-between w-full">
                  {/* Student results как во Vue */}
                  <div className="flex items-center space-x-2">
                    {renderStudentResults(student)}
                    {renderPointsOrScore(student)}
                    {renderCredibility(student)}
                  </div>

                  {/* Toolbar */}
                  <div className="assignment-student-result-toolbar flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyReportUrl(student);
                      }}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showStudentSettings(student);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              renderAdditional={(student: Student) =>
                selectedStudentId === student.id.toString() && (
                  <div className="assignment-student-info">
                    {/* <ResultViewerComponent /> */}
                    <AssignmentStudentResultViewerComponent
                      assignment={assignment}
                      viewer={"owner"}
                      student={student}
                      progress={{
                        total: 0,
                      }}
                      fetchResults={false}
                      disabled={false}
                      fetchScores={false}
                      onAttemptSelected={function (): null {
                        throw new Error("Function not implemented.");
                      }}
                      onAttemptUpdated={function (): null {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  </div>
                )
              }
            />
          </>
        )}
      </StudentFilterComponent>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrapper mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSetStudentListPage?.(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Назад
            </button>
            <span className="px-3 py-1">
              Страница {page} из {totalPages}
            </span>
            <button
              onClick={() =>
                onSetStudentListPage?.(Math.min(totalPages, page + 1))
              }
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Вперед
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentStudentListComponent;
