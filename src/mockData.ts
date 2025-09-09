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
