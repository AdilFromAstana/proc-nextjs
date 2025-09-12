"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import {
  Student,
  StudentListNotReqProps,
  StudentListRef,
} from "@/types/students";

interface SelectedStudents {
  [key: string]: boolean;
}

const StudentListComponent = forwardRef<StudentListRef, StudentListNotReqProps>(
  (
    {
      entities = [],
      selectable = false,
      multiple = false,
      pagination = false,
      page = 1,
      totalPages = 1,
      loadingPlaceholderCount = 5,
      onPaged = (v) => null,
      onItemClicked = (v) => null,
      onSelected = (selected) => null,
      renderData,
      renderAdditional,
      renderMeta,
      className = "",
      extendedStudentId = null,
    },
    ref
  ) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedStudents, setSelectedStudents] = useState<SelectedStudents>(
      {}
    );

    useImperativeHandle(ref, () => ({
      showLoader: () => setLoading(true),
      hideLoader: () => setLoading(false),
      selectAll: () => {
        if (!multiple) return;
        const newSelected: SelectedStudents = {};
        entities.forEach((student) => {
          newSelected[student.id] = true;
        });
        setSelectedStudents(newSelected);
        onSelected(
          Object.keys(newSelected)
            .map((id) => entities.find((s) => s.id === parseInt(id)))
            .filter(Boolean) as Student[]
        );
      },
      deselectAll: () => {
        setSelectedStudents({});
        onSelected([]);
      },
    }));

    const handleStudentClick = useCallback(
      (student: Student) => {
        if (!selectable) {
          onItemClicked(student);
          return;
        }

        if (multiple) {
          setSelectedStudents((prev) => {
            const newSelected = { ...prev };
            if (newSelected[student.id]) {
              delete newSelected[student.id];
            } else {
              newSelected[student.id] = true;
            }

            const selectedList = Object.keys(newSelected)
              .map((id) => entities.find((s) => s.id === parseInt(id)))
              .filter(Boolean) as Student[];

            onSelected(selectedList);
            return newSelected;
          });
        } else {
          // Single selection
          setSelectedStudents({ [student.id]: true });
          onSelected([student]);
          onItemClicked(student);
        }
      },
      [selectable, multiple, entities, onItemClicked, onSelected]
    );

    const isSelected = useCallback(
      (studentId: string) => {
        return selectedStudents[studentId] || false;
      },
      [selectedStudents]
    );

    // Используем useMemo для оптимизации списка студентов
    const studentItems = useMemo(() => {
      return entities.map((student, index) => {
        const studentId = student.id || index;
        const isSelectedItem = isSelected(studentId.toString());

        return (
          <motion.div
            key={studentId}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Card
              className={`entity-list-item-component hover:shadow-md transition-shadow gap-0 m-0 p-0 rounded-none ${
                selectable ? "cursor-pointer" : ""
              } ${isSelectedItem ? "ring-2 ring-blue-500" : ""}`}
            >
              <CardContent
                className={`p-4 ${
                  selectable ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStudentClick(student);
                }}
              >
                <div className="entity-data flex items-center justify-between">
                  <div className="entity-label flex items-center justify-between w-full">
                    <div className="student-info flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={student.user?.photo}
                          alt={`${student.user?.firstname || ""} ${
                            student.user?.lastname || ""
                          }`}
                        />
                        <AvatarFallback className="bg-gray-100">
                          <User className="h-6 w-6 text-gray-500" />
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-semibold text-gray-900">
                          {`${student.user?.firstname || ""} ${
                            student.user?.lastname || ""
                          }`.trim() || "Неизвестный студент"}
                        </div>

                        {/* META SLOT */}
                        {renderMeta ? (
                          renderMeta(student)
                        ) : (
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant={
                                student.user?.is_online
                                  ? "default"
                                  : "secondary"
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

                            {student?.attempts &&
                              student.attempts.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {student.attempts.length} попыток
                                </Badge>
                              )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Кастомные данные из renderData */}
                    <div className="student-custom-data">
                      {renderData && renderData(student)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ADDITIONAL SLOT - отдельный motion.div для каждого дополнительного контента */}
            {renderAdditional &&
              extendedStudentId === student.id.toString() && (
                <motion.div
                  key={`additional-${student.id}`} // Уникальный ключ
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-100 overflow-hidden"
                >
                  <div className="p-4">{renderAdditional(student)}</div>
                </motion.div>
              )}
          </motion.div>
        );
      });
    }, [
      entities,
      isSelected,
      handleStudentClick,
      renderData,
      renderAdditional,
      extendedStudentId,
      renderMeta,
      selectable,
      multiple,
    ]);

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
        className={`student-list-component space-y-0 ${className} p-0 gap-0`}
      >
        {/* Убираем AnimatePresence с mode="wait" для списка */}
        <div className="space-y-0">{studentItems}</div>

        {/* PAGINATION */}
        {pagination && totalPages > 1 && (
          <div className="pagination-wrapper mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPaged(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Назад
              </button>

              <span className="px-3 py-1">
                Страница {page} из {totalPages}
              </span>

              <button
                onClick={() => onPaged(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
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
