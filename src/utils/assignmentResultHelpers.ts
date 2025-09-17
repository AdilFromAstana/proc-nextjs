// helpers/assignmentResultHelpers.ts

export const getResults = (
  assignmentResultList: any,
  attemptId: number | string | null = null
): any[] => {
  let results: any[] = assignmentResultList.models || [];

  if (attemptId) {
    const attemptIdNum =
      typeof attemptId === "string" ? parseInt(attemptId) : attemptId;
    results = results.filter(
      (result) => result.assignment_attempt_id === attemptIdNum
    );
  }

  return results;
};

export const getResultByComponentId = (
  assignmentResultList: any,
  componentId: number | null = null,
  attemptId: number | string | null = null
): any | undefined => {
  if (!assignmentResultList.models || assignmentResultList.models.length === 0)
    return undefined;

  if (componentId && attemptId) {
    const attemptIdNum =
      typeof attemptId === "string" ? parseInt(attemptId) : attemptId;
    return assignmentResultList.models.find(
      (result: any) =>
        result.component_id === componentId &&
        result.assignment_attempt_id === attemptIdNum
    );
  }

  if (componentId) {
    return assignmentResultList.models.find(
      (result: any) => result.component_id === componentId
    );
  }

  return undefined;
};

export const getPoints = (
  assignmentResultList: any,
  attemptId: number | string | null = null
): number => {
  let points = 0;
  const results = getResults(assignmentResultList, attemptId);

  results.forEach((item) => {
    if (item.points !== null && item.points !== undefined) {
      points = points + parseFloat(item.points.toString());
    }
  });

  return Math.ceil(points);
};
