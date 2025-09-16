// components/Assignment/AssignmentToolbar.tsx

"use client";
import { Button } from "@/components/ui/button";
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

interface AssignmentToolbarProps {
  assignment: any;
  isOwner: boolean;
  onAction: (action: string) => void;
}

export default function AssignmentToolbar({
  assignment,
  isOwner,
  onAction,
}: AssignmentToolbarProps) {
  const toolbarActions = [
    {
      name: "Прокторинг",
      icon: <Monitor className="h-4 w-4" />,
      disabled: !assignment.id || !assignment.is_proctoring,
      visible: true,
      action: "proctoring",
    },
    {
      name: "Вебинар",
      icon: <Video className="h-4 w-4" />,
      disabled: !assignment.id || !assignment.is_webinar,
      visible: true,
      action: "webinar",
    },
    {
      name: "Приостановить",
      icon: <Pause className="h-4 w-4" />,
      disabled: !assignment.id || assignment.status === "suspended",
      visible: isOwner && assignment.status === "process",
      action: "suspend",
    },
    {
      name: "Возобновить",
      icon: <Play className="h-4 w-4" />,
      disabled: !assignment.id || assignment.status === "process",
      visible: isOwner && assignment.status === "suspended",
      action: "resume",
    },
    {
      name: "Завершить",
      icon: <Timer className="h-4 w-4" />,
      disabled: !assignment.id || assignment.status !== "suspended",
      visible: isOwner && assignment.status === "suspended",
      action: "complete",
    },
    {
      name: "Экспорт",
      icon: <DatabaseBackup className="h-4 w-4" />,
      disabled: !assignment.id,
      visible: isOwner && !!assignment.id,
      action: "export",
    },
    {
      name: "Сохранить",
      icon: <Save className="h-4 w-4" />,
      disabled: assignment.status === "completed",
      visible: isOwner,
      action: "save",
    },
    {
      name: "Клонировать",
      icon: <Copy className="h-4 w-4" />,
      visible: isOwner,
      action: "clone",
    },
    {
      name: "Удалить",
      icon: <Trash2 className="h-4 w-4" />,
      disabled: !assignment.id || assignment.status !== "completed",
      visible: isOwner,
      action: "delete",
    },
    {
      name: "Закрыть",
      icon: <X className="h-4 w-4" />,
      action: "close",
    },
  ];

  const visibleActions = toolbarActions.filter((a) => a.visible);

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {visibleActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          disabled={action.disabled}
          onClick={() => onAction(action.action)}
          className="flex items-center gap-2"
        >
          {action.icon}
          <span className="hidden sm:inline">{action.name}</span>
        </Button>
      ))}
    </div>
  );
}
