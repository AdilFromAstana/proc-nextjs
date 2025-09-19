// src/api/assignmentDetail/detailApi.ts

import axiosClient from "../axiosClient";
import { AssignmentDetailResponse } from "@/types/assignment/detail";

export const fetchAssignmentDetail = async (
  id: number
): Promise<AssignmentDetailResponse> => {
  const fields = [
    "id",
    "external_id",
    "class_id",
    "owner_id",
    "lesson_id",
    "quiz_id",
    "webinar_id",
    "chat_id",
    "invite_code_id",
    "product_id",
    "certificate_id",
    "external_url",
    "status",
    "type",
    "access_type",
    "name",
    "description",
    "complete_time",
    "max_attempts",
    "points_method_type",
    "settings",
    "starting_at",
    "starting_at_type",
    "ending_at",
    "ending_at_type",
    "observer",
    "application",
    "is_points_method",
    "is_straight_answer",
    "is_show_answers_after_finished",
    "is_show_results_after_finished",
    "is_hide_users",
    "is_comments",
    "is_chat",
    "is_invite_code",
    "is_certificate",
    "is_proctoring",
    "is_webinar",
    "is_public",
    "is_unlisted",
    "is_random_assessment",

    "progress",
    "owner",
    "invite_code",
    "class:id",
    "class:name",
    "class:description",
    "class:image",
    "class:color",
    "quizzes:id",
    "quizzes:name",
    "quizzes:description",
    "quizzes:image",
    "quizzes:color",
    "lessons:id",
    "lessons:name",
    "lessons:description",
    "lessons:image",
    "lessons:color",
    "reviewers:id",
    "reviewers:photo",
    "reviewers:firstname",
    "reviewers:lastname",
    "rooms:id",
    "rooms:name",
    "rooms:description",
    "rooms:image",
    "rooms:color",
    "rooms:pcs_count",
    "invite_code",
    "product",
  ];

  const response = await axiosClient.get<AssignmentDetailResponse>(
    `/assignments/${id}`,
    {
      headers: { "X-Requested-Fields": fields.join(",") },
    }
  );
  return response.data;
};
