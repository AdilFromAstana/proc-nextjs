// src/api/assignmentDetail/detailApi.ts

import axiosClient from "../axiosClient";
import {
  AssignmentDetail,
  AssignmentDetailResponse,
  ProctoringAssignmentResponse,
} from "@/types/assignment/detail";

const AssignmentRequestedModelFields = [
  "id",
  "quiz_id",
  "lesson_id",
  "status",
  "type",
  "name",
  "description",
  "external_url",
  "settings",
  "complete_time",
  "max_attempts",
  "starting_at",
  "starting_at_type",
  "ending_at",
  "ending_at_type",
  "is_straight_answer",
  "is_show_results_after_finished",
  "is_show_answers_after_finished",
  "is_points_method",
  "is_comments",
  "is_chat",
  "is_certificate",
  "is_proctoring",
  "is_webinar",
  "is_started",
  "is_finished",
  "is_registered",
  "progress",
  "reviewers",

  "application",
  "proctoring_policy_agree",
  "head_identity_manual_disabled",
  "head_tracking_manual_disabled",
  "main_camera_manual_disabled",
  "second_camera_manual_disabled",
  "screen_share_manual_disabled",
  "fullscreen_mode_manual_disabled",
  "displays_check_manual_disabled",
  "read_clipboard_manual_disabled",
  "focus_detector_manual_disabled",
  "extension_detector_manual_disabled",
  "noise_detector_manual_disabled",
  "head_identity_manual_enabled",
  "head_tracking_manual_enabled",
  "main_camera_manual_enabled",
  "second_camera_manual_enabled",
  "screen_share_manual_enabled",
  "fullscreen_mode_manual_enabled",
  "displays_check_manual_enabled",
  "read_clipboard_manual_enabled",
  "focus_detector_manual_enabled",
  "extension_detector_manual_enabled",
  "noise_detector_manual_enabled",

  "available_time",
  "student_assessments",
  "attempts",
  "results",
  "points",
  "quizzes:id",
  "quizzes:name",
  "quizzes:description",
  "quizzes:components",
  "quizzes:settings",
  "lessons:id",
  "lessons:name",
  "lessons:description",
  "lessons:settings",
  "lessons:chapters:id",
  "lessons:chapters:name",
  "lessons:chapters:description",
  "lessons:chapters:position",
  "lessons:chapters:components",
  "webinar:id",
  "webinar:chat_id",
  "webinar:server",
  "webinar:room",
  "webinar:token",
  "webinar:ice_servers",
  "chat_id",

  "attempt_id",
];

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
    // "quizzes:components",
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
      headers: {
        "X-Requested-Fields": fields.join(","),
      },
    }
  );
  return response.data;
};

export const fetchAssignmentDetailProctoring = async (
  id: number
): Promise<ProctoringAssignmentResponse> => {
  const response = await axiosClient.get<ProctoringAssignmentResponse>(
    `/assignments/${id}`,
    {
      headers: {
        "X-Requested-Fields": AssignmentRequestedModelFields.join(","),
      },
    }
  );
  return response.data;
};

export const updateAssignmentDetail = async (
  id: number,
  updateData: Partial<AssignmentDetail>
): Promise<AssignmentDetailResponse> => {
  const response = await axiosClient.put<AssignmentDetailResponse>(
    `/assignments/${id}`,
    updateData,
    {
      headers: {
        "X-Requested-Fields": AssignmentRequestedModelFields.join(","),
      },
    }
  );
  return response.data;
};
