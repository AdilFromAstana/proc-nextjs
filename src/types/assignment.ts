// Данные задания (для передачи от сервера к клиенту)
export interface AssignmentData {
  id: number | string;
  name: string;
  type: string;
  status: string;
  progress: AssignmentProgress | null;
  class: AssignmentClass | null;
  product: AssignmentProduct | null;
  product_id: number | string | null;
  // Не включаем методы!
}

// Интерфейсы для вложенных объектов
export interface AssignmentProgress {
  total: number;
  // другие поля прогресса, если есть
}

export interface AssignmentClass {
  id: number | string;
  name: string;
  // другие поля класса
}

export interface AssignmentProduct {
  id: number | string;
  name: string;
  isAcquired: () => boolean;
  // другие поля продукта
}

// Полный интерфейс с методами (только для клиентских компонентов)
export interface Assignment extends AssignmentData {
  // Методы как поля-функции
  getName: () => string;
  getClassName: () => string;
  isPrepaidAccessType: () => boolean;
  isLessonType: () => boolean;
  isQuizType: () => boolean;
  isExternalType: () => boolean;
  isSuspendedStatus: () => boolean;
  isProcessStatus: () => boolean;
  isCompletedStatus: () => boolean;
  isProctoringEnabled: () => boolean;
  isWebinarEnabled: () => boolean;
}

export const mockAssignments: Assignment[] = [
  {
    id: 1,
    name: "Математический анализ",
    type: "lesson",
    status: "process",
    progress: {
      total: 15,
    },
    class: {
      id: 101,
      name: "Математика 101",
    },
    product: {
      id: 201,
      name: "Учебник по математике",
      isAcquired: () => true,
    },
    product_id: 201,

    // Методы
    getName: () => "Математический анализ",
    getClassName: () => "Математика 101",
    isPrepaidAccessType: () => true,
    isLessonType: () => true,
    isQuizType: () => false,
    isExternalType: () => false,
    isSuspendedStatus: () => false,
    isProcessStatus: () => true,
    isCompletedStatus: () => false,
    isProctoringEnabled: () => false,
    isWebinarEnabled: () => true,
  },
  {
    id: 2,
    name: "Тест по физике",
    type: "quiz",
    status: "suspended",
    progress: {
      total: 8,
    },
    class: {
      id: 102,
      name: "Физика 201",
    },
    product: {
      id: 202,
      name: "Тестовые задания",
      isAcquired: () => false,
    },
    product_id: 202,

    // Методы
    getName: () => "Тест по физике",
    getClassName: () => "Физика 201",
    isPrepaidAccessType: () => false,
    isLessonType: () => false,
    isQuizType: () => true,
    isExternalType: () => false,
    isSuspendedStatus: () => true,
    isProcessStatus: () => false,
    isCompletedStatus: () => false,
    isProctoringEnabled: () => true,
    isWebinarEnabled: () => false,
  },
  {
    id: 3,
    name: "Внешний вебинар",
    type: "external",
    status: "completed",
    progress: {
      total: 10,
    },
    class: {
      id: 103,
      name: "Программирование",
    },
    product: {
      id: 203,
      name: "Вебинар по программированию",
      isAcquired: () => true,
    },
    product_id: 203,

    // Методы
    getName: () => "Внешний вебинар",
    getClassName: () => "Программирование",
    isPrepaidAccessType: () => true,
    isLessonType: () => false,
    isQuizType: () => false,
    isExternalType: () => true,
    isSuspendedStatus: () => false,
    isProcessStatus: () => false,
    isCompletedStatus: () => true,
    isProctoringEnabled: () => false,
    isWebinarEnabled: () => true,
  },
  {
    id: 4,
    name: "Лабораторная работа",
    type: "lesson",
    status: "process",
    progress: {
      total: 25,
    },
    class: {
      id: 104,
      name: "Химия 301",
    },
    product: {
      id: 204,
      name: "Лабораторный практикум",
      isAcquired: () => true,
    },
    product_id: 204,

    // Методы
    getName: () => "Лабораторная работа",
    getClassName: () => "Химия 301",
    isPrepaidAccessType: () => false,
    isLessonType: () => true,
    isQuizType: () => false,
    isExternalType: () => false,
    isSuspendedStatus: () => false,
    isProcessStatus: () => true,
    isCompletedStatus: () => false,
    isProctoringEnabled: () => true,
    isWebinarEnabled: () => false,
  },
  {
    id: 5,
    name: "Финальный экзамен",
    type: "quiz",
    status: "process",
    progress: {
      total: 1,
    },
    class: {
      id: 105,
      name: "История России",
    },
    product: {
      id: 205,
      name: "Экзаменационные материалы",
      isAcquired: () => false,
    },
    product_id: 205,

    // Методы
    getName: () => "Финальный экзамен",
    getClassName: () => "История России",
    isPrepaidAccessType: () => true,
    isLessonType: () => false,
    isQuizType: () => true,
    isExternalType: () => false,
    isSuspendedStatus: () => false,
    isProcessStatus: () => true,
    isCompletedStatus: () => false,
    isProctoringEnabled: () => true,
    isWebinarEnabled: () => false,
  },
];
