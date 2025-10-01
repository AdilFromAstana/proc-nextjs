// components/AssignmentCommentBlockComponent.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  useAssignmentComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "@/hooks/useAssignmentComments";
import { useTranslations } from "next-intl";

// Интерфейсы для типов данных
interface UserModel {
  id: number;
  firstname: string;
  lastname: string;
  photo: string | null;
}

interface AssignmentModel {
  id: number;
  status: string;
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
}

// Вспомогательные функции
const getFullName = (user: UserModel): string => {
  return `${user.firstname} ${user.lastname}`;
};

const getFirstName = (user: UserModel): string => {
  return user.firstname;
};

const getCreatedAtDate = (dateString: string | undefined): string => {
  return new Date(dateString || Date.now()).toLocaleString("ru-RU");
};

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
  assignment = null,
  component = null,
  result = null,
  disabled = false,
}) => {
  const t = useTranslations();

  // Auth context
  const authUser = {
    firstname: "Иван",
    lastname: "Иванов",
    photo: null,
    id: 1,
  };

  // State
  const [comment, setComment] = useState<Partial<AssignmentCommentModel>>({
    message: "",
  });

  const [editAction, setEditAction] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  // Mock profile data
  const profile: UserModel = {
    id: authUser?.id || 1,
    firstname: authUser?.firstname || "Иван",
    lastname: authUser?.lastname || "Иванов",
    photo: authUser?.photo || null,
  };

  // Computed values
  const paramsApi = useCallback(() => {
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
  }, [
    assignment?.id,
    component?.id,
    component?.component_type,
    result,
    viewer,
  ]);

  const allowSend = comment.message !== null && comment.message.trim() !== "";

  const assignmentOpened = assignment?.status === "process";

  // API hooks
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isError: isErrorComments,
    refetch: refetchComments,
  } = useAssignmentComments(assignment?.id || 0, paramsApi());

  const { mutate: createComment } = useCreateComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const comments = commentsData?.entities || [];

  // Methods
  const editComment = (commentToEdit: AssignmentCommentModel) => {
    if (!assignmentOpened) {
      alert("Действие недоступно");
      return;
    }

    setComment(commentToEdit);
    setEditAction(true);
  };

  const removeComment = (commentId: number) => {
    if (!assignmentOpened) {
      alert("Действие недоступно");
      return;
    }

    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (commentToDelete) {
      deleteComment(commentToDelete);
    }
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const cancelEdit = () => {
    setComment({ message: "" });
    setEditAction(false);
  };

  const postComment = async () => {
    if (!allowSend || !assignment) return;

    try {
      const commentData = {
        ...paramsApi(),
        message: comment.message,
      };

      if (editAction && comment.id) {
        updateComment({ id: comment.id, data: commentData });
      } else {
        createComment(commentData);
      }

      // Reset form
      setComment({ message: "" });
      setEditAction(false);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Effects
  useEffect(() => {
    if (assignment?.id) {
      const syncInterval = setInterval(() => {
        refetchComments();
      }, 20000);

      return () => {
        clearInterval(syncInterval);
      };
    }
  }, [assignment?.id, refetchComments]);

  // Render
  if (!assignment) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет данных для отображения комментариев
      </div>
    );
  }

  return (
    <Card className="comment-block-component w-full">
      <CardContent className="p-4">
        {isLoadingComments ? (
          <div className="text-center py-4">Загрузка комментариев...</div>
        ) : isErrorComments ? (
          <div className="text-center py-4 text-red-500">
            Ошибка загрузки комментариев
          </div>
        ) : comments.length > 0 ? (
          <div className="comment-block-list space-y-4 mb-6">
            {comments.map((item) => (
              <div
                key={item.id}
                className="comment-block-item border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="comment-block-profile flex flex-col gap-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      {item.user?.photo ? (
                        <AvatarImage
                          src={item.user.photo}
                          alt={getFullName(item.user)}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100">
                          <User className="w-4 h-4 text-blue-600" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="comment-profile-name text-sm font-medium text-gray-900">
                      {item.user && getFullName(item.user)}
                    </span>
                  </div>
                  <div className="comment-meta-date text-xs text-gray-500">
                    {getCreatedAtDate(item.created_at)}
                  </div>
                  <div className="comment-block-message text-sm text-gray-800">
                    {item.message}
                  </div>
                </div>

                {item.user_id === profile.id && (
                  <div className="comment-block-actions flex justify-end space-x-2 mt-2">
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
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeComment(item.id!)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}

        <div className="post-form-wrap relative">
          {(disabled || !assignmentOpened) && (
            <div className="post-form-overlay absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded">
              <div className="unavailable-label text-gray-500 font-semibold text-center px-4">
                Комментарии недоступны
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-8 h-8">
              {profile.photo ? (
                <AvatarImage src={profile.photo} alt={getFullName(profile)} />
              ) : (
                <AvatarFallback className="bg-blue-100">
                  <User className="w-4 h-4 text-blue-600" />
                </AvatarFallback>
              )}
            </Avatar>
            <span className="comment-profile-name text-sm font-medium text-gray-900">
              {getFirstName(profile)}
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
                value={comment.message || ""}
                onChange={(e) =>
                  setComment({ ...comment, message: e.target.value })
                }
                placeholder={t("placeholder-chat-message")}
                className="w-full min-h-[100px]"
                disabled={disabled || !assignmentOpened}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                disabled={!allowSend || disabled || !assignmentOpened}
                className="flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                {t("btn-send")}
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
