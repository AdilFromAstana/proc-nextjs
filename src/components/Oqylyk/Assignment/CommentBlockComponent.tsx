import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, X, Send, User } from "lucide-react";

// Интерфейсы для типов данных
interface UserModel {
  id: number;
  firstname: string;
  lastname: string;
  photo: string;
  getFullName(): string;
  getFirstName(): string;
}

interface AssignmentModel {
  id: number;
  isProcessStatus(): boolean;
}

interface ComponentModel {
  id: number;
  component_type: string;
}

interface ResultModel {
  id: number;
  assignment_result_id?: number;
}

interface AssignmentCommentModel {
  id?: number;
  message: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  user?: UserModel;
  getCreatedAtDate(): string;
  set(data: any): void;
  save(options?: any): Promise<void>;
  delete(): Promise<void>;
}

interface AssignmentCommentList {
  length: number;
  models: AssignmentCommentModel[];
  fetch(params: any): Promise<void>;
}

// Props интерфейсы
interface AssignmentCommentBlockProps {
  viewer?: "owner" | "reviewer" | "proctor";
  assignment?: AssignmentModel | null;
  student?: any;
  component?: ComponentModel | null;
  result?: ResultModel | null;
  disabled?: boolean;
}

const AssignmentCommentBlockComponent: React.FC<
  AssignmentCommentBlockProps
