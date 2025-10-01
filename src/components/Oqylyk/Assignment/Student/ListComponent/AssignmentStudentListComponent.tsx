"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudentListComponent from "@/components/Oqylyk/Student/StudentListComponent";
import { Student } from "@/types/students";
import { AssignmentStudentListComponentProps } from "@/types/assignment";
import StudentFilterComponent from "@/components/Oqylyk/Student/StudentFilterComponent";

import AssignmentStudentResultViewerComponent from "../AssignmentStudentResultViewerComponent";
import StudentResultsDisplay from "./StudentRowResultsDisplay";
import StudentPointsOrScoreDisplay from "./StudentPointsOrScoreDisplay";
import StudentCredibilityDisplay from "./StudentCredibilityDisplay";
import { useTranslations } from "next-intl";

const AssignmentStudentListComponent: React.FC<
  AssignmentStudentListComponentProps
> = ({
  assignment,
  isOwner = true,
  isReviewer = true,
  isProctor = true,
  isManager = true,
  viewer = null,
  page = 1,
  totalPages = 1,
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
  const t = useTranslations();

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const handleStudentClick = useCallback(
    (student: Student) => {
      // Toggle selection для показа деталей
      if (selectedStudentId === student.id.toString()) {
        setSelectedStudentId("");
      } else {
        setSelectedStudentId(student.id.toString());
        onStudentSelected?.(student);
      }
    },
    [selectedStudentId, onStudentSelected]
  );

  return (
    <div className="assignment-student-list-component">
      <StudentFilterComponent
        assignmentId={assignment.id}
        onPageChange={onSetStudentListPage}
      >
        {({ students, filter, isError, isLoading }) => {
          if (isLoading) {
            return (
              <div className="flex justify-center items-center h-32">
                <div>{t("label-upload")}</div>
              </div>
            );
          }

          if (isError) {
            return (
              <div className="flex justify-center items-center h-32 text-red-500">
                Ошибка загрузки данных
              </div>
            );
          }

          return (
            <>
              <StudentListComponent
                className="assignment-student-result-list"
                entities={students}
                selectable={false}
                multiple={false}
                pagination={true}
                page={page}
                totalPages={totalPages}
                loadingPlaceholderCount={10}
                onPaged={onSetStudentListPage}
                onItemClicked={handleStudentClick}
                extendedStudentId={selectedStudentId}
                renderData={(student: Student) => (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <StudentResultsDisplay
                        assignment={assignment}
                        student={student}
                        isOwner={isOwner}
                        isReviewer={isReviewer}
                        isManager={isManager}
                        isProctor={isProctor}
                      />
                      <StudentPointsOrScoreDisplay
                        assignment={assignment}
                        student={student}
                      />
                      <StudentCredibilityDisplay
                        student={student}
                        assignment={assignment}
                      />
                    </div>

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
                      <AssignmentStudentResultViewerComponent
                        assignment={assignment}
                        student={student}
                        fetchResults={false}
                        disabled={false}
                        fetchScores={false}
                        accessKey={"194800"}
                        onAttemptUpdated={() => null}
                      />
                    </div>
                  )
                }
              />
            </>
          );
        }}
      </StudentFilterComponent>

      {totalPages > 1 && (
        <div className="pagination-wrapper mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSetStudentListPage?.(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              {t("btn-back")}
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
