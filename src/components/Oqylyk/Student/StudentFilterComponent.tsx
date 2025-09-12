"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentList, studentSortByOptions } from "@/types/assignment";
import { mockObj } from "@/apiMockData";

interface StudentFilterComponentProps {
  fields?: string[];
  page?: number;
  fetching?: boolean;
  params?: Record<string, any>;
  chunks?: number[];
  theme?: string;
  children: (props: { students: StudentList; filter: any }) => React.ReactNode;
  onLoading?: () => void;
  onLoaded?: (students: StudentList) => void;
  onFilterUpdate?: () => void;
  onPageChange?: (page: number) => void;
}

interface StudentFilter {
  limit: number;
  query: string | null;
}

const StudentFilterComponent: React.FC<StudentFilterComponentProps> = ({
  fields = [
    "id",
    "user_id",
    "user:id",
    "user:photo",
    "user:color",
    "user:photo_thumb",
    "user:firstname",
    "user:lastname",
    "user:last_activity_date",
    "user:is_online",
  ],
  page = 1,
  fetching = true,
  params = {},
  chunks = [10, 20, 50, 100],
  theme = "white",
  children,
  onLoading,
  onLoaded,
  onFilterUpdate,
  onPageChange,
}) => {
  const [sortBy, setSortBy] = useState<string>("lastname");
  const [students, setStudents] = useState<StudentList>([]);
  const [filter, setFilter] = useState<StudentFilter>({
    limit: chunks[0],
    query: null,
  });
  const [filterInterval, setFilterInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(page);

  // perPageOptions как в Vue
  const perPageOptions = useMemo(() => {
    if (!chunks || chunks.length <= 0) {
      return [];
    }

    return chunks.map((count) => ({
      id: count,
      name: `${count} студентов`,
    }));
  }, [chunks]);

  // Функция загрузки студентов
  const fetchStudents = useCallback(async () => {
    if (!fetching) {
      return;
    }

    onLoading?.();

    try {
      // Merge params - теперь включаем sortBy
      const queryParams: Record<string, any> = {
        page: currentPage,
        limit: filter.limit,
        sortBy: sortBy, // Добавляем сортировку
        ...(filter.query ? { query: filter.query } : {}),
        ...params,
      };

      // Filter undefined/null values
      const cleanParams: Record<string, any> = {};
      for (const property in queryParams) {
        if (
          queryParams[property] !== undefined &&
          queryParams[property] !== null
        ) {
          cleanParams[property] = queryParams[property];
        }
      }

      console.log("Fetching students with params:", cleanParams);

      // Здесь будет реальный API вызов
      // const response = await fetch(`/api/students?${new URLSearchParams(cleanParams)}`, {
      //   headers: {
      //     'X-Requested-Fields': fields.join(',')
      //   }
      // });
      // const data = await response.json();

      // Пока используем мок-данные
      let mockStudents: StudentList = mockObj.apiStudents.entities
        .data as unknown as StudentList;

      // Эмулируем сортировку и фильтрацию на клиенте для демонстрации
      if (filter.query) {
        mockStudents = mockStudents.filter(
          (student) =>
            student.user.firstname
              ?.toLowerCase()
              .includes(filter.query!.toLowerCase()) ||
            student.user.lastname
              ?.toLowerCase()
              .includes(filter.query!.toLowerCase())
        );
      }

      // Эмулируем сортировку
      if (sortBy === "lastname") {
        mockStudents = [...mockStudents].sort((a, b) =>
          (a.user.lastname || "").localeCompare(b.user.lastname || "")
        );
      } else if (sortBy === "results") {
        mockStudents = [...mockStudents].sort(
          (a, b) => (b.points || 0) - (a.points || 0)
        );
      }
      setStudents(mockObj.apiStudents.entities.data);
      onLoaded?.(mockStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [
    fetching,
    currentPage,
    filter,
    sortBy,
    params,
    fields,
    onLoading,
    onLoaded,
  ]);

  // Watch params (как в Vue)
  useEffect(() => {
    onFilterUpdate?.();
    setCurrentPage(1);
    onPageChange?.(1);

    if (filterInterval) {
      clearTimeout(filterInterval);
    }

    const timer = setTimeout(() => {
      fetchStudents();
    }, 1000);

    setFilterInterval(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [params, onFilterUpdate, onPageChange, fetchStudents]); // Добавил fetchStudents

  // Watch filter (как в Vue) - теперь включает sortBy
  useEffect(() => {
    onFilterUpdate?.();
    setCurrentPage(1);
    onPageChange?.(1);

    if (filterInterval) {
      clearTimeout(filterInterval);
    }

    const timer = setTimeout(() => {
      fetchStudents();
    }, 1000);

    setFilterInterval(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [filter, sortBy, onFilterUpdate, onPageChange, fetchStudents]); // Добавил sortBy и fetchStudents

  // Watch page (как в Vue)
  useEffect(() => {
    setCurrentPage(page);
    fetchStudents();
  }, [page, fetchStudents]); // Добавил fetchStudents

  // Initial fetch
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]); // Добавил fetchStudents

  const handleFilterChange = useCallback(
    <K extends keyof StudentFilter>(key: K, value: StudentFilter[K]) => {
      setFilter((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Обработчик изменения сортировки
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  return (
    <div className="student-filter-component">
      <div className="student-filter-toolbar grid grid-cols-12 gap-2 mb-4">
        {/* SEARCH QUERY - 8 колонок */}
        <div className="toolbar-item col-span-8">
          <Input
            value={filter.query || ""}
            onChange={(e) =>
              handleFilterChange("query", e.target.value || null)
            }
            placeholder="Имя / Email / Номер телефона"
            className="w-full"
          />
        </div>

        {/* PER PAGE - 2 колонки */}
        {perPageOptions.length > 0 && (
          <div className="toolbar-item col-span-2">
            <Select
              value={filter.limit.toString()}
              onValueChange={(value) =>
                handleFilterChange("limit", parseInt(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="На странице" />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* SORT BY - 2 колонки */}
        <div className="toolbar-item col-span-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Сортировать по" />
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
      </div>

      {/* Default slot - передаем студентов и фильтр */}
      {children({ students, filter })}
    </div>
  );
};

export default StudentFilterComponent;
