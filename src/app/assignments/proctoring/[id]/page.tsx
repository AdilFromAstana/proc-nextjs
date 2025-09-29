"use client";

import {
  fetchAssignmentActions,
  fetchAssignmentProctoring,
  fetchProctoringStudents,
} from "@/api/proctoring";
import { AssignmentAction } from "@/types/assignment/proctoring";
import { Student } from "@/types/students";
import React, { useState, useEffect, useMemo } from "react";

type StudentsPerPage = 12 | 36 | 72;
type StudentFilter = "all" | "online";

export default function ProctoringPage({ params }) {
  const { id } = params;
  const assignmentId = id ? parseInt(id as string, 10) : undefined;

  const [assignment, setAssignment] = useState<any>(null);
  const [actions, setActions] = useState<AssignmentAction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [studentsPerPage, setStudentsPerPage] = useState<StudentsPerPage>(12);
  const [studentFilter, setStudentFilter] = useState<StudentFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const assignmentResponse = await fetchAssignmentProctoring(
          assignmentId
        );

        if (assignmentResponse.entity) {
          setAssignment(assignmentResponse.entity);

          const actionsResponse = await fetchAssignmentActions(
            assignmentId,
            1,
            100,
            "desc"
          );
          if (actionsResponse.entities) {
            setActions(actionsResponse.entities.data);
          }

          const webinarId = assignmentResponse.entity.webinar.id;
          const studentsResponse = await fetchProctoringStudents(
            assignmentId,
            webinarId,
            currentPage,
            studentsPerPage
          );
          if (studentsResponse.entities) {
            setStudents(studentsResponse.entities.data);
          }
        }
      } catch (err) {
        setError("Ошибка загрузки данных прокторинга");
        console.error("Error loading proctoring data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      loadData();
    }
  }, [assignmentId, currentPage, studentsPerPage]);

  // Сортируем события по времени (сначала старые, потом новые)
  const sortedActions = useMemo(() => {
    return [...actions].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [actions]);

  const filteredStudents = useMemo(() => {
    let filtered = students;

    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.user.firstname
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          student.user.lastname
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (studentFilter === "online") {
      filtered = filtered.filter((student) => student.user.is_online);
    }

    return filtered;
  }, [students, searchQuery, studentFilter]);

  const getActionText = (action: AssignmentAction): string => {
    const actionTexts: { [key: string]: string } = {
      proctoring_policy_agree: "Принял соглашение о правилах прохождения",
      opened: "Открыл задание",
      started: "Начал выполнение задания",
      fullscreen_closed: "Отключен полноэкранный режим",
      focus_down: "Фокус потерян",
      focus_restored: "Фокус восстановлен",
      noise_detected: "Обнаружен шум",
      silence_restored: "Тишина восстановлена",
      head_not_detected: "Голова не обнаружена",
      head_detected: "Голова обнаружена",
      object_detected: "Обнаружен посторонний объект",
      browser_tab_changed: "Переключена вкладка браузера",
    };

    return actionTexts[action.action_type] || action.action_type;
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("ru-RU")} ${date.toLocaleTimeString(
      "ru-RU",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных прокторинга...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl">⚠️</div>
          <p className="mt-4 text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl">📝</div>
          <p className="mt-4 text-gray-600 text-lg">Назначение не найдено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Заголовок */}
      <div className="bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{assignment.name}</h1>
      </div>

      {/* Панель управления */}
      <div className="bg-grey px-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Поиск по студентам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">На странице:</label>
              <select
                value={studentsPerPage}
                onChange={(e) =>
                  setStudentsPerPage(Number(e.target.value) as StudentsPerPage)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={12}>12</option>
                <option value={36}>36</option>
                <option value={72}>72</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Список:</label>
              <select
                value={studentFilter}
                onChange={(e) =>
                  setStudentFilter(e.target.value as StudentFilter)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Показать всех</option>
                <option value="online">Только онлайн</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Журнал событий с уменьшенной высотой */}
      <div className="bg-white p-6">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {/* Заголовок таблицы */}
          <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Дата и время</div>
            <div className="col-span-3">Студент</div>
            <div className="col-span-6">Событие</div>
          </div>

          {/* Тело таблицы с уменьшенной высотой и скроллом */}
          <div
            className="divide-y divide-gray-200 overflow-y-auto"
            style={{ maxHeight: "18rem" }}
          >
            {sortedActions.map((action) => (
              <div
                key={action.id}
                className={`grid grid-cols-12 px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                  action.is_warning ? "bg-yellow-50 hover:bg-yellow-100" : ""
                }`}
              >
                <div className="col-span-3 text-gray-600">
                  {formatDateTime(action.created_at)}
                </div>
                <div className="col-span-3 font-medium text-gray-900">
                  {action.user.lastname} {action.user.firstname}
                </div>
                <div className="col-span-6 flex items-center">
                  <span className="flex-1">{getActionText(action)}</span>
                  {action.is_warning ? (
                    <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      ⚠️
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {sortedActions.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-sm">События не найдены</p>
            </div>
          )}
        </div>
      </div>

      {/* Сетка студентов */}
      <div className="bg-black p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex flex-col justify-center items-center w-full h-40 bg-gray-900 hover:bg-gray-700 transition-colors group rounded-lg"
            >
              {/* Аватар с индикатором статуса */}
              <div className="relative mb-2">
                {student.user.photo ? (
                  <img
                    src={student.user.photo}
                    alt={`${student.user.firstname} ${student.user.lastname}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    style={{
                      backgroundColor: `#${student.user.color || "4b5563"}`,
                    }}
                  >
                    {student.user.lastname[0]}
                    {student.user.firstname[0]}
                  </div>
                )}

                {/* Индикатор онлайн-статуса */}
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                    student.user.is_online ? "bg-green-500" : "bg-gray-600"
                  }`}
                ></div>
              </div>

              {/* Имя студента */}
              <div className="text-center w-full px-2">
                <div className="font-medium text-white text-xs truncate">
                  {student.user.lastname} {student.user.firstname}
                </div>
                <div
                  className={`text-xs ${
                    student.user.is_online ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {student.user.is_online ? "online" : "offline"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-white text-sm">Студенты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
