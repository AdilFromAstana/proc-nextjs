"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Award, Clock } from "lucide-react";
import { StudentListNotReqProps, StudentListRef } from "@/types";

const StudentListComponent = forwardRef<StudentListRef, StudentListNotReqProps>(
  (
    {
      entities = [],
      selectable = false,
      multiple = false,
      pagination = false,
      page = 1,
      loadingPlaceholderCount = 5,
      onPaged = (v) => null,
      onItemClicked = (v) => null,
      renderData,
      renderAdditional,
      className = "",
    },
    ref
  ) => {
    const [loading, setLoading] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      showLoader: () => setLoading(true),
      hideLoader: () => setLoading(false),
    }));

    if (loading) {
      return (
        <div className={`student-list-component space-y-4 ${className} p-0`}>
          {Array.from({ length: loadingPlaceholderCount }).map((_, index) => (
            <Card
              key={`loading-${index}`}
              className="entity-list-item-component"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!entities || entities.length === 0) {
      return (
        <Card className={`student-list-component ${className}`}>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">
                Нет студентов для отображения
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Студенты появятся здесь после регистрации
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div
        className={`student-list-component space-y-4 ${className} p-0 gap-0`}
      >
        {entities.map((student, index: number) => {
          console.log("student: ", student.user.photo);
          return (
            <Card
              key={`student-${student.id || index}`}
              className={`entity-list-item-component hover:shadow-md transition-shadow gap-0 m-0 p-0 rounded-none ${
                selectable ? "cursor-pointer" : ""
              }`}
            >
              <CardContent
                className={`p-4 ${
                  selectable ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (selectable) {
                    onItemClicked(student);
                  }
                }}
              >
                <div className="entity-data flex items-center justify-between">
                  <div className="entity-label flex items-center justify-between w-full">
                    <div className="student-info flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={student.user.photo}
                          alt={
                            student.user?.getFullName?.() ||
                            `${student.user?.firstname} ${student.user?.lastname}`
                          }
                        />
                        <AvatarFallback className="bg-gray-100">
                          <User className="h-6 w-6 text-gray-500" />
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-semibold text-gray-900">
                          {student.user?.getFullName?.() ||
                            `${student.user?.firstname || ""} ${
                              student.user?.lastname || ""
                            }`.trim() ||
                            "Неизвестный студент"}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={
                              student.user?.is_online ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {student.user?.is_online ? (
                              <>
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                Онлайн
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                                Офлайн
                              </>
                            )}
                          </Badge>

                          {student.points !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {student.points} баллов
                            </Badge>
                          )}

                          {student.attempts?.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {student.attempts.length} попыток
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Кастомные данные из renderData */}
                    <div className="student-custom-data">
                      {renderData && renderData(student)}
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Дополнительная информация из renderAdditional */}
              {renderAdditional && (
                <div className="border-t border-gray-100">
                  {renderAdditional(student)}
                </div>
              )}
            </Card>
          );
        })}

        {/* PAGINATION */}
        {pagination && entities.length > 0 && (
          <div className="pagination-wrapper mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPaged(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Назад
              </button>

              <span className="px-3 py-1">Страница {page}</span>

              <button
                onClick={() => onPaged(page + 1)}
                disabled={entities.length < 10} // Предполагаем, что 10 - размер страницы
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Вперед
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default StudentListComponent;
