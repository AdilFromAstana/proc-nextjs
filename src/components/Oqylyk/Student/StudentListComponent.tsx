// components/Student/StudentListComponent.tsx
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
import { User, Award, Clock, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { StudentListNotReqProps, StudentListRef } from "@/types";
import { Student } from "@/types/students";
import { Assignment } from "@/types/assignment/list";
import {
  isPointSystemEnabled,
  isProctoringEnabled,
} from "@/utils/assignmentHelpers";

interface SelectedStudents {
  [key: string]: boolean;
}

interface StudentToolbarProps {
  student: Student;
  assignment: Assignment;
  isReviewer: boolean;
  isOwner: boolean;
  onCopyReportUrl: (student: Student) => void;
  onShowSettings: (student: Student) => void;
}

// Компонент тулбара для студента
const StudentToolbar: React.FC<StudentToolbarProps> = ({
  student,
  assignment,
  isReviewer,
  isOwner,
  onCopyReportUrl,
  onShowSettings,
}) => {
  // Проверка включена ли система баллов
  const isPointSystemEnabled = (assignment: any) => {
    return assignment?.isPointSystemEnabled || false;
  };

  // Проверка включено ли прокторинг
  const isProctoringEnabled = (assignment: any) => {
    return assignment?.isProctoringEnabled || false;
  };

  // Получение результатов для отображения
  const getResultsToDisplay = () => {
    if (student.attempts && student.attempts.length > 0) {
      return student.attempts.flatMap((attempt: any) =>
        attempt.results ? attempt.results : []
      );
    }
    return student.results || [];
  };

  // Получение активной попытки
  const getActiveAttempt = () => {
    if (student.attempts && student.attempts.length > 0) {
      return (
        student.attempts.find((attempt: any) => attempt.status === "active") ||
        student.attempts[0]
      );
    }
    return null;
  };

  // Получение баллов
  const getPoints = () => {
    const activeAttempt = getActiveAttempt();
    if (activeAttempt && activeAttempt.points !== undefined) {
      return activeAttempt.points;
    }
    return student.points || 0;
  };

  // Получение оценки
  const getScore = () => {
    if (student.scores && student.scores.length > 0) {
      const score = student.scores[0]; // Предполагаем, что первая оценка актуальна
      return score.score || 0;
    }
    return 0;
  };

  // Получение уровня достоверности
  const getCredibility = () => {
    return student.credibility !== undefined ? student.credibility : -1;
  };

  // Получение класса для результата
  const getResultClass = (result: any) => {
    let baseClass =
      "w-[15px] h-[15px] min-w-[2px] mt-[3px] mx-[2px] rounded-[2px] bg-[#F0F0F0]";

    // Определяем цвет в зависимости от результата
    if (result.is_correct !== undefined) {
      baseClass += result.is_correct ? " bg-[#bfe05c]" : " bg-[#e05c67]";
    } else if (result.answered) {
      baseClass += " bg-[#ebcf34]";
    }

    // Если включена система баллов и есть баллы
    if (isPointSystemEnabled(assignment) && result.points !== null) {
      baseClass += " bg-[#0277bd]";
      // Если есть баллы но ответ неверный
      if (result.is_correct === false) {
        baseClass += " bg-[#e05c67]";
      }
    }

    return baseClass;
  };

  // Получение цвета для оценки
  const getScoreColorClass = (score: number) => {
    switch (score) {
      case 1:
        return "text-[#d14141] border-[#d14141]";
      case 2:
        return "text-[#d17d41] border-[#d17d41]";
      case 3:
        return "text-[#ebcf34] border-[#ebcf34]";
      case 4:
        return "text-[#e7f04a] border-[#e7f04a]";
      case 5:
        return "text-[#bfe05c] border-[#bfe05c]";
      default:
        return "text-[#EEE] border-[#EEE]";
    }
  };

  // Получение цвета для достоверности
  const getCredibilityColorClass = (credibility: number) => {
    if (credibility === -1) return "bg-[#EEE]";
    if (credibility >= 0 && credibility <= 10) return "bg-[#d14141]";
    if (credibility > 10 && credibility <= 30) return "bg-[#d17d41]";
    if (credibility > 30 && credibility <= 60) return "bg-[#ebcf34]";
    if (credibility > 60 && credibility <= 70) return "bg-[#e7f04a]";
    if (credibility > 70) return "bg-[#bfe05c]";
    return "bg-[#EEE]";
  };

  // Получение цвета текста для достоверности
  const getCredibilityTextColorClass = (credibility: number) => {
    if (credibility === -1) return "text-[#CCC]";
    return "text-white";
  };

  const results = getResultsToDisplay();
  const points = getPoints();
  const score = getScore();
  const credibility = getCredibility();

  return (
    <>
      {/* Результаты попыток */}
      {results.length > 0 && (
        <div className="assignment-student-result-toolbar assignment-student-attempt-list inline-block align-middle whitespace-nowrap ml-[15px] max-w-[300px] overflow-auto sm:max-w-[300px] max-[550px]:max-w-[100px]">
          <div className="assignment-result-list active flex flex-nowrap flex-row justify-start items-center mt-[5px] opacity-100">
            {results.slice(0, 20).map((result: any, index: number) => (
              <div key={`result-${index}`} className={getResultClass(result)} />
            ))}
          </div>
        </div>
      )}

      {/* Баллы или оценка */}
      {isPointSystemEnabled(assignment) ? (
        <div className="assignment-student-result-toolbar inline-block align-middle whitespace-nowrap ml-[15px] first:ml-0">
          <div
            className={`
    assignment-points-wrap
    inline-flex items-center justify-center
    w-6 h-6 text-xs font-bold
    rounded-full border-2
    ${
      points > 0
        ? "text-blue-700 border-blue-700"
        : "text-gray-300 border-gray-300"
    }
  `}
          >
            {points}
          </div>
        </div>
      ) : (
        <div className="assignment-student-result-toolbar inline-block align-middle whitespace-nowrap ml-[15px] first:ml-0">
          <div
            className={`
              assignment-score-wrap
              inline-block align-middle
              w-[25px] h-[25px] leading-[20px]
              rounded-[25px] border-[3px] border-solid text-center
              ${getScoreColorClass(score)}
            `}
          >
            <div className="assignment-score-label text-[0.8rem] font-bold">
              {score || 0}
            </div>
          </div>
        </div>
      )}

      {/* Уровень достоверности */}
      {isProctoringEnabled(assignment) && (
        <div className="assignment-student-result-toolbar inline-block align-middle whitespace-nowrap ml-[15px] first:ml-0">
          {/* <div
            className={`
              assignment-credibility-wrap
              inline-block align-middle
              w-[25px] h-[25px] leading-[27px]
              rounded-[25px] text-center
              ${getCredibilityColorClass(credibility)}
            `}
          >
            <div
              className={`
                assignment-credibility-label
                text-[0.7rem] font-bold
                ${getCredibilityTextColorClass(credibility)}
                ${credibility === -1 ? "text-[1rem]" : ""}
              `}
            >
              {credibility === -1 ? "?" : credibility}
            </div>
          </div> */}
          <div className="assignment-credibility-wrap inline-flex items-center justify-center w-6 h-6 leading-[27px] rounded-full bg-gray-300 text-center text-white">
            {credibility}
          </div>
        </div>
      )}

      {/* Тулбар с действиями */}
      <div className="assignment-student-result-toolbar inline-block align-middle whitespace-nowrap ml-[15px] first:ml-0">
        <a
          href="#"
          className="assignment-student-result-toolbar-item text-[#AAA] ml-[10px] first:ml-0 hover:text-gray-700"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCopyReportUrl(student);
          }}
        >
          <FileText className="w-4 h-4" />
        </a>
        <a
          href="#"
          className="assignment-student-result-toolbar-item text-[#AAA] ml-[10px] first:ml-0 hover:text-gray-700"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShowSettings(student);
          }}
        >
          <Settings className="w-4 h-4" />
        </a>
      </div>

      <style jsx>{`
        .assignment-student-result-toolbar {
          display: inline-block;
          vertical-align: middle;
          white-space: nowrap;
          margin-left: 15px;
        }

        .assignment-student-result-toolbar:first-child {
          margin-left: 0;
        }

        .assignment-student-result-toolbar-item {
          color: #aaa;
          margin-left: 10px;
        }

        .assignment-student-result-toolbar-item:first-child {
          margin-left: 0;
        }

        .assignment-student-attempt-list {
          max-width: 300px;
          overflow: auto;
        }

        @media screen and (max-width: 550px) {
          .assignment-student-attempt-list {
            max-width: 100px;
          }
        }

        .assignment-result-list {
          display: flex;
          flex-wrap: nowrap;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          margin-top: 5px;
          opacity: 0.25;
        }

        .assignment-result-list:first-child {
          margin-top: 0;
        }

        .assignment-result-list.active {
          opacity: 1;
        }

        .student-data-enter-active,
        .student-data-leave-active {
          transition: max-height 0.3s;
        }

        .student-data-enter,
        .student-data-leave-to {
          max-height: 0;
          overflow: hidden;
        }

        .student-data-leave,
        .student-data-enter-to {
          max-height: 1000px;
          overflow: auto;
        }
      `}</style>
    </>
  );
};

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
      assignment, // Добавляем пропс задания
      isReviewer = false,
      isOwner = true,
      onCopyReportUrl = (student) => {},
      onShowSettings = (student) => {},
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
                    <div className="student-custom-data flex items-center">
                      {renderData ? (
                        renderData(student)
                      ) : assignment ? (
                        <StudentToolbar
                          student={student}
                          assignment={assignment}
                          isReviewer={isReviewer}
                          isOwner={isOwner}
                          onCopyReportUrl={onCopyReportUrl}
                          onShowSettings={onShowSettings}
                        />
                      ) : null}
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
                  {renderAdditional(student)}
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
      assignment,
      isReviewer,
      isOwner,
      onCopyReportUrl,
      onShowSettings,
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
        <div className="space-y-0">{studentItems}</div>

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
