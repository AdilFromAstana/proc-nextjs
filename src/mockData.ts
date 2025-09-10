import { Class } from "./types/groups";

export type NewsItem = {
  id: number;
  title: string;
  description: string;
  image?: string;
  createdAt?: string;
};

export type TaskItem = {
  id: number;
  title: string;
  type: "app" | "tray" | "web";
  status: "В процессе" | "В ожидании" | "Завершено";
  assignedStudents: number;
  totalStudents: number;
  startTime?: string;
  endTime?: string;
  duration?: string;
  trustRating?: number; // Рейтинг доверия от 0 до 100
};

export type LessonItem = {
  id: number;
  title: string;
  type: "common" | "my";
  duration: string;
  teacher: string;
  date: string;
  studentsCount?: number;
  maxStudents?: number;
  category?: string;
};

export type CourseStatus = "draft" | "published";
export type CourseType = "free" | "private" | "paid";
export type CourseItem = {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  status: CourseStatus;
  type: CourseType;
  createdAt: string;
  updatedAt: string;
  lessonsCount: number;
  studentsCount: number;
};

// mockData.ts
export const mockAssignment = {
  id: "assignment-123",
  title: "Test Assignment",
};

export const mockStudent = {
  id: "student-456",
  firstname: "Иван",
  lastname: "Иванов",
  email: "ivan@example.com",
};

export const mockAttempt = {
  id: "attempt-789",
  assignment_id: "assignment-123",
  student_id: "student-456",
  status: "active",
  state: "completed",
  variant: "1",
  points: 85,
  results: [],
};

export const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Открытие нового филиала компании",
    description:
      "Компания объявила об открытии нового филиала в центре города. В новом офисе будут работать более 50 специалистов, что значительно увеличит наши возможности по обслуживанию клиентов.",
    image: "https://picsum.photos/400/200?random=1",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Запуск инновационного продукта",
    description:
      "После нескольких месяцев разработки мы рады представить наш новый продукт, который революционизирует подход к решению повседневных задач. Первые отзывы пользователей уже превзошли все ожидания.",
    image: "https://picsum.photos/400/200?random=2",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    title: "Партнерство с международной компанией",
    description:
      "Мы подписали стратегическое партнерство с ведущей международной компанией в сфере технологий. Это сотрудничество откроет новые возможности для развития и расширения нашего присутствия на мировом рынке.",
    image: "https://picsum.photos/400/200?random=3",
    createdAt: "2024-01-10",
  },
  {
    id: 4,
    title: "Корпоративный чемпионат по спорту",
    description:
      "В этом году корпоративный чемпионат по спорту собрал рекордное количество участников. Соревнования прошли в трех номинациях, а победители получили ценные призы и памятные подарки от руководства компании.",
    image: "https://picsum.photos/400/200?random=4",
    createdAt: "2024-01-08",
  },
  {
    id: 5,
    title: "Открытие нового филиала компании",
    description:
      "Компания объявила об открытии нового филиала в центре города. В новом офисе будут работать более 50 специалистов, что значительно увеличит наши возможности по обслуживанию клиентов.",
    image: "https://picsum.photos/400/200?random=1",
    createdAt: "2024-01-15",
  },
  {
    id: 6,
    title: "Запуск инновационного продукта",
    description:
      "После нескольких месяцев разработки мы рады представить наш новый продукт, который революционизирует подход к решению повседневных задач. Первые отзывы пользователей уже превзошли все ожидания.",
    image: "https://picsum.photos/400/200?random=2",
    createdAt: "2024-01-12",
  },
  {
    id: 7,
    title: "Партнерство с международной компанией",
    description:
      "Мы подписали стратегическое партнерство с ведущей международной компанией в сфере технологий. Это сотрудничество откроет новые возможности для развития и расширения нашего присутствия на мировом рынке.",
    image: "https://picsum.photos/400/200?random=3",
    createdAt: "2024-01-10",
  },
  {
    id: 8,
    title: "Корпоративный чемпионат по спорту",
    description:
      "В этом году корпоративный чемпионат по спорту собрал рекордное количество участников. Соревнования прошли в трех номинациях, а победители получили ценные призы и памятные подарки от руководства компании.",
    image: "https://picsum.photos/400/200?random=4",
    createdAt: "2024-01-08",
  },
];

