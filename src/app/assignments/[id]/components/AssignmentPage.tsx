// app/assignments/[id]/page.tsx или где у тебя AssignmentPage

"use client";
import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/assignment";

// ✅ Импортируем новые компоненты
import AssignmentToolbar from "./AssignmentToolbar";
import AssignmentHeader from "./AssignmentHeader";
import AssignmentStudentSection from "./AssignmentStudentSection";

// ✅ Вспомогательные функции (если они есть)
import { getViewerType } from "@/types/assignment";
import { AssignmentDetailResponse } from "@/types/assignment/detail";
import {
  fetchAssignmentActions,
  fetchAssignmentComments,
  fetchAssignmentDetail,
  fetchAssignmentStudents,
} from "@/api/assignmentDetail";
import { AssignmentStudentsResponse } from "@/types/assignment/students";
import { AssignmentCommentsResponse } from "@/types/assignment/comments";
import { AssignmentActionsResponse } from "@/types/assignment/actions";

const AssignmentPage: React.FC<{
  assignmentId: number;
}> = ({ assignmentId }) => {
  const { toast } = useToast();

  // ✅ Состояния
  const [sortBy, setSortBy] = useState<string>("lastname");
  const [page, setPage] = useState<number>(1);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const {
    data: assignmentData,
    isLoading: isLoadingAssignment,
    isError: isErrorAssignment,
  } = useQuery<AssignmentDetailResponse>({
    queryKey: ["assignment", assignmentId],
    queryFn: () => fetchAssignmentDetail(assignmentId),
    enabled: !!assignmentId,
  });

  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useQuery<AssignmentStudentsResponse>({
    queryKey: ["assignment-students", assignmentId, page, sortBy],
    queryFn: () => fetchAssignmentStudents(assignmentId, page, 10, sortBy),
    enabled: !!assignmentId,
  });

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isError: isErrorComments,
  } = useQuery<AssignmentCommentsResponse>({
    queryKey: ["assignment-comments", assignmentId],
    queryFn: () => fetchAssignmentComments(assignmentId),
    enabled: !!assignmentId,
  });

  // const {
  //   data: actionsData,
  //   isLoading: isLoadingActions,
  //   isError: isErrorActions,
  // } = useQuery<AssignmentActionsResponse>({
  //   queryKey: ["assignment-actions", assignmentId],
  //   queryFn: () => fetchAssignmentActions(assignmentId),
  //   enabled: !!assignmentId,
  // });

  // ✅ Обработчики — до return
  const handleStudentSelected = useCallback((student: any) => {
    setSelectedStudent(student);
  }, []);

  const handleSetStudentListPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleStudentAttemptSelected = useCallback(
    (student: any, attempt: any) => {
      console.log("Student attempt selected:", student, attempt);
    },
    []
  );

  const handleStudentAttemptUpdated = useCallback((student: any) => {
    console.log("Student attempt updated:", student);
  }, []);

  const showStudentSettings = useCallback(
    (student: any) => {
      toast({
        title: "Настройки студента",
        description: `Открытие настроек для ${student.user?.firstname} ${student.user?.lastname}`,
      });
    },
    [toast]
  );

  const copyReportUrl = useCallback(
    (student: any) => {
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на отчет скопирована в буфер обмена",
      });
    },
    [toast]
  );

  const showLoader = useCallback(() => console.log("Show loader"), []);
  const hideLoader = useCallback(() => console.log("Hide loader"), []);

  const handleToolbarAction = useCallback(
    (action: string) => {
      console.log("Toolbar action:", action);
      // Здесь можно добавить логику для каждого действия
      switch (action) {
        case "close":
          window.history.back();
          break;
        case "delete":
          if (window.confirm("Удалить задание?")) {
            // API call
          }
          break;
        default:
          toast({
            title: "Функция в разработке",
            description: `Действие "${action}" пока не реализовано`,
          });
      }
    },
    [toast]
  );

  // ✅ Проверки — после хуков
  if (isErrorAssignment || isErrorStudents || isErrorComments) {
    return (
      <div className="p-8">
        <div className="text-red-500">Ошибка загрузки данных</div>
      </div>
    );
  }

  if (isLoadingAssignment) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        </div>
      </div>
    );
  }

  const assignment = assignmentData?.entity;
  if (!assignment) {
    return <div className="p-8">Задание не найдено</div>;
  }

  // ✅ Логика
  const currentUser: User = {
    id: "2747436",
    firstname: "Меридиан",
    lastname: "Капитал",
    group: "manager",
    is_online: true,
  };

  const isManager = currentUser.group === "manager";
  const isProctor = currentUser.group === "proctor";
  const isOwner =
    assignment.owner_id.toString() === currentUser.id || isManager;
  const viewer = getViewerType(assignment, currentUser, isManager, isProctor);

  // ✅ Рендер
  return (
    <div className="oqylyq-page assignment-page p-8 w-full">
      <AssignmentToolbar
        assignment={assignment}
        isOwner={isOwner}
        onAction={handleToolbarAction}
      />

      <div className="space-y-6">
        <AssignmentHeader
          assignment={assignment}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        <AssignmentStudentSection
          assignment={assignment}
          students={studentsData?.entities.data || []}
          page={page}
          totalPages={studentsData?.entities.last_page || 1}
          viewer={viewer}
          isOwner={isOwner}
          isProctor={isProctor}
          isManager={isManager}
          onStudentSelected={handleStudentSelected}
          onSetStudentListPage={handleSetStudentListPage}
          onStudentAttemptSelected={handleStudentAttemptSelected}
          onStudentAttemptUpdated={handleStudentAttemptUpdated}
          showStudentSettings={showStudentSettings}
          copyReportUrl={copyReportUrl}
          showLoader={showLoader}
          hideLoader={hideLoader}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
      </div>
    </div>
  );
};

export default AssignmentPage;
