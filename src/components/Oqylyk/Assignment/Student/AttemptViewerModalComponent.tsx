import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Info,
  ThumbsUp,
  ThumbsDown,
  X,
  Flag,
  AlertCircle,
  CheckCircle as CheckIcon,
  XCircle as XIcon,
} from "lucide-react";
import AssignmentCommentBlockComponent from "../CommentBlockComponent";

interface AssignmentModel {
  id: number;
  isPointSystemEnabled: () => boolean;
  isCommentsEnabled: () => boolean;
}

interface StudentModel {
  id: number;
}

interface ComponentModel {
  id: number;
  component_type: string;
  settings: {
    score?: number;
    score_encouragement?: number;
  };
}

interface ResultModel {
  id: number;
  result: number;
  points: number | null;
  assignment_result_id?: number;
  getClassName: () => string;
  set: (any: any) => void;
  save: () => Promise<void>;
}

// Toast интерфейс
interface Toast {
  id: string;
  title: string;
  description: string;
  variant: "default" | "destructive" | "success";
}

interface AttemptModalViewerComponentProps {
  viewer?: string;
  assignment: AssignmentModel;
  student: StudentModel;
  disabled?: boolean;
  onResultUpdated?: (component: ComponentModel, result: ResultModel) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AttemptModalViewerComponent: React.FC<
  AttemptModalViewerComponentProps
> = ({
  viewer = "owner",
  assignment,
  student,
  disabled = false,
  onResultUpdated,
  isOpen,
  onOpenChange,
}) => {
  // Local toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // State
  const [formShowed, setFormShowed] = useState(false);
  const [canChangeResult, setCanChangeResult] = useState(true);
  const [component, setComponent] = useState<ComponentModel | null>(null);
  const [result, setResult] = useState<ResultModel | null>(null);

  // Computed values
  const isOwner = viewer === "owner";
  const isReviewer = viewer === "reviewer";

  // Local toast function
  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" | "success" = "default"
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, title, description, variant };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Local Toast Component
  const LocalToastComponent = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            relative flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300
            ${
              toast.variant === "destructive"
                ? "bg-red-50 border-red-200"
                : toast.variant === "success"
                ? "bg-green-50 border-green-200"
                : "bg-white border-gray-200"
            }
          `}
        >
          <div className="flex-1">
            <div className="flex items-center">
              {toast.variant === "destructive" && (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              {toast.variant === "success" && (
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              )}
              <h4
                className={`text-sm font-medium ${
                  toast.variant === "destructive"
                    ? "text-red-800"
                    : toast.variant === "success"
                    ? "text-green-800"
                    : "text-gray-800"
                }`}
              >
                {toast.title}
              </h4>
            </div>
            <p
              className={`mt-1 text-sm ${
                toast.variant === "destructive"
                  ? "text-red-600"
                  : toast.variant === "success"
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {toast.description}
            </p>
          </div>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="flex-shrink-0 ml-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            <XIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );

  // Methods
  const open = (
    componentData: ComponentModel,
    resultData: ResultModel,
    canChangeResultFlag: boolean = true
  ) => {
    setCanChangeResult(canChangeResultFlag);
    setComponent(componentData);
    setResult(resultData);
    onOpenChange(true);
  };

  const close = () => {
    onOpenChange(false);
    setComponent(null);
    setResult(null);
  };

  const setPoints = () => {
    if (disabled || !result || !component) {
      return;
    }

    let promptLabel = "Введите количество баллов";

    if (component.settings.score || component.settings.score_encouragement) {
      const maxPoints =
        component.settings.score || component.settings.score_encouragement;
      promptLabel = `Введите количество баллов (максимум: ${maxPoints})`;
    }

    const pointsInput = prompt(promptLabel);

    if (pointsInput === null) {
      return;
    }

    const points = parseInt(pointsInput);

    if (isNaN(points)) {
      showToast("Ошибка", "Введите корректное число баллов", "destructive");
      return;
    }

    if (component.settings.score && points > component.settings.score) {
      showToast(
        "Ошибка",
        "Количество баллов превышает максимально допустимое",
        "destructive"
      );
      return;
    }

    const originalPoints = result.points;

    try {
      result.set({ points });
      result
        .save()
        .then(() => {
          if (onResultUpdated) {
            onResultUpdated(component!, result!);
          }
          showToast("Успех", "Баллы успешно установлены", "success");
        })
        .catch((error) => {
          result.set({ points: originalPoints });
          showToast("Ошибка", "Не удалось сохранить баллы", "destructive");
        });
    } catch (error) {
      result.set({ points: originalPoints });
      showToast(
        "Ошибка",
        "Произошла ошибка при установке баллов",
        "destructive"
      );
    }
  };

  const updateResult = (newResult: number) => {
    if (disabled || !result) {
      return;
    }

    const isConfirm = confirm("Вы уверены, что хотите изменить результат?");

    if (!isConfirm) {
      return;
    }

    try {
      result.set({ result: newResult });
      result
        .save()
        .then(() => {
          if (onResultUpdated) {
            onResultUpdated(component!, result!); // Исправлено: component, result
          }
          showToast("Успех", "Результат успешно обновлен", "success");
        })
        .catch((error) => {
          showToast("Ошибка", "Не удалось сохранить результат", "destructive");
        });
    } catch (error) {
      showToast("Ошибка", "Не удалось обновить результат", "destructive");
    }
  };

  const triggerCommentForm = () => {
    setFormShowed(!formShowed);
  };

  // Helper functions...
  const getResultIcon = (resultValue: number) => {
    switch (resultValue) {
      case 1:
        return <HelpCircle className="h-4 w-4" />;
      case 2:
        return <XCircle className="h-4 w-4" />;
      case 3:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getResultLabel = (resultValue: number) => {
    switch (resultValue) {
      case 1:
        return "На проверке";
      case 2:
        return "Неправильно";
      case 3:
        return "Правильно";
      default:
        return "Информация";
    }
  };

  const getResultClass = (resultValue: number) => {
    switch (resultValue) {
      case 1:
        return "answered";
      case 2:
        return "false";
      case 3:
        return "true";
      default:
        return "info";
    }
  };

  if (!isOpen || !component || !result) {
    return (
      <>
        <LocalToastComponent />
      </>
    );
  }

  return (
    <>
      {/* Local Toasts */}
      <LocalToastComponent />

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className="attempt-modal-viewer max-w-[600px] p-0 overflow-hidden sm:max-w-[80%]"
          style={{ width: "600px" }}
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Просмотр попытки</DialogTitle>
          </DialogHeader>

          <div className="relative p-6">
            {/* COMPONENT VIEWER */}
            <div className="bg-gray-100 rounded-lg p-4 text-center mb-4">
              <p className="text-gray-600">
                Компонент {component.component_type} (просмотр)
              </p>
            </div>

            {/* RESULT BADGE */}
            {result.result !== 0 && (
              <div className="absolute top-0 right-0">
                {assignment.isPointSystemEnabled() &&
                result.points !== null &&
                result.points !== 0 ? (
                  <Badge
                    variant="default"
                    className="bg-blue-500 text-white px-3 py-2 rounded-br-none"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    {result.points} балл(-ов)
                  </Badge>
                ) : !assignment.isPointSystemEnabled() ? (
                  <Badge
                    variant={
                      getResultClass(result.result) === "true"
                        ? "default"
                        : getResultClass(result.result) === "false"
                        ? "destructive"
                        : "secondary"
                    }
                    className={`px-3 py-2 rounded-br-none ${
                      getResultClass(result.result) === "true"
                        ? "bg-green-500"
                        : getResultClass(result.result) === "false"
                        ? "bg-red-500"
                        : getResultClass(result.result) === "answered"
                        ? "bg-yellow-500"
                        : ""
                    }`}
                  >
                    {getResultIcon(result.result)}
                    <span className="ml-2 text-xs font-semibold">
                      {getResultLabel(result.result)}
                    </span>
                  </Badge>
                ) : null}
              </div>
            )}

            {/* ACTION BUTTONS */}
            {!disabled && result.result !== 0 && canChangeResult && (
              <div className="mb-6">
                {assignment.isPointSystemEnabled() ? (
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={setPoints}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Установить баллы
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateResult(0)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Сбросить
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateResult(2)}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Неправильно
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => updateResult(3)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Правильно
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* OTHER ACTIONS */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {assignment.isCommentsEnabled() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={triggerCommentForm}
                >
                  Оставить комментарий
                </Button>
              )}

              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Открыть результат для владельца");
                  }}
                >
                  Открыть результат
                </Button>
              )}

              {isReviewer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Открыть результат для рецензента");
                  }}
                >
                  Открыть результат
                </Button>
              )}
            </div>

            {/* COMMENT FORM */}
            {formShowed &&
              assignment.isCommentsEnabled() &&
              component &&
              result && (
                <div className="mt-6 w-full max-w-[600px]">
                  <AssignmentCommentBlockComponent
                    {...{
                      viewer: "owner" as const,
                      assignment: {
                        id: 123,
                        isProcessStatus: () => true,
                      },
                      student: {
                        id: 1,
                        firstname: "Иван",
                        lastname: "Иванов",
                        photo:
                          "https://placehold.co/100x100/3b82f6/FFFFFF?text=ИИ",
                        getFullName: function () {
                          return `Иван Иванов`;
                        },
                        getFirstName: function () {
                          return "Иван";
                        },
                      },
                      component: {
                        id: 456,
                        component_type: "FreeQuestionComponent",
                      },
                      result: {
                        id: 789,
                        assignment_result_id: 101,
                      },
                      disabled: false,
                    }}
                  />
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttemptModalViewerComponent;
