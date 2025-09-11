"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/useToast";

// UI компоненты
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Кастомные компоненты
import AssignmentActions from "@/components/Oqylyk/Assignment/Student/ActionsComponent";
import AssignmentStudentListComponent from "@/components/Oqylyk/Assignment/Student/ListComponent/AssignmentStudentListComponent";
// import AssignmentMaterialComponent from "@/components/Oqylyq/Assignment/MaterialComponent";
// import AssignmentAccessControlComponent from "@/components/Oqylyq/Assignment/AccessControlComponent";
// import AssignmentTeacherComponent from "@/components/Oqylyq/Assignment/TeacherComponent";
// import AssignmentClassComponent from "@/components/Oqylyq/Assignment/ClassComponent";
// import AssignmentDateTimeRestrictComponent from "@/components/Oqylyq/Assignment/DateTimeRestrictComponent";
// import AssignmentMiscComponent from "@/components/Oqylyq/Assignment/MiscComponent";
// import AssignmentScenarioConditionComponent from "@/components/Oqylyq/Assignment/ScenarioConditionComponent";
// import AssignmentQuizComponentCondition from "@/components/Oqylyq/Assignment/QuizComponentCondition";
// import AssignmentCertificateComponent from "@/components/Oqylyq/Assignment/CertificateComponent";
// import AssignmentProctoringComponent from "@/components/Oqylyq/Assignment/ProctoringComponent";
// import AssignmentWebinarComponent from "@/components/Oqylyq/Assignment/WebinarComponent";
// import AssignmentExportModalComponent from "@/components/Oqylyq/Assignment/ExportModalComponent";
// import ConfirmModalComponent from "@/components/UI/ConfirmModalComponent";

// Типы
import { Assignment, AssignmentData } from "@/types/assignment";
import { Progress } from "@/components/ui/progress";
import AssignmentCommentBlockComponent from "@/components/Oqylyk/Assignment/CommentBlockComponent";

interface AssignmentViewClientPageProps {
  assignment: AssignmentData;
}