export const mockTasks: TaskItem[] = [
  {
    id: 1,
    title: "Физика - Контрольная работа по термодинамике",
    type: "web",
    status: "В процессе",
    assignedStudents: 28,
    totalStudents: 32,
    startTime: "2024-01-20T09:00:00",
    duration: "1.5 часа",
    trustRating: 87,
  },
  {
    id: 2,
    title: "Химия - Лабораторная работа по органике",
    type: "app",
    status: "В ожидании",
    assignedStudents: 0,
    totalStudents: 25,
    startTime: "2024-01-25T14:00:00",
    duration: "3 часа",
    trustRating: 91,
  },
  {
    id: 3,
    title: "История - Экзамен по новой истории",
    type: "tray",
    status: "Завершено",
    assignedStudents: 42,
    totalStudents: 42,
    startTime: "2024-01-15T10:00:00",
    endTime: "2024-01-15T12:30:00",
    duration: "2.5 часа",
    trustRating: 76,
  },
  {
    id: 4,
    title: "Литература - Тест по русской классике",
    type: "web",
    status: "В процессе",
    assignedStudents: 35,
    totalStudents: 38,
    startTime: "2024-01-18T11:30:00",
    duration: "1 час",
    trustRating: 82,
  },
  {
    id: 5,
    title: "Биология - Практическая по генетике",
    type: "app",
    status: "В ожидании",
    assignedStudents: 0,
    totalStudents: 30,
    startTime: "2024-01-30T13:00:00",
    duration: "2 часа",
    trustRating: 89,
  },
  {
    id: 6,
    title: "География - Контрольная по климату",
    type: "tray",
    status: "Завершено",
    assignedStudents: 27,
    totalStudents: 27,
    startTime: "2024-01-12T09:00:00",
    endTime: "2024-01-12T10:30:00",
    duration: "1.5 часа",
    trustRating: 94,
  },
  {
    id: 7,
    title: "Информатика - Проект по базам данных",
    type: "app",
    status: "В процессе",
    assignedStudents: 22,
    totalStudents: 25,
    startTime: "2024-01-22T15:00:00",
    duration: "4 часа",
    trustRating: 73,
  },
  {
    id: 8,
    title: "Английский язык - Оральный экзамен",
    type: "web",
    status: "В ожидании",
    assignedStudents: 0,
    totalStudents: 35,
    startTime: "2024-02-01T10:00:00",
    duration: "2.5 часа",
    trustRating: 85,
  },
];

export const mockLessons: LessonItem[] = [
  {
    id: 1,
    title: "Введение в React Hooks",
    type: "common",
    duration: "1 час 30 минут",
    teacher: "Анна Петрова",
    date: "2024-01-15T10:00:00",
    studentsCount: 25,
    maxStudents: 30,
    category: "Frontend",
  },
  {
    id: 2,
    title: "Продвинутый TypeScript",
    type: "common",
    duration: "2 часа",
    teacher: "Иван Сидоров",
    date: "2024-01-16T14:00:00",
    studentsCount: 18,
    maxStudents: 25,
    category: "Frontend",
  },
  {
    id: 3,
    title: "Архитектура React приложений",
    type: "my",
    duration: "1 час 45 минут",
    teacher: "Мария Иванова",
    date: "2024-01-17T09:30:00",
    studentsCount: 12,
    maxStudents: 20,
    category: "Architecture",
  },
  {
    id: 4,
    title: "Оптимизация производительности",
    type: "my",
    duration: "2 часа 15 минут",
    teacher: "Алексей Козлов",
    date: "2024-01-18T16:00:00",
    studentsCount: 8,
    maxStudents: 15,
    category: "Performance",
  },
  {
    id: 5,
    title: "Тестирование React компонентов",
    type: "common",
    duration: "1 час 20 минут",
    teacher: "Елена Смирнова",
    date: "2024-01-19T11:00:00",
    studentsCount: 22,
    maxStudents: 25,
    category: "Testing",
  },
];

