// components/client-page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AssignmentListComponent from "@/components/Assignment/ListComponent";
import PaginateComponent from "@/components/Pagination/PaginateComponent";
import { useAssignments } from "@/api/assignmentQuery";
import { Assignment } from "@/types/assignment";
import { useTranslations } from "next-intl";

// ✅ 1. ОБЪЯВИ ИНТЕРФЕЙС ПРОПСОВ
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
}

// ✅ 2. УКАЖИ ТИП ПРОПСОВ В КОМПОНЕНТЕ
export default function AssignmentsClientPage({
  initialData,
}: ClientPageProps) {
  const t = useTranslations();

  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ 3. Используем initialData для инициализации состояния
  const [postData, setPostData] = useState({
    page: initialData.initialPage,
    type: initialData.initialType,
    orderBy: initialData.initialOrderBy,
    query: initialData.initialQuery,
    status: initialData.initialStatus,
  });

  // ✅ 4. Синхронизация с URL (если пользователь изменил URL вручную)
  useEffect(() => {
    const query = searchParams.get("query") || null;
    const status = searchParams.get("status") || null;
    const type = searchParams.get("type") || "all";
    const orderBy = searchParams.get("orderBy") || "desc";
    const pageParam = parseInt(searchParams.get("page") || "1");

    setPostData((prev) => {
      // Не обновляем, если значения не изменились
      if (
        prev.page === pageParam &&
        prev.type === type &&
        prev.orderBy === orderBy &&
        prev.query === query &&
        prev.status === status
      ) {
        return prev;
      }

      return {
        page: pageParam,
        type,
        orderBy,
        query,
        status,
      };
    });
  }, [searchParams]);

  // ✅ 5. Запрос через React Query
  const { data, isLoading, isError } = useAssignments(postData);

  if (isError) {
    return <div className="p-4 text-red-500">Ошибка загрузки заданий</div>;
  }

  const entities = data?.entities?.data || [];
  const totalPages = data?.entities?.last_page || 1;

  const handleQueryChange = (value: string) => {
    setPostData((prev) => ({ ...prev, query: value || null, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setPostData((prev) => ({
      ...prev,
      status: value === "all" ? null : value,
      page: 1,
    }));
  };

  const handleTypeChange = (value: string) => {
    setPostData((prev) => ({
      ...prev,
      type: value === "all" ? "all" : value,
      page: 1,
    }));
  };

  const handleOrderChange = (value: string) => {
    setPostData((prev) => ({ ...prev, orderBy: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPostData((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-4 sm:p-8 w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Button
          className="w-full md:w-auto"
          onClick={() => router.push("/assignments/create")}
        >
          + {t("btn-create")}
        </Button>

        <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder={t("placeholder-query")}
            value={postData.query || ""}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="bg-white"
          />

          <Select
            value={postData.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="bg-white w-full">
              {postData.status ? (
                <SelectValue placeholder={postData.status} />
              ) : (
                <>{t("placeholder-status")}</>
              )}
            </SelectTrigger>
            <SelectContent>
              {[
                { id: "process", name: t("label-assignment-process") },
                { id: "completed", name: t("label-assignment-completed") },
                { id: "remaining", name: t("label-assignment-remaining") },
                { id: "suspended", name: t("label-assignment-suspended") },
              ].map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={postData.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="bg-white w-full">
              <SelectValue placeholder={postData.type} />
            </SelectTrigger>
            <SelectContent>
              {[
                { id: "all", name: t("option-all-assessments") },
                { id: "lessons", name: t("option-only-lessons") },
                { id: "quiz", name: t("option-only-quiz") },
              ].map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={postData.orderBy} onValueChange={handleOrderChange}>
            <SelectTrigger className="bg-white w-full">
              <SelectValue placeholder={postData.orderBy} />
            </SelectTrigger>
            <SelectContent>
              {[
                { id: "desc", name: t("option-before-new") },
                { id: "asc", name: t("option-before-old") },
              ].map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-0 mb-8">
        <AssignmentListComponent
          assignments={entities}
          page={postData.page}
          pagination={true}
          loadingPlaceholderCount={10}
          loading={isLoading}
          onPaged={handlePageChange}
        />
      </div>

      {totalPages > 1 && (
        <div className="mb-8">
          <PaginateComponent
            pageCount={totalPages}
            value={postData.page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
