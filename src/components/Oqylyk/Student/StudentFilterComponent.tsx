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
import { SortOption, StudentList } from "@/types/assignment";
import { useAssignmentStudents } from "@/hooks/useAssignmentStudents";
import { useTranslations } from "next-intl";

interface StudentFilterComponentProps {
  assignmentId: number;
  chunks?: number[];
  children: (props: {
    students: StudentList;
    filter: any;
    isLoading: boolean;
    isError: boolean;
  }) => React.ReactNode;
  onPageChange?: (page: number) => void;
}

interface StudentFilter {
  limit: number;
  query: string | null;
}

const StudentFilterComponent: React.FC<StudentFilterComponentProps> = ({
  assignmentId,
  chunks = [10, 20, 50, 100],
  children,
  onPageChange,
}) => {
  const t = useTranslations();

  const [sortBy, setSortBy] = useState<string>("lastname");
  const [filter, setFilter] = useState<StudentFilter>({
    limit: chunks[0],
    query: null,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: studentsData,
    isLoading,
    isError,
    refetch,
  } = useAssignmentStudents(
    assignmentId,
    currentPage,
    filter.limit,
    sortBy,
    filter.query
  );

  const studentSortByOptions: SortOption[] = [
    { id: "lastname", name: t("option-sort-by-lastname") },
    { id: "results", name: t("option-sort-by-results") },
    { id: "credibility", name: t("option-sort-by-credibility") },
  ];

  // Преобразуем AssignmentStudent[] в StudentList (Student[])
  const students = useMemo<StudentList>(() => {
    const assignmentStudents = studentsData?.entities?.data || [];

    // Преобразуем каждый AssignmentStudent в Student
    return assignmentStudents.map((student) => ({
      ...student,
      user: {
        ...student.user,
        // Преобразуем null в undefined для фото
        photo: student.user.photo === null ? undefined : student.user.photo,
      },
    })) as StudentList;
  }, [studentsData]);

  const perPageOptions = useMemo(() => {
    return chunks.map((count) => ({
      id: count,
      name: `${t("option-per-page-students", { count: count })}`,
    }));
  }, [chunks]);

  const handleFilterChange = useCallback(
    <K extends keyof StudentFilter>(key: K, value: StudentFilter[K]) => {
      setFilter((prev) => ({
        ...prev,
        [key]: value,
      }));
      setCurrentPage(1);
      onPageChange?.(1);
    },
    [onPageChange]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value);
      setCurrentPage(1);
      onPageChange?.(1);
    },
    [onPageChange]
  );

  useEffect(() => {
    refetch();
  }, [filter, sortBy, refetch]);

  return (
    <div className="student-filter-component">
      <div className="student-filter-toolbar grid grid-cols-12 gap-2 mb-4">
        <div className="toolbar-item col-span-8">
          <Input
            value={filter.query || ""}
            onChange={(e) =>
              handleFilterChange("query", e.target.value || null)
            }
            placeholder={t("placeholder-query")}
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

      {children({
        students,
        filter,
        isLoading,
        isError,
      })}
    </div>
  );
};

export default StudentFilterComponent;
