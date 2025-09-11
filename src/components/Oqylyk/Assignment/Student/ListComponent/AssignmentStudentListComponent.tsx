"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Settings } from "lucide-react";
import { Student, AssignmentStudentListComponentNotReqProps } from "@/types";
import { useToast } from "@/hooks/use-toast";
import StudentListComponent from "@/components/Oqylyk/Student/StudentListComponent";
import { mockObj } from "@/apiMockData";

const AssignmentStudentListComponent: React.FC<
  AssignmentStudentListComponentNotReqProps
> = ({
  assignment,
  selected,
  page,
  viewer,
  isOwner,
  isReviewer,
  isProctor,
  isManager,
  onStudentSelected,
  onSetStudentListPage,
  onStudentAttemptSelected,
  onStudentAttemptUpdated,
  showStudentSettings = (v) => null,
  copyReportUrl = (v) => null,
  renderStudentResults = (v) => null,
  renderAdditional,
}) => {
  const { toast } = useToast();

  return (
    <StudentListComponent
      className="assignment-student-result-list"
      entities={mockObj.apiStudents.entities.data || []} // Будет заполнено через StudentFilterComponent
      selectable={false}
      multiple={false}
      pagination={true}
      page={page}
      loadingPlaceholderCount={10}
      onPaged={onSetStudentListPage}
      onItemClicked={onStudentSelected}
      renderData={(student: Student) => (
        <div className="flex items-center justify-between w-full">
          {/* Student results */}
          <div className="flex items-center space-x-2">
            {renderStudentResults(student)}
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
      renderAdditional={renderAdditional}
    />
  );
};

export default AssignmentStudentListComponent;
