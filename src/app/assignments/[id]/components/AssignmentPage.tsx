"use client";
import React, { useState, useCallback, useMemo } from "react";
import { mockObj } from "@/apiMockData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Monitor,
  Video,
  Pause,
  Play,
  Timer,
  DatabaseBackup,
  Save,
  Copy,
  Trash2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getStudentFilterFields,
  getStudentFilterParams,
  getViewerType,
  isAssignmentCompleted,
  studentSortByOptions,
  User,
} from "@/types/assignment";
import AssignmentStudentListComponent from "@/components/Oqylyk/Assignment/Student/ListComponent/AssignmentStudentListComponent";

// Мок-данные для assignment
const apiAssignmentData = mockObj.apiAssignmentId.entity;

// Мок-данные для пользователя
const mockCurrentUser = {
  id: "user1",
  group: "teacher",
};

const AssignmentPage: React.FC = () => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<string>("lastname");
  const [page, setPage] = useState<number>(1);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Адаптируем данные из API
  const assignment = useMemo(() => {
    return apiAssignmentData;
  }, []);

  // Текущий пользователь (можно брать из контекста или хранилища)
  const currentUser: User = {
    id: "2747436",
    firstname: "Меридиан",
    lastname: "Капитал",
    group: "manager",
    is_online: true,
  };

  // Вычисляемые свойства
  const isManager = currentUser.group === "manager";
  const isProctor = currentUser.group === "proctor";
  const isOwner =
    assignment.owner_id.toString() === currentUser.id || isManager;
  const viewer = getViewerType(assignment, currentUser, isManager, isProctor);

  // Поля фильтрации
  const studentFilterFields = getStudentFilterFields(assignment);
  const studentFilterParams = getStudentFilterParams(
    assignment.id.toString(),
    sortBy
  );

  // Обработчики событий
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
      console.log("Show student settings:", student);
      toast({
        title: "Настройки студента",
        description: `Открытие настроек для ${student.user?.firstname} ${student.user?.lastname}`,
      });
    },
    [toast]
  );

  const copyReportUrl = useCallback(
    (student: any) => {
      console.log("Copy report URL for student:", student);
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на отчет скопирована в буфер обмена",
      });
    },
    [toast]
  );

  const showLoader = useCallback(() => console.log("Show loader"), []);

  const hideLoader = useCallback(() => console.log("Hide loader"), []);

  // Toolbar actions
  const toolbarActions = [
    {
      name: "Прокторинг",
      icon: <Monitor className="h-4 w-4" />,
      disabled: !assignment.id || !assignment.is_proctoring,
      visible: true,
      action: () => console.log("Прокторинг"),
    },
    {
      name: "Вебинар",
      icon: <Video className="h-4 w-4" />,
      disabled: !assignment.id || !assignment.is_webinar,
      visible: true,
      action: () => console.log("Вебинар"),
    },
    {
      name: "Приостановить",
      icon: <Pause className="h-4 w-4" />,
      disabled: !assignment.id || assignment.status === "suspended",
      visible: isOwner && assignment.status === "process",
      action: () => console.log("Приостановить"),
    },
    {
      name: "Возобновить",
      icon: <Play className="h-4 w-4" />,
      disabled: !assignment.id || assignment.status === "process",
      visible: isOwner && assignment.status === "suspended",
      action: () => console.log("Возобновить"),
    },
    {
      name: "Завершить",
      icon: <Timer className="h-4 w-4" />,
      disabled: !assignment.id || isAssignmentCompleted(assignment),
      visible: isOwner && assignment.status === "suspended",
      action: () => console.log("Завершить"),
    },
    {
      name: "Экспорт",
      icon: <DatabaseBackup className="h-4 w-4" />,
      disabled: !assignment.id,
      visible: isOwner && !!assignment.id,
      action: () => console.log("Экспорт"),
    },
    {
      name: "Сохранить",
      icon: <Save className="h-4 w-4" />,
      disabled: isAssignmentCompleted(assignment),
      visible: isOwner,
      action: () => console.log("Сохранить"),
    },
    {
      name: "Клонировать",
      icon: <Copy className="h-4 w-4" />,
      visible: isOwner,
      action: () => console.log("Клонировать"),
    },
    {
      name: "Удалить",
      icon: <Trash2 className="h-4 w-4" />,
      disabled: !assignment.id || !isAssignmentCompleted(assignment),
      visible: isOwner,
      action: () => console.log("Удалить"),
    },
    {
      name: "Закрыть",
      icon: <X className="h-4 w-4" />,
      action: () => console.log("Закрыть"),
    },
  ];

  // Фильтруем видимые действия
  const visibleToolbarActions = toolbarActions.filter(
    (action) => action.visible
  );

  return (
    <div className="oqylyq-page assignment-page p-8 w-full">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {visibleToolbarActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            disabled={action.disabled}
            onClick={action.action}
            className="flex items-center gap-2"
          >
            {action.icon}
            <span className="hidden sm:inline">{action.name}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Progress and Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{assignment.name}</h1>
                <div className="text-sm text-gray-600 mb-4">
                  Статус:{" "}
                  <span className="font-medium capitalize">
                    {assignment.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {assignment.progress && (
                  <div className="min-w-[200px]">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Прогресс</span>
                      <span>{assignment.progress.total}%</span>
                    </div>
                    <Progress
                      value={assignment.progress.total}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block">
                Сортировка студентов
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите сортировку" />
                </SelectTrigger>
                <SelectContent>
                  {studentSortByOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <AssignmentStudentListComponent
          // students={mockObj.apiStudents.entities.data}
          assignment={assignment}
          page={page}
          totalPages={Math.ceil(
            (mockObj.apiStudents.entities.data?.length || 0) / 10
          )}
          viewer={viewer}
          isOwner={isOwner}
          isReviewer={false}
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
