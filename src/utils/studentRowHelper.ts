// utils/reviewerUtils.ts

export const getReviewerResult = (
  reviewerResults: any[],
  result: any,
  reviewerId: number | null = null
): any => {
  // Найти существующий результат рецензента
  let found: any;

  if (reviewerId) {
    found = reviewerResults?.find(
      (r: any) =>
        r.assignment_result_id === result.id && r.user_id === reviewerId
    );
  } else {
    found = reviewerResults?.find(
      (r: any) => r.assignment_result_id === result.id
    );
  }

  // Если не найден, создать новый объект с базовыми полями
  if (!found) {
    found = {
      assignment_result_id: result.id,
      user_id: reviewerId,
      assignment_id: result.assignment_id,
      student_id: result.student_id,
      component_id: result.component_id,
      component_type: result.component_type,
    };
  } else {
    // Обновить поля если найден
    found.assignment_id = result.assignment_id;
    found.student_id = result.student_id;
    found.component_id = result.component_id;
    found.component_type = result.component_type;
  }

  return found;
};
