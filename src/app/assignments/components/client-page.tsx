"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// shadcn-ui компоненты
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Кастомные компоненты
import AssignmentListComponent, {
  AssignmentListRef,
} from "@/components/Assignment/ListComponent";
import PaginateComponent from "@/components/Pagination/PaginateComponent";
import AssignmentExportModalComponent, {
  AssignmentExportModalRef,
} from "@/components/Assignment/ExportModalComponent";

// Типы
import { Assignment, mockAssignments } from "@/types/assignment";

interface ClientPageProps {
  initialData: {
    initialAssignments: Assignment[];
    initialTotalPages: number;
    initialPage: number;
    initialQuery: string | null;
    initialStatus: string | null;
    initialType: string;
    initialOrderBy: string;
  };
  sortTypeOptions: { id: string; name: string }[];
  sortOrderOptions: { id: string; name: string }[];
  sortStatusOptions: { id: string; name: string }[];
}

export default function AssignmentsClientPage({
  initialData,
  sortTypeOptions,
  sortOrderOptions,
  sortStatusOptions,
}: ClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Refs
  const assignmentListRef = useRef<AssignmentListRef>(null);
  const exportModalRef = useRef<AssignmentExportModalRef>(null);

  // Состояния (только на клиенте)
  const [entities, setEntities] = useState<Assignment[]>(
    initialData.initialAssignments
  );
  const [page, setPage] = useState(initialData.initialPage);
  const [totalPages, setTotalPages] = useState(initialData.initialTotalPages);

  const [postData, setPostData] = useState({
    page: initialData.initialPage,
    type: initialData.initialType,
    date: null as null | string,
    orderBy: initialData.initialOrderBy,
    query: initialData.initialQuery,
    status: initialData.initialStatus,
    webinar: null as null | string,
    proctoring: null as null | string,
  });

  // Парсим параметры из URL (клиентская часть)
  useEffect(() => {
    const query = searchParams.get("query") || null;
    const status = searchParams.get("status") || null;
    const type = searchParams.get("type") || "all";
    const orderBy = searchParams.get("orderBy") || "desc";
    const pageParam = parseInt(searchParams.get("page") || "1");

    setPostData({
      page: pageParam,
      type,
      date: null,
      orderBy,
      query,
      status,
      webinar: null,
      proctoring: null,
    });

    setPage(pageParam);
  }, [searchParams]);

  // Загрузка данных при изменении postData (клиентская часть)
  useEffect(() => {
    fetchAssignments();
  }, [postData]);

  // Функция загрузки заданий (клиентская часть)
  const fetchAssignments = async () => {
    try {
      // Показываем loader
      assignmentListRef.current?.showLoader();

      // Здесь должен быть реальный API вызов
      const mockData: Assignment[] = mockAssignments; // Используем мок данные

      // Симуляция API вызова
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEntities(mockData);
      setTotalPages(5); // Mock значение

      // Обновляем URL
      const urlParams = new URLSearchParams();
      Object.keys(postData).forEach((key) => {
        const value = postData[key as keyof typeof postData];
        if (value !== undefined && value !== null && value !== "all") {
          urlParams.append(key, String(value));
        }
      });

      const newUrl = `/assignments?${urlParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      assignmentListRef.current?.hideLoader();
    }
  };

  // Обработчики изменений (клиентская часть)
  const handleQueryChange = (value: string) => {
    setPostData((prev) => ({ ...prev, query: value || null, page: 1 }));
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setPostData((prev) => ({
      ...prev,
      status: value === "all" ? null : value,
      page: 1,
    }));
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setPostData((prev) => ({
      ...prev,
      type: value === "all" ? "all" : value,
      page: 1,
    }));
    setPage(1);
  };

  const handleOrderChange = (value: string) => {
    setPostData((prev) => ({ ...prev, orderBy: value, page: 1 }));
    setPage(1);
  };

  // Обработчик пагинации (клиентская часть)
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setPostData((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-4 sm:p-8 w-full">
      {/* HEADER WITH FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* CREATE BUTTON */}
        <div className="w-full md:w-auto">
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/assignments/create")}
          >
            + Создать
          </Button>
        </div>

        {/* FILTERS */}
        <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <Input
              placeholder="Поиск..."
              value={postData.query || ""}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="bg-white"
            />
          </div>

          <div>
            <Select
              value={postData.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {sortStatusOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={postData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                {sortTypeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={postData.orderBy} onValueChange={handleOrderChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                {sortOrderOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ASSIGNMENT LIST */}
      <div className="bg-white rounded-lg shadow-xl p-0 mb-8">
        <AssignmentListComponent
          ref={assignmentListRef}
          assignments={entities}
          page={page}
          pagination={true}
          loadingPlaceholderCount={10}
          onPaged={(newPage) => {
            setPage(newPage);
            setPostData((prev) => ({ ...prev, page: newPage }));
          }}
        />
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mb-8">
          <PaginateComponent
            pageCount={totalPages}
            value={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* EXPORT MODAL */}
      <AssignmentExportModalComponent ref={exportModalRef} />
    </div>
  );
}
