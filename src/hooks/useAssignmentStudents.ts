// hooks/useAssignmentStudents.ts
import { useQuery } from "@tanstack/react-query";
import { fetchAssignmentStudents } from "@/api/assignmentDetail/studentsApi";
import { AssignmentStudentsResponse } from "@/types/assignment/students";

export const useAssignmentStudents = (
  assignmentId: number,
  page: number,
  limit: number,
  sortBy: string,
  query?: string | null
) => {
  return useQuery<AssignmentStudentsResponse>({
    queryKey: ["assignment-students", assignmentId, page, limit, sortBy, query],
    queryFn: () =>
      fetchAssignmentStudents(assignmentId, page, limit, sortBy, query),
    enabled: !!assignmentId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
