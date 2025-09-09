import { useState, useEffect } from "react";
import { Assignment } from "@/types/assignment";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface UseAssignmentsReturn {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  totalPages: number;
  fetchAssignments: (params?: Record<string, any>) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAssignments = (): UseAssignmentsReturn => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchAssignments = async (params: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Здесь будет реальный API вызов
      // const response = await fetch('/api/assignments', {
      //   method: 'GET',
      //   params: params
      // });
      // const data = await response.json();

      // Пока используем моковые данные
      const mockData: Assignment[] = [
        {
          id: 1,
          name: "Математика - Алгебра",
          type: "quiz",
          status: "process",
          progress: { total: 75 },
          class: { id: 1, name: "10 класс" },
          product: null,
          product_id: null,
          getName: function () {
            return this.name;
          },
          getClassName: function () {
            return this.class?.name || "";
          },
          isPrepaidAccessType: function () {
            return false;
          },
        },
        {
          id: 2,
          name: "Физика - Механика",
          type: "lessons",
          status: "completed",
          progress: { total: 100 },
          class: { id: 1, name: "10 класс" },
          product: null,
          product_id: null,
          getName: function () {
            return this.name;
          },
          getClassName: function () {
            return this.class?.name || "";
          },
          isPrepaidAccessType: function () {
            return false;
          },
        },
      ];

      // Симуляция API вызова
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Обновляем данные
      setAssignments(mockData);
      setPagination({
        currentPage: params.page || 1,
        totalPages: 5, // Моковое значение
        totalItems: 25, // Моковое значение
        itemsPerPage: 10,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка загрузки заданий";
      setError(errorMessage);
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchAssignments({ page: pagination.currentPage });
  };

  return {
    assignments,
    loading,
    error,
    pagination,
    totalPages: pagination.totalPages,
    fetchAssignments,
    refresh,
  };
};
