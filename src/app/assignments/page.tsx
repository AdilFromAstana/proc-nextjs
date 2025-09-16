import AssignmentsClientPage from "./components/client-page";

// Серверная функция для получения начальных данных
async function getInitialData(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Здесь будет реальный API вызов
  const mockAssignments: never[] = [];
  const mockTotalPages = 1;

  // ✅ Используем await для searchParams
  const params = await searchParams;

  return {
    initialAssignments: mockAssignments,
    initialTotalPages: mockTotalPages,
    initialPage: parseInt(params.page as string) || 1,
    initialQuery: (params.query as string) || null,
    initialStatus: (params.status as string) || null,
    initialType: (params.type as string) || "all",
    initialOrderBy: (params.orderBy as string) || "desc",
  };
}

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // ✅ Используем await
  const initialData = await getInitialData(searchParams);

  return <AssignmentsClientPage initialData={initialData} />;
}
