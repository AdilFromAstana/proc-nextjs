// src/types/class.ts

export interface Class {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  studentCount: number;
  teacherCount: number;
  status: "active" | "archived";
}

export interface CreateClassData {
  name: string;
  description: string;
  status: "active" | "archived";
}

export interface UpdateClassData extends Partial<CreateClassData> {}

// Тип для ответа API с пагинацией
export interface ClassesResponse {
  classes: Class[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}
