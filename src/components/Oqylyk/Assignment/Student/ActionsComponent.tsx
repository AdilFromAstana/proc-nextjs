// components/Assignment/AssignmentActionsComponent.tsx

"use client";
import React, { useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAssignmentStudentActions } from "@/hooks/useAssignmentStudentActions";

interface AssignmentActionsComponentProps {
  assignmentId: number;
  studentId?: number;
  attemptId?: number;
  clickable?: boolean;
  live?: boolean;
  refreshing?: boolean;
  interval?: number;
  onActionSelected?: (action: any) => void;
}

const AssignmentActionsComponent: React.FC<AssignmentActionsComponentProps> = ({
  assignmentId,
  studentId,
  attemptId,
  clickable = true,
  live = false,
  refreshing = false,
  interval = 20000,
  onActionSelected,
}) => {
  const [page, setPage] = useState(1);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(
    null
  );

  const {
    data: actionsData,
    isLoading,
    isError,
    refetch,
  } = useAssignmentStudentActions(assignmentId, studentId, attemptId, page);

  // Автообновление
  useEffect(() => {
    if (!refreshing || interval <= 0) return;

    const timer = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(timer);
  }, [refreshing, interval, refetch]);

  // Реальное время (заглушка)
  useEffect(() => {
    if (!live || !assignmentId) return;
    console.log(
      "Подписка на события в реальном времени для задания",
      assignmentId
    );
    return () => {
      console.log("Отписка от событий в реальном времени");
    };
  }, [live, assignmentId]);

  const handleShowPrevious = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const getActionTypeName = (type: string): string => {
    const map: Record<string, string> = {
      finished: "Завершено",
      noise_detect: "Обнаружен шум",
      head_rotated: "Поворот головы",
      head_empty: "Голова не обнаружена",
      head_restored: "Голова восстановлена",
      head_identity: "Идентификация",
    };
    return map[type] || type;
  };

  const getActionIcon = (action: any) => {
    if (action.initiator_id) return "🛡️";
    if (action.is_warning) return "⚠️";
    return "ℹ️";
  };

  const getActionColor = (action: any) => {
    if (action.initiator_id) return "bg-blue-100 text-blue-800";
    if (action.is_warning) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  if (isLoading && page === 1) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Загрузка действий...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-4 text-red-500 bg-red-50 rounded">
          Ошибка загрузки действий
        </CardContent>
      </Card>
    );
  }

  const actions = actionsData?.entities.data || [];
  const hasMore = actionsData?.entities.next_page_url !== null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Действия студента
        </CardTitle>
        {hasMore && actions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowPrevious}
            className="rounded-full"
          >
            Показать предыдущие
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {actions.length > 0 ? (
          <div className="space-y-4">
            {actions.map((action) => (
              <div
                key={action.id}
                className={`p-4 rounded-lg border transition-colors ${
                  action.is_archived
                    ? "opacity-50 bg-gray-50"
                    : "bg-white hover:bg-gray-50"
                } ${clickable ? "cursor-pointer" : ""}`}
                onClick={() => clickable && onActionSelected?.(action)}
              >
                <div className="flex items-start gap-4">
                  {/* Иконка/Аватар */}
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={action.user?.photo || undefined}
                        alt={`${action.user?.firstname} ${action.user?.lastname}`}
                      />
                      <AvatarFallback>
                        {action.user?.firstname?.[0]}
                        {action.user?.lastname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Основной контент */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="secondary"
                        className={getActionColor(action)}
                      >
                        {getActionIcon(action)}{" "}
                        {getActionTypeName(action.action_type)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(
                          new Date(action.created_at),
                          "dd.MM.yyyy HH:mm:ss"
                        )}
                      </span>
                    </div>

                    {/* Описание */}
                    {action.description && (
                      <p className="text-sm text-gray-700 mt-1">
                        {action.description}
                      </p>
                    )}

                    {/* Скриншот */}
                    {action.screenshot && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={(e) => {
                              if (!clickable) e.stopPropagation();
                              setSelectedScreenshot(action.screenshot);
                            }}
                          >
                            📷 Просмотреть скриншот
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Скриншот действия</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center">
                            <img    
                              src={action.screenshot}
                              alt="Скриншот действия"
                              className="max-w-full h-auto rounded-lg border"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>Список действий пуст</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentActionsComponent;
