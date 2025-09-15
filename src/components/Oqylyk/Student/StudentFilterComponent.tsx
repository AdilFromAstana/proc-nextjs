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
  // ✅ 1. ВСЕ useState — в самом начале
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

  // ✅ 2. ВСЕ useMemo — сразу после useState
  const perPageOptions = useMemo(() => {
    if (!chunks || chunks.length <= 0) {
      return [];
    }

    return chunks.map((count) => ({
      id: count,
      name: `${count} студентов`,
    }));
  }, [chunks]);

  // ✅ 3. ВСЕ useCallback — сразу после useMemo
  const fetchStudents = useCallback(async () => {
    if (!fetching) {
      return;
    }

    onLoading?.();

    try {
      const queryParams: Record<string, any> = {
        page: currentPage,
        limit: filter.limit,
        sortBy: sortBy,
        ...(filter.query ? { query: filter.query } : {}),
        ...params,
      };

      const cleanParams: Record<string, any> = {};
      for (const property in queryParams) {
        if (
          queryParams[property] !== undefined &&
          queryParams[property] !== null
        ) {
          cleanParams[property] = queryParams[property];
        }
      }

      let mockStudents: StudentList = mockObj.apiStudents.entities
        .data as unknown as StudentList;

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

      if (sortBy === "lastname") {
        mockStudents = [...mockStudents].sort((a, b) =>
          (a.user.lastname || "").localeCompare(b.user.lastname || "")
        );
      } else if (sortBy === "results") {
        mockStudents = [...mockStudents].sort(
          (a, b) => (b.points || 0) - (a.points || 0)
        );
      }

      setStudents(mockStudents); // ✅ Исправлено: устанавливался мок вместо отфильтрованных данных
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

  const handleFilterChange = useCallback(
    <K extends keyof StudentFilter>(key: K, value: StudentFilter[K]) => {
      setFilter((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  // ✅ 4. ВСЕ useEffect — сразу после useCallback
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
  }, [params, onFilterUpdate, onPageChange, fetchStudents]);

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
  }, [filter, sortBy, onFilterUpdate, onPageChange, fetchStudents]);

  useEffect(() => {
    setCurrentPage(page);
    fetchStudents();
  }, [page, fetchStudents]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  console.log("students: ", students);

  // ✅ 5. Только СЕЙЧАС — после всех хуков — можно рендерить JSX
  return (
    <div className="student-filter-component">
      <div className="student-filter-toolbar grid grid-cols-12 gap-2 mb-4">
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

      {children({ students, filter })}
    </div>
  );
};

export default StudentFilterComponent;
