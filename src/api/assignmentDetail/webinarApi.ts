// api/webinarApi.ts

import axiosClient from "../axiosClient";
import { WebinarSessionsResponse } from "@/types/assignment/webinar";

export const fetchWebinarSessions = async (
  assignmentId: number,
  studentId: number,
  limit: number = 99
): Promise<WebinarSessionsResponse> => {
  const params = {
    assignment_id: assignmentId,
    student_id: studentId,
    limit,
  };

  const headers = {
    "X-Requested-Fields": [
      "id",
      "webinar_id",
      "user_id",
      "type",
      "status",
      "state",
      "session_type",
      "record",
      "created_at",
    ].join(","),
  };

  const response = await axiosClient.get<WebinarSessionsResponse>(
    "/webinar-sessions",
    {
      params,
      headers,
    }
  );

  return response.data;
};
