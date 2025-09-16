import { fetchWebinarSessions } from "@/api/assignmentDetail/webinarApi";
import { WebinarSessionsResponse } from "@/types/assignment/webinar";
import { useQuery } from "@tanstack/react-query";

export const useWebinarSessions = (
  assignmentId: number,
  studentId: number,
  limit: number = 99
) => {
  return useQuery<WebinarSessionsResponse>({
    queryKey: ["webinar-sessions", assignmentId, studentId, limit],
    queryFn: () => fetchWebinarSessions(assignmentId, studentId, limit),
    enabled: !!assignmentId && !!studentId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
