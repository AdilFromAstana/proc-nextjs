import { useState, useEffect } from "react";

// Типы для enum'ов
interface AssignmentType {
  id: string | number;
  name: string;
  // другие поля
}

// Хук для работы с типами заданий
export const useAssignmentTypes = () => {
  const [types, setTypes] = useState<AssignmentType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      // Здесь твой API вызов
      const response = await fetch("/api/assignment-types");
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching assignment types:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (typeId: string | number) => {
    const type = types.find((t) => t.id === typeId);
    return type ? type.name : "";
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return {
    types,
    loading,
    getTypeName,
    refresh: fetchTypes,
  };
};

// Аналогично для других enum'ов
export const useAssignmentStatuses = () => {
  // ... аналогичная реализация
};
