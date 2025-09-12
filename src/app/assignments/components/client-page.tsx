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

import { Assignment } from "@/types/assignment";
import IdentificationList from "@/components/Oqylyk/Assignment/Student/IdentificationList";
import TimeStatesComponent from "@/components/Oqylyk/Assignment/Student/TimeStatesComponent";
import QuizResultListComponent from "@/components/Oqylyk/Assignment/Student/QuizResultList";
import VideoSessionListComponent from "@/components/Oqylyk/Assignment/Student/VideoSessionList";
import CreateViolationModal from "@/components/Oqylyk/Assignment/Student/CreateViolationModal";
import VideoModalViewerComponent from "@/components/Oqylyk/Assignment/Student/VideoModalViewerComponent";
import AssignmentViolationsComponent from "@/components/Oqylyk/Assignment/Student/ViolationsComponent";
import AssignmentActions from "@/components/Oqylyk/Assignment/Student/ActionsComponent";
import AssignmentCommentBlockComponent from "@/components/Oqylyk/Assignment/CommentBlockComponent";

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
  const [open, setOpen] = useState(false);

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
      const mockData: Assignment[] = []; // Используем мок данные

      // Симуляция API вызова
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEntities(mockData);
      setTotalPages(1); // Mock значение

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
          <Input
            placeholder="Поиск..."
            value={postData.query || ""}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="bg-white"
          />

          <Select
            value={postData.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="bg-white w-full">
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

          <Select value={postData.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="bg-white w-full">
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

          <Select value={postData.orderBy} onValueChange={handleOrderChange}>
            <SelectTrigger className="bg-white w-full">
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

      <AssignmentCommentBlockComponent
        viewer="owner"
        assignment={{
          id: 123,
          isProcessStatus: () => true,
        }}
        student={{
          id: 1,
          firstname: "Иван",
          lastname: "Иванов",
          photo: "https://placehold.co/100x100/3b82f6/FFFFFF?text=ИИ",
          getFullName: function () {
            return `Иван Иванов`;
          },
          getFirstName: function () {
            return "Иван ";
          },
        }}
        component={{
          id: 456,
          component_type: "FreeQuestionComponent",
        }}
        result={{
          id: 789,
          assignment_result_id: 101,
        }}
        disabled={false}
      />
      {/* <AssignmentActions /> */}

      {/* <DonutChart />
      <ResultChartComponent
        results={{
          data: [
            { result: 3 },
            { result: 3 },
            { result: 3 },
            { result: 3 },
            { result: 3 },
          ],
          length: 5,
          getPoints: () => 25,
          map: function (callback) {
            this.data.forEach(callback);
          },
        }}
      /> */}
      {/* <IdentificationList
        identities={{
          models: [
            // Single photo
            {
              id: 1,
              screenshot:
                "https://faces.object.pscloud.io/faces/2025/09/10/07c9bedc0309a8d43d2166d6660e7005.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2COPHSOSEG4LBR8CEGWK%2F20250910%2Fkz-ala-1%2Fs3%2Faws4_request&X-Amz-Date=20250910T071215Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=0d47774fdb7ba5489e71a850c24df9a5c958eb73441dbab38e3f304582f563c5",
              getTime: () => "10:30:15",
            },
            // Series photos
            {
              id: 2,
              screenshots: [
                "https://assignments.object.pscloud.io/assignments/2025/09/10/2afd0a76430f1da862d8b37c34c60c3a.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2COPHSOSEG4LBR8CEGWK%2F20250910%2Fkz-ala-1%2Fs3%2Faws4_request&X-Amz-Date=20250910T071215Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=19500f0e2f3679ef15d5e29f5e643364a2cbce8e40b2b9cd973308cccb7a7280",
                "https://assignments.object.pscloud.io/assignments/2025/09/10/50fd2a6db3966dd803449b251e19131f.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2COPHSOSEG4LBR8CEGWK%2F20250910%2Fkz-ala-1%2Fs3%2Faws4_request&X-Amz-Date=20250910T071215Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=05bb1befc830eb09dffd46da2b0c2b99c6a8b8aec6fa9afa592fad61e8818aa5",
                "https://assignments.object.pscloud.io/assignments/2025/09/10/77383e3b56b58203462a2074840c0f28.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2COPHSOSEG4LBR8CEGWK%2F20250910%2Fkz-ala-1%2Fs3%2Faws4_request&X-Amz-Date=20250910T071215Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=11d96dfb8f8e3c6dc6100e16f262ab990f679e88185500490bb20f8dac876356",
              ],
              getTime: () => "11:45:30",
            },
            // Single photo again
            {
              id: 3,
              screenshot:
                "https://faces.object.pscloud.io/faces/2025/09/09/83847b6fe60a10e869a5966d18527d6a.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2COPHSOSEG4LBR8CEGWK%2F20250910%2Fkz-ala-1%2Fs3%2Faws4_request&X-Amz-Date=20250910T071215Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=37e07501a309f6ed549c3feaf15e0a4e9e9c3b0668f085c2089790ce7f94ff9f",
              getTime: () => "12:15:45",
            },
            // Series photos with more images
            {
              id: 4,
              getTime: () => "14:05:25",
            },
          ],
        }}
      /> */}

      {/* <AssignmentStudentCertificateComponent {...mockComplexCertificateData} /> */}
      {/* 
      <QuizResultListComponent
        {...{
          assignment: mockAssignment,
          student: mockStudent,
          assessments: null, // будет брать из assignment
          attempt: mockAttempt,
          components: mockComponents,
          results: mockResults,
          disabled: false,
          viewer: "owner",
        }}
      />

      <VideoSessionListComponent
        assignment={mockAssignment}
        student={mockStudent}
        onSelected={(group) => console.log("Selected group:", group)}
      /> */}

      {/* <Button onClick={() => setOpen(true)}>Открыть модальное окно</Button>

      <CreateViolationModal
        assignment={mockAssignment}
        student={mockStudent}
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log("Создано нарушение:", data);
          setOpen(false);
        }}
      /> */}

      {/* <VideoModalViewerComponent /> */}
      <AssignmentViolationsComponent />

      <TimeStatesComponent
        {...{
          assignment: {
            id: 124,
          },
          student: {
            id: 457,
          },
          available_time: 0,
          is_started: true,
          is_finished: true,
        }}
      />

      {/* EXPORT MODAL */}
      <AssignmentExportModalComponent ref={exportModalRef} />
    </div>
  );
}
