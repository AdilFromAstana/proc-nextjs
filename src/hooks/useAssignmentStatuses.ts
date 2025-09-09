import { useState, useEffect } from "react";

interface AssignmentStatus {
  id: string | number;
  name: string;
  // другие поля если есть (цвет, иконка и т.д.)
}

export const useAssignmentStatuses = () => {
  const [statuses, setStatuses] = useState<AssignmentStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      // Замени на реальный API endpoint из твоего Vue проекта
      const response = await fetch("/api/assignment-statuses");
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error("Error fetching assignment statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusName = (statusId: string | number) => {
    const status = statuses.find((s) => s.id === statusId);
    return status ? status.name : "";
  };

  const getStatusById = (statusId: string | number) => {
    return statuses.find((s) => s.id === statusId);
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  return {
    statuses,
    loading,
    getStatusName,
    getStatusById,
    refresh: fetchStatuses,
  };
};