export function AssignmentViewClientPage({
  assignment,
}: AssignmentViewClientPageProps) {
  const router = useRouter();
  //   const { toast } = useToast();

  // Refs
  const exportAssignmentModalRef = useRef<any>(null);
  const confirmModalRef = useRef<any>(null);

  // Состояния
  const [entity, setEntity] = useState(() => ({
    ...assignment,
    getName: () => assignment.name || `Задание ${assignment.id}`,
    getClassName: () => assignment.class?.name || "",
    isPrepaidAccessType: () => assignment.type === "prepaid",
    isLessonType: () => assignment.type === "lessons",
    isQuizType: () => assignment.type === "quiz",
    isExternalType: () => assignment.type === "external",
    isSuspendedStatus: () => assignment.status === "suspended",
    isProcessStatus: () => assignment.status === "process",
    isCompletedStatus: () => assignment.status === "completed",
    isProctoringEnabled: () => {
      // Прокторинг включен для заданий типа quiz и external
      return assignment.type === "quiz" || assignment.type === "external";
    },
    isWebinarEnabled: () => {
      // Вебинар включен для заданий типа lessons и quiz
      return assignment.type === "lessons" || assignment.type === "quiz";
    },
  }));

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isOwner, setIsOwner] = useState(true); // Пока true, позже реализовать проверку

  // URL'ы API
  const assignmentApiUrl = `/api/assignments/${entity.id}`;
  const closeAssignmentApiUrl = `/api/assignment/close/${entity.id}.json`;
  const suspendAssignmentApiUrl = `/api/assignment/suspend/${entity.id}.json`;
  const resumeAssignmentApiUrl = `/api/assignment/resume/${entity.id}.json`;

  // Методы
  const save = async () => {
    try {
      // Здесь должен быть реальный API вызов
      // await fetch(assignmentApiUrl, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entity)
      // });

      //   toast({
      //     title: "Успех",
      //     description: "Задание успешно сохранено",
      //   });

      router.refresh();
    } catch (error) {
      console.error("Save error:", error);
      //   toast({
      //     title: "Ошибка",
      //     description: "Не удалось сохранить задание",
      //     variant: "destructive",
      //   });
    }
  };

  const close = async () => {
    const isConfirm = await confirmModalRef.current?.open();

    if (!isConfirm) {
      return;
    }

    try {
      // Здесь должен быть реальный API вызов
      // await fetch(closeAssignmentApiUrl, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'completed' })
      // });

      setEntity((prev) => ({ ...prev, status: "completed" }));
      //   toast({
      //     title: "Успех",
      //     description: "Задание успешно завершено",
      //   });
    } catch (error) {
      console.error("Close error:", error);
      //   toast({
      //     title: "Ошибка",
      //     description: "Не удалось завершить задание",
      //     variant: "destructive",
      //   });
    }
  };

  const suspend = async () => {
    const isConfirm = await confirmModalRef.current?.open();

    if (!isConfirm) {
      return;
    }

    try {
      // Здесь должен быть реальный API вызов
      // await fetch(suspendAssignmentApiUrl, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'suspended' })
      // });

      setEntity((prev) => ({ ...prev, status: "suspended" }));
      //   toast({
      //     title: "Успех",
      //     description: "Задание приостановлено",
      //   });
    } catch (error) {
      console.error("Suspend error:", error);
      //   toast({
      //     title: "Ошибка",
      //     description: "Не удалось приостановить задание",
      //     variant: "destructive",
      //   });
    }
  };

  const resume = async () => {
    const isConfirm = await confirmModalRef.current?.open();

    if (!isConfirm) {
      return;
    }

    try {
      // Здесь должен быть реальный API вызов
      // await fetch(resumeAssignmentApiUrl, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'process' })
      // });

      setEntity((prev) => ({ ...prev, status: "process" }));
      //   toast({
      //     title: "Успех",
      //     description: "Задание возобновлено",
      //   });
    } catch (error) {
      console.error("Resume error:", error);
      //   toast({
      //     title: "Ошибка",
      //     description: "Не удалось возобновить задание",
      //     variant: "destructive",
      //   });
    }
  };

  const deleteAssignment = async () => {
    const isConfirm = await confirmModalRef.current?.open();

    // if (!isConfirm) {
    //   return;
    // }

    // try {
    //   // Здесь должен быть реальный API вызов
    //   // await fetch(assignmentApiUrl, { method: 'DELETE' });

    //   toast({
    //     title: "Успех",
    //     description: "Задание удалено",
    //   });

    //   router.push("/assignments");
    // } catch (error) {
    //   console.error("Delete error:", error);
    //   toast({
    //     title: "Ошибка",
    //     description: "Не удалось удалить задание",
    //     variant: "destructive",
    //   });
    // }
  };

  const clone = () => {
    router.push(`/assignments/create?assignment_id=${entity.id}`);
  };

  const showExportAssignmentModal = () => {
    exportAssignmentModalRef.current?.open();
  };

  // Панель инструментов
  const pageToolbar = [
    {
      name: "Прокторинг",
      icon: "MonitorEye",
      disabled: !entity.id || !entity.isProctoringEnabled?.(),
      visible:
        entity.isLessonType?.() ||
        entity.isQuizType?.() ||
        entity.isExternalType?.(),
      action: () => {
        router.push(`/assignments/${entity.id}/proctoring`);
      },
    },
    {
      name: "Вебинар",
      icon: "VideoOutline",
      disabled: !entity.id || !entity.isWebinarEnabled?.(),
      visible:
        entity.isLessonType?.() ||
        entity.isQuizType?.() ||
        entity.isExternalType?.(),
      action: () => {
        router.push(`/assignments/${entity.id}/webinar`);
      },
    },
    {
      name: "Приостановить",
      icon: "Pause",
      disabled: !entity.id || entity.isSuspendedStatus?.(),
      visible: isOwner && entity.isProcessStatus?.(),
      action: suspend,
    },
    {
      name: "Возобновить",
      icon: "PlayOutline",
      disabled: !entity.id || entity.isProcessStatus?.(),
      visible: isOwner && entity.isSuspendedStatus?.(),
      action: resume,
    },
    {
      name: "Завершить",
      icon: "TimerCheckOutline",
      disabled: !entity.id || entity.isCompletedStatus?.(),
      visible: isOwner && entity.isSuspendedStatus?.(),
      action: close,
    },
    {
      name: "Экспорт",
      icon: "DatabaseExportOutline",
      disabled: !entity.id,
      visible: isOwner && entity.id,
      action: showExportAssignmentModal,
    },
    {
      name: "Сохранить",
      icon: "ContentSaveOutline",
      disabled: entity.isCompletedStatus?.(),
      visible: isOwner,
      action: save,
    },
    {
      name: "Клонировать",
      icon: "ContentCopy",
      visible: isOwner,
      action: clone,
    },
    {
      name: "Удалить",
      icon: "TrashCanOutline",
      disabled: !entity.id || !entity.isCompletedStatus?.(),
      visible: isOwner,
      action: deleteAssignment,
    },
    {
      name: "Закрыть",
      icon: "CloseOutline",
      action: () => {
        router.push("/assignments");
      },
    },
  ];

  return (
    <div className="oqylyq-page assignment-page p-8 w-full">
      {/* OTHER INFO */}
      <Card className="p-2 pb-0 border-none">
        {/* PROGRESS */}
        {entity.progress && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Прогресс задания</h3>
            {/* <ProgressbarComponent
              progress={entity.progress.total}
              animate={!entity.isCompletedStatus?.()}
            /> */}

            <Progress value={entity.progress.total} max={100} />
          </div>
        )}

        {/* ACTIONS */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Действия</h3>
          <AssignmentActions />
          <AssignmentStudentListComponent />
        </div>
      </Card>

      <Separator className="my-6" />

      <AssignmentCommentBlockComponent />
      {/* <MaterialComponent /> */}
    </div>
  );
}
