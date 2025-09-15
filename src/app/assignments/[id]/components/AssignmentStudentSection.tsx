// components/Assignment/AssignmentStudentSection.tsx

import AssignmentStudentListComponent from "@/components/Oqylyk/Assignment/Student/ListComponent/AssignmentStudentListComponent";

interface AssignmentStudentSectionProps {
  assignment: any;
  students: any[];
  page: number;
  totalPages: number;
  viewer: any;
  isOwner: boolean;
  isProctor: boolean;
  isManager: boolean;
  onStudentSelected: (student: any) => void;
  onSetStudentListPage: (page: number) => void;
  onStudentAttemptSelected: (student: any, attempt: any) => void;
  onStudentAttemptUpdated: (student: any) => void;
  showStudentSettings: (student: any) => void;
  copyReportUrl: (student: any) => void;
  showLoader: () => void;
  hideLoader: () => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export default function AssignmentStudentSection({
  assignment,
  students,
  page,
  totalPages,
  viewer,
  isOwner,
  isProctor,
  isManager,
  onStudentSelected,
  onSetStudentListPage,
  onStudentAttemptSelected,
  onStudentAttemptUpdated,
  showStudentSettings,
  copyReportUrl,
  showLoader,
  hideLoader,
  sortBy,
  onSortByChange,
}: AssignmentStudentSectionProps) {
  return (
    <AssignmentStudentListComponent
      assignment={assignment}
      page={page}
      totalPages={totalPages}
      students={students}
      viewer={viewer}
      isOwner={isOwner}
      isReviewer={false}
      isProctor={isProctor}
      isManager={isManager}
      onStudentSelected={onStudentSelected}
      onSetStudentListPage={onSetStudentListPage}
      onStudentAttemptSelected={onStudentAttemptSelected}
      onStudentAttemptUpdated={onStudentAttemptUpdated}
      showStudentSettings={showStudentSettings}
      copyReportUrl={copyReportUrl}
      showLoader={showLoader}
      hideLoader={hideLoader}
      sortBy={sortBy}
      onSortByChange={onSortByChange}
    />
  );
}
