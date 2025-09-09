// Утилиты для работы с assignment
export const assignmentHelpers = {
  getName: (assignment: any) => {
    return (
      assignment.name ||
      assignment.lesson?.name ||
      assignment.quiz?.name ||
      "Без названия"
    );
  },

  getClassName: (assignment: any) => {
    return assignment.class?.name || "";
  },

  isPrepaidAccessType: (assignment: any) => {
    // Предполагаем, что есть поле access_type или подобное
    return (
      assignment.access_type === "prepaid" || assignment.type === "prepaid"
    );
  },
};