> = ({
  viewer = "owner",
  assignment = { id: 1, isProcessStatus: () => null },
  student,
  component = null,
  result = null,
  disabled = false,
}) => {
  // State
  const [comment, setComment] = useState<AssignmentCommentModel>({
    message: "",
    set: function (data: any) {
      Object.assign(this, data);
    },
    save: async function (options?: any) {
      console.log("Сохранение комментария:", this);
      return Promise.resolve();
    },
    delete: async function () {
      console.log("Удаление комментария");
      return Promise.resolve();
    },
    getCreatedAtDate: function () {
      return new Date(Date.now()).toLocaleString("ru-RU");
    },
  });

  const [comments, setComments] = useState<AssignmentCommentList>({
    length: 1,
    models: [
      {
        id: 1,
        message: "Отличный ответ! Показал глубокое понимание материала.",
        user_id: 2,
        created_at: "2023-12-01T10:30:00Z",
        updated_at: "2023-12-01T10:30:00Z",
        user: {
          id: 2,
          firstname: "Мария",
          lastname: "Петрова",
          photo: "https://placehold.co/50x50/ef4444/FFFFFF?text=МП",
          getFullName: function () {
            return `${this.firstname} ${this.lastname}`;
          },
          getFirstName: function () {
            return this.firstname;
          },
        },
        getCreatedAtDate: function () {
          return new Date(this.created_at || Date.now()).toLocaleString(
            "ru-RU"
          );
        },
        set: function (data: any) {
          Object.assign(this, data);
        },
        save: async function (options?: any) {
          return Promise.resolve();
        },
        delete: async function () {
          return Promise.resolve();
        },
      },
    ],
    fetch: async function (params: any) {
      return Promise.resolve();
    },
  });

  const [editAction, setEditAction] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] =
    useState<AssignmentCommentModel | null>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);

  // Mock profile data (заменить на реальные данные аутентификации)
  const profile: UserModel = {
    id: 1,
    firstname: "Иван",
    lastname: "Иванов",
    photo: "https://placehold.co/100x100/3b82f6/FFFFFF?text=ИИ",
    getFullName: function () {
      return `${this.firstname} ${this.lastname}`;
    },
    getFirstName: function () {
      return this.firstname;
    },
  };

  // Computed values
  const paramsApi = (() => {
    let resultId = null;

    if (result) {
      resultId =
        viewer === "reviewer" ? result.assignment_result_id : result.id;
    }

    return {
      assignment_id: assignment?.id,
      assignment_result_id: resultId,
      component_id: component?.id || null,
      component_type: component?.component_type || null,
    };
  })();

  const fieldsApi = [
    "id",
    "assignment_id",
    "assignment_result_id",
    "user_id",
    "component_id",
    "component_type",
    "message",
    "user:id",
    "user:firstname",
    "user:lastname",
    "user:photo",
    "created_at",
    "updated_at",
  ];

  const allowSend = comment.message !== null && comment.message !== "";

  const assignmentOpened = assignment?.isProcessStatus() || true;

  const isOwner = viewer === "owner";
  const isReviewer = viewer === "reviewer";

  // Methods
  const fetchComments = async () => {
    if (!assignment) return;

    try {
      // Mock fetch
      const mockComments: AssignmentCommentModel[] = [
        {
          id: 1,
          message: "Отличный ответ! Показал глубокое понимание материала.",
          user_id: 2,
          created_at: "2023-12-01T10:30:00Z",
          updated_at: "2023-12-01T10:30:00Z",
          user: {
            id: 2,
            firstname: "Мария",
            lastname: "Петрова",
            photo: "https://placehold.co/50x50/ef4444/FFFFFF?text=МП",
            getFullName: function () {
              return `${this.firstname} ${this.lastname}`;
            },
            getFirstName: function () {
              return this.firstname;
            },
          },
          getCreatedAtDate: function () {
            return new Date(this.created_at || Date.now()).toLocaleString(
              "ru-RU"
            );
          },
          set: function (data: any) {
            Object.assign(this, data);
          },
          save: async function (options?: any) {
            return Promise.resolve();
          },
          delete: async function () {
            return Promise.resolve();
          },
        },
      ];

      setComments({
        length: mockComments.length,
        models: mockComments,
        fetch: async function (params: any) {
          return Promise.resolve();
        },
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const editComment = (commentToEdit: AssignmentCommentModel) => {
    if (!assignmentOpened) {
      alert("Действие недоступно");
      return;
    }

    setComment(commentToEdit);
    setEditAction(true);
  };

  const removeComment = (commentToRemove: AssignmentCommentModel) => {
    if (!assignmentOpened) {
      alert("Действие недоступно");
      return;
    }

    setCommentToDelete(commentToRemove);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (commentToDelete) {
      try {
        await commentToDelete.delete();
        fetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const cancelEdit = () => {
    setComment({
      message: "",
      set: function (data: any) {
        Object.assign(this, data);
      },
      save: async function (options?: any) {
        return Promise.resolve();
      },
      delete: async function () {
        return Promise.resolve();
      },
      getCreatedAtDate: function () {
        return new Date().toLocaleString("ru-RU");
      },
    });
    setEditAction(false);
  };

  const postComment = async () => {
    if (!allowSend) {
      return;
    }

    try {
      // Show loader simulation
      if (sendBtnRef.current) {
        sendBtnRef.current.textContent = "Отправка...";
      }

      // Set params
      comment.set(paramsApi);

      // Save comment
      await comment.save({
        headers: { "X-Requested-Fields": fieldsApi.join(",") },
      });

      // Reset model
      setComment({
        message: "",
        set: function (data: any) {
          Object.assign(this, data);
        },
        save: async function (options?: any) {
          return Promise.resolve();
        },
        delete: async function () {
          return Promise.resolve();
        },
        getCreatedAtDate: function () {
          return new Date().toLocaleString("ru-RU");
        },
      });

      setEditAction(false);
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      if (sendBtnRef.current) {
        sendBtnRef.current.textContent = "Отправить";
      }
    }
  };

  // Effects
  useEffect(() => {
    fetchComments();

    const syncInterval = setInterval(() => {
      fetchComments();
    }, 20000);

    return () => {
      clearInterval(syncInterval);
    };
  }, [assignment?.id, component?.id, result?.id]);

  // Render
  if (!assignment) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет данных для отображения комментариев
      </div>
    );
  }

  return (
    <Card className="comment-block-component p-4 m-0 rounded-none">
      <CardContent className="p-0">
        {comments.length > 0 && (
          <div className="comment-block-list space-y-4">
            {comments.models.map((item, index) => (
              <div
                key={index}
                className="comment-block-item border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="comment-block-profile flex justify-between flex-col gap-2 pb-2 border-b-1 border-gray-400">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={item.user?.photo}
                        alt={item.user?.getFullName()}
                      />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="comment-profile-name text-sm font-medium text-gray-900">
                      {item.user?.getFullName()}
                    </span>
                  </div>
                  <div className="comment-meta-date text-xs text-gray-500">
                    {item.getCreatedAtDate()}
                  </div>
                  <div className="comment-block-message text-sm text-black ">
                    {item.message}
                  </div>
                </div>

                {item.user_id === profile.id && (
                  <div className="comment-block-actions flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => editComment(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => removeComment(item)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="post-form-wrap relative">
          {(disabled || !assignmentOpened) && (
            <div className="post-form-overlay absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="unavailable-label text-gray-500 font-semibold text-center">
                Комментарии недоступны
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarImage src={profile.photo} alt={profile.getFullName()} />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <span className="comment-profile-name text-sm font-medium text-gray-900">
              {profile.getFirstName()}
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              postComment();
            }}
          >
            <div className="mb-4">
              <Textarea
                value={comment.message}
                onChange={(e) =>
                  setComment({ ...comment, message: e.target.value })
                }
                placeholder="Введите сообщение"
                className="w-full min-h-[100px] border-1 rounded-none"
                disabled={disabled || !assignmentOpened}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                ref={sendBtnRef}
                type="submit"
                disabled={!allowSend || disabled || !assignmentOpened}
                className="flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Отправить
              </Button>

              {editAction && (
                <Button variant="outline" onClick={cancelEdit} type="button">
                  Отмена
                </Button>
              )}
            </div>
          </form>
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить комментарий?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот комментарий? Это действие
              нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default AssignmentCommentBlockComponent;