export const mockCourses: CourseItem[] = [
  {
    id: 1,
    title: "React для начинающих",
    shortDescription: "Изучите основы React и создайте первые приложения",
    fullDescription:
      "Полный курс по React.js для новичков. Вы научитесь создавать компоненты, работать с состоянием, использовать hooks и строить реальные приложения.",
    imageUrl: "https://placehold.co/300x200/3b82f6/ffffff?text=React+Course",
    status: "published",
    type: "free",
    createdAt: "2024-01-10T10:00:00",
    updatedAt: "2024-01-15T14:30:00",
    lessonsCount: 15,
    studentsCount: 120,
  },
  {
    id: 2,
    title: "Продвинутый TypeScript",
    shortDescription: "Мастерство типизации и современные возможности языка",
    fullDescription:
      "Глубокое погружение в продвинутые возможности TypeScript: generics, условные типы, утилитарные типы и другие мощные инструменты для создания надежного кода.",
    imageUrl:
      "https://placehold.co/300x200/10b981/ffffff?text=TypeScript+Course",
    status: "published",
    type: "paid",
    createdAt: "2024-01-12T09:00:00",
    updatedAt: "2024-01-16T11:45:00",
    lessonsCount: 12,
    studentsCount: 45,
  },
  {
    id: 3,
    title: "Архитектура микросервисов",
    shortDescription: "Проектирование масштабируемых систем",
    fullDescription:
      "Курс по проектированию и реализации микросервисной архитектуры: принципы, паттерны, инструменты и лучшие практики для создания масштабируемых систем.",
    imageUrl:
      "https://placehold.co/300x200/f59e0b/ffffff?text=Microservices+Course",
    status: "draft",
    type: "private",
    createdAt: "2024-01-14T13:00:00",
    updatedAt: "2024-01-18T16:20:00",
    lessonsCount: 8,
    studentsCount: 0,
  },
  {
    id: 4,
    title: "Node.js и Express",
    shortDescription: "Создание серверных приложений на JavaScript",
    fullDescription:
      "Научитесь создавать серверные приложения на Node.js и Express. Изучите маршрутизацию, обработку запросов, работу с базами данных и создание REST API.",
    imageUrl: "https://placehold.co/300x200/8b5cf6/ffffff?text=Node.js+Course",
    status: "published",
    type: "free",
    createdAt: "2024-01-08T11:00:00",
    updatedAt: "2024-01-17T09:15:00",
    lessonsCount: 18,
    studentsCount: 98,
  },
  {
    id: 5,
    title: "GraphQL и Apollo",
    shortDescription: "Современный подход к API",
    fullDescription:
      "Изучите GraphQL - современный стандарт для API. Научитесь создавать серверы GraphQL, клиентские запросы, резолверы и использовать Apollo Client.",
    imageUrl: "https://placehold.co/300x200/ec4899/ffffff?text=GraphQL+Course",
    status: "published",
    type: "paid",
    createdAt: "2024-01-11T15:00:00",
    updatedAt: "2024-01-19T10:00:00",
    lessonsCount: 10,
    studentsCount: 32,
  },
  {
    id: 6,
    title: "Next.js для профессионалов",
    shortDescription: "Создание высокопроизводительных приложений",
    fullDescription:
      "Глубокое погружение в Next.js: SSR, SSG, ISR, оптимизация производительности, работа с маршрутизацией, стейт-менеджмент и другие продвинутые темы.",
    imageUrl: "https://placehold.co/300x200/06b6d4/ffffff?text=Next.js+Course",
    status: "draft",
    type: "private",
    createdAt: "2024-01-13T08:00:00",
    updatedAt: "2024-01-20T14:30:00",
    lessonsCount: 14,
    studentsCount: 0,
  },
  {
    id: 7,
    title: "Работа с базами данных",
    shortDescription: "SQL и NoSQL: сравнение и практическое применение",
    fullDescription:
      "Комплексный курс по работе с базами данных. Изучите SQL и NoSQL, сравнивайте их преимущества, выбирайте подходящий тип для задачи и применяйте на практике.",
    imageUrl: "https://placehold.co/300x200/ef4444/ffffff?text=Database+Course",
    status: "published",
    type: "free",
    createdAt: "2024-01-09T14:00:00",
    updatedAt: "2024-01-21T11:20:00",
    lessonsCount: 16,
    studentsCount: 76,
  },
];

