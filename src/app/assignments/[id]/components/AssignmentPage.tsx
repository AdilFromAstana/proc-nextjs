"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/assignment";
import { AssignmentDetail } from "@/types/assignment/detail"; // Импортируем AssignmentDetail

// ✅ Импортируем новые компоненты
import AssignmentToolbar from "./AssignmentToolbar";
import AssignmentHeader from "./AssignmentHeader";
import AssignmentStudentSection from "./AssignmentStudentSection";

// ✅ Вспомогательные функции (если они есть)
import { getViewerType } from "@/types/assignment";
import { AssignmentDetailResponse } from "@/types/assignment/detail";
import {
  fetchAssignmentDetail,
  fetchAssignmentStudents,
  // Импортируем функцию для обновления задания (замените на вашу)
  updateAssignmentDetail,
} from "@/api/assignmentDetail";
import { AssignmentStudentsResponse } from "@/types/assignment/students";
import AssignmentCommentBlockComponent from "@/components/Oqylyk/Assignment/CommentBlockComponent";
import AssignmentAccessTypeComponent from "./AssignmentAccessTypeComponent/AssignmentAccessTypeComponent";
import AssignmentTeacherReviewerComponent from "./AssignmentTeacherComponent";
import AssignmentPlanComponent from "./AssignmentPlanComponent";
import AssignmentMiscSettingsComponent from "./AssignmentMiscSettingsComponent";
import AssignmentScenarioSettingsComponent from "./AssignmentScenarioSettingsComponent";
import AssignmentComponentSettingsComponent from "./AssignmentComponentSettingsComponent";
import AssignmentCertificateComponent from "./AssignmentCertificateComponent";
import AssignmentProctoringComponent from "./AssignmentProctoringComponent";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const AssignmentPage: React.FC<{
  assignmentId: number;
}> = ({ assignmentId }) => {
  const t = useTranslations();

  const { toast } = useToast();
  const queryClient = useQueryClient(); // Для инвалидации кэша

  // ✅ Состояния
  const [sortBy, setSortBy] = useState<string>("lastname");
  const [page, setPage] = useState<number>(1);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  // --- Новое состояние для assignment ---
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  // -------------------------------------
  const router = useRouter();

  const {
    data: assignmentData,
    isLoading: isLoadingAssignment,
    isError: isErrorAssignment,
  } = useQuery<AssignmentDetailResponse>({
    queryKey: ["assignment", assignmentId],
    queryFn: () => fetchAssignmentDetail(assignmentId),
    enabled: !!assignmentId,
  });

  // --- Инициализируем локальное состояние assignment данными из запроса ---
  useEffect(() => {
    if (assignmentData?.entity) {
      setAssignment(assignmentData.entity);
    }
  }, [assignmentData]);
  // -------------------------------------------------------------------------

  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useQuery<AssignmentStudentsResponse>({
    queryKey: ["assignment-students", assignmentId, page, sortBy],
    queryFn: () => fetchAssignmentStudents(assignmentId, page, 10, sortBy),
    enabled: !!assignmentId,
  });

  // --- Функция для обновления локального состояния assignment ---
  const handleAssignmentChange = useCallback(
    (updatedAssignment: AssignmentDetail) => {
      console.log("Assignment updated locally:", updatedAssignment);
      setAssignment(updatedAssignment);
      // Здесь можно также вызвать API для сохранения изменений на сервере
      // Например, с использованием useMutation
      updateAssignmentMutation.mutate(updatedAssignment);
    },
    []
  );
  // ----------------------------------------------------------------

  // --- (Опционально) Мутация для сохранения на сервере ---
  const updateAssignmentMutation = useMutation({
    mutationFn: (updatedAssignment: AssignmentDetail) =>
      updateAssignmentDetail(assignmentId, updatedAssignment),
    onSuccess: (data) => {
      // Обновляем кэш react-query
      queryClient.setQueryData(["assignment", assignmentId], data);
      toast({ title: "Успешно", description: "Задание обновлено" });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить задание",
        // variant: "destructive",
      });
      console.log(error);
      // Откатываем локальное состояние в случае ошибки, если необходимо
      // setAssignment(prev => prev); // или какая-то другая логика
    },
  });
  // ---------------------------------------------------------

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
        title: t("notify-assignment-report-url-copied"),
        description: "Ссылка на отчет скопирована в буфер обмена",
      });
    },
    [toast]
  );

  const showLoader = useCallback(() => null, []);
  const hideLoader = useCallback(() => null, []);

  const handleToolbarAction = useCallback(
    (action: string) => {
      console.log("Toolbar action:", action);
      // Здесь можно добавить логику для каждого действия
      switch (action) {
        case "close":
          window.history.back();
          break;
        case "delete":
          if (window.confirm(t("notify-abort-action-task"))) {
            // API call
          }
          break;
        case "proctoring":
          {
            router.push(`/assignments/proctoring/${assignmentId}`);
          }
          // API call
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
  if (isErrorAssignment || isErrorStudents) {
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

  // const assignment = assignmentData?.entity; // Убираем это, так как используем локальное состояние
  if (!assignment) {
    // Проверяем локальное состояние
    return <div className="p-8">{t("label-empty-found")}</div>;
  }

  // ✅ Логика
  const currentUser: User = {
    id: 2747436,
    firstname: "Меридиан",
    lastname: "Капитал",
    group: "manager",
    is_online: true,
  };

  const isManager = currentUser.group === "manager";
  const isProctor = currentUser.group === "proctor";
  const isOwner = assignment.owner_id === currentUser.id;
  const viewer = getViewerType(assignment, currentUser, isManager, isProctor);

  // ✅ Рендер
  return (
    <div className="oqylyq-page assignment-page p-6 w-full">
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
        <AssignmentCommentBlockComponent assignment={assignment} />
        <AssignmentAccessTypeComponent
          assignment={assignment}
          onAssignmentChange={handleAssignmentChange} // Передаем реальную функцию
        />
        <AssignmentTeacherReviewerComponent
          assignment={assignment}
          isManager={isManager}
          onAssignmentChange={handleAssignmentChange} // Передаем реальную функцию
        />
        <AssignmentPlanComponent
          assignment={assignment}
          onAssignmentChange={handleAssignmentChange} // Передаем реальную функцию
        />
        <AssignmentMiscSettingsComponent
          assignment={assignment}
          onAssignmentChange={handleAssignmentChange}
        />
        <AssignmentScenarioSettingsComponent
          assignment={assignment}
          onAssignmentChange={handleAssignmentChange}
        />

        <AssignmentComponentSettingsComponent
          assignment={assignment}
          onAssignmentChange={handleAssignmentChange}
        />

        <AssignmentCertificateComponent
          assignment={assignment}
          onAssignmentChange={handleAssignmentChange}
        />

        <AssignmentProctoringComponent
          assignment={assignment}
          onAssignmentChange={handleAssignmentChange}
        />
      </div>
    </div>
  );
};

export default AssignmentPage;
