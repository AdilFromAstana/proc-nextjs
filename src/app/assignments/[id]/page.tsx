import { notFound } from "next/navigation";
import AssignmentPage from "./components/AssignmentPage";

// Серверная функция для получения данных задания
async function getAssignment(id: string): Promise<any> {
  try {
    // Здесь должен быть реальный API вызов
    // const response = await fetch(`/api/assignments/${id}`);
    // const data = await response.json();

    // Пока используем моковые данные - только данные, без функций
    const mockAssignment = {
      id,
      name: `Задание ${id}`,
      type: "quiz",
      status: "process",
      progress: { total: 75 },
      class: null,
      product: null,
      product_id: null,
      // Не передаем функции!
    };

    return mockAssignment;
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return null;
  }
}

export default async function AssignmentViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Используем await для получения параметров в Next.js 15+
  const { id } = await params;
  const assignment = await getAssignment(id);

  if (!assignment) {
    notFound();
  }

  // Передаем только данные, без функций
  return <AssignmentPage />;
}