export const mockClasses: Class[] = [
  {
    id: 1,
    name: "Математический анализ",
    description:
      "Изучение дифференциального и интегрального исчисления, пределов, рядов и их приложений в науке и инженерии",
    createdAt: "2024-01-15",
    studentCount: 28,
    teacherCount: 2,
    status: "active",
  },
  {
    id: 2,
    name: "Органическая химия",
    description:
      "Изучение структуры, свойств, состава и реакций органических соединений и их роли в биологических процессах",
    createdAt: "2024-01-20",
    studentCount: 22,
    teacherCount: 1,
    status: "active",
  },
  {
    id: 3,
    name: "История древнего мира",
    description:
      "Исследование цивилизаций Древнего Египта, Греции, Рима и других древних обществ от зарождения до падения",
    createdAt: "2024-01-10",
    studentCount: 35,
    teacherCount: 1,
    status: "active",
  },
  {
    id: 4,
    name: "Программирование на Python",
    description:
      "Основы программирования, алгоритмы, структуры данных и разработка приложений на языке Python",
    createdAt: "2024-02-01",
    studentCount: 31,
    teacherCount: 3,
    status: "active",
  },
  {
    id: 5,
    name: "Физика элементарных частиц",
    description:
      "Изучение стандартной модели физики частиц, квантовой механики и современных исследований в области физики высоких энергий",
    createdAt: "2024-01-25",
    studentCount: 15,
    teacherCount: 2,
    status: "active",
  },
  {
    id: 6,
    name: "Литература 19 века",
    description:
      "Анализ произведений великих писателей XIX века, включая Толстого, Достоевского, Диккенса и других классиков",
    createdAt: "2023-12-01",
    studentCount: 26,
    teacherCount: 1,
    status: "archived",
  },
  {
    id: 7,
    name: "Биология клетки",
    description:
      "Изучение строения и функций клеток, клеточных процессов, молекулярной биологии и генетики",
    createdAt: "2024-01-30",
    studentCount: 29,
    teacherCount: 2,
    status: "active",
  },
];

// Для списка действий используем твой класс
const mockActionList = {
  models: [
    {
      id: "action-1",
      assignment_id: "assignment-123",
      student_id: "student-456",
      action_type: "submitted",
      description: "Работа отправлена на проверку",
      is_warning: false,
      is_archived: false,
      created_at: "2023-12-01T10:00:00Z",
      user: {
        id: "user-1",
        firstname: "Преподаватель",
        lastname: "Петров",
        getFullName: function () {
          return "Преподаватель Петров";
        },
      },
      initiator_id: "user-1",
      getTime: function () {
        return "10:00";
      },
      getDiffTime: function () {
        return "5 мин";
      },
      getDiffTermType: function () {
        return "short";
      },
    },
    {
      id: "action-2",
      assignment_id: "assignment-123",
      student_id: "student-456",
      action_type: "reviewed",
      description: "Работа проверена",
      is_warning: true,
      is_archived: false,
      created_at: "2023-12-01T10:05:00Z",
      user: {
        id: "user-1",
        firstname: "Преподаватель",
        lastname: "Петров",
        getFullName: function () {
          return "Преподаватель Петров";
        },
      },
      initiator_id: null,
      getTime: function () {
        return "10:05";
      },
      getDiffTime: function () {
        return "15 мин";
      },
      getDiffTermType: function () {
        return "medium";
      },
    },
  ],
  length: 2,
  assignment_id: "assignment-123",
  isLastPage: function () {
    return false;
  },
  page: function (pageNum: number, reset: boolean) {
    return this;
  },
  fetch: async function (params: any) {
    return this;
  },
  push: function (action: any) {
    this.models.push(action);
    this.length = this.models.length;
  },
  diff: function () {
    const previous: Record<string, any> = {};
    return this.models.map((current: any) => {
      const student = current.student_id;
      if (student && previous[student]) {
        const prevDate = new Date(previous[student].created_at);
        const currDate = new Date(current.created_at);
        current.diff = (currDate.getTime() - prevDate.getTime()) / 1000;
      }
      if (student) {
        previous[student] = current;
      }
      return current;
    });
  },
};

export { mockActionList };
