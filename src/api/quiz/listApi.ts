import {
  FetchQuizListParams,
  QuizAttemptsApi,
  QuizAttemptsResponse,
  QuizComponentsResponse,
  QuizDetailEntity,
  QuizDetailResponse,
  QuizListResponse,
  QuizQuestionComponent,
  QuizQuestionItem,
} from "@/types/quiz/quiz";
import axiosClient from "../axiosClient";

// Тип для действия завершения теста
export interface FinishAssignmentAction {
  action_type: "finished";
  assignment_attempt_id: number;
  assignment_id: number;
  id: null;
  initiator_id: null;
  student_id: null;
  webinar_session_id: null;
  screenshot: null;
  screenshots: null;
  is_warning: boolean;
  is_archived: boolean;
  description: null;
  created_at: null;
  diff: null;
  user: {
    REQUEST_CONTINUE: number;
    REQUEST_REDUNDANT: number;
    REQUEST_SKIP: number;
    id: null;
    school_id: null;
    auth_type: null;
    group: null;
    photo: null;
    photo_thumb: {};
    color: null;
    firstname: null;
    lastname: null;
    patronymic: null;
    email: null;
    phone: null;
    username: null;
    description: null;
    password: null;
    school: {
      REQUEST_CONTINUE: number;
      REQUEST_REDUNDANT: number;
      REQUEST_SKIP: number;
      id: null;
      type: null;
      name: null;
      logo: null;
      logo_thumb: {};
      website: null;
      email: null;
    };
    register_date: null;
    last_activity_date: null;
    additional: {
      almaty_daryn_school_id: null;
      almaty_daryn_teacher_name: null;
    };
    is_online: boolean;
    is_need_complete_challenge: boolean;
    is_multiple_schools: boolean;
  };
}

export const fetchQuizList = async (
  params: FetchQuizListParams
): Promise<QuizListResponse> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "all"
    )
  );

  const response = await axiosClient.get<QuizListResponse>("/quiz", {
    params: cleanedParams,
  });

  return response.data;
};

export const fetchQuizComponents = async (
  params: FetchQuizListParams = {}
): Promise<QuizComponentsResponse> => {
  const response = await axiosClient.get<QuizComponentsResponse>(
    "/quiz-components.json",
    {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        query: params.query,
        type: params.type,
      },
    }
  );
  return response.data;
};

export const fetchQuizById = async (
  id: number
): Promise<QuizDetailResponse> => {
  let fields = [
    "id",
    "owner_id",
    "name",
    "description",
    "settings",
    "components",
  ];

  const response = await axiosClient.get<QuizDetailResponse>(`/quiz/${id}`, {
    headers: { "X-Requested-Fields": fields.join(",") },
  });
  return response.data;
};

export const sendAnswer = async (
  assignmentId: number,
  componentId: number,
  newData: QuizAttemptsApi[]
) => {
  const response = await axiosClient.post<QuizAttemptsResponse>(
    `/assignment/quiz-attempts/${assignmentId}/${componentId}.json`,
    newData
  );
};

// НОВАЯ ФУНКЦИЯ: Завершение теста
export const finishAssignment = async (
  assignmentId: number,
  assignmentAttemptId: number
): Promise<void> => {
  const finishAction: FinishAssignmentAction[] = [
    {
      action_type: "finished",
      assignment_attempt_id: assignmentAttemptId,
      assignment_id: assignmentId,
      id: null,
      initiator_id: null,
      student_id: null,
      webinar_session_id: null,
      screenshot: null,
      screenshots: null,
      is_warning: false,
      is_archived: false,
      description: null,
      created_at: null,
      diff: null,
      user: {
        REQUEST_CONTINUE: 0,
        REQUEST_REDUNDANT: 1,
        REQUEST_SKIP: 2,
        id: null,
        school_id: null,
        auth_type: null,
        group: null,
        photo: null,
        photo_thumb: {},
        color: null,
        firstname: null,
        lastname: null,
        patronymic: null,
        email: null,
        phone: null,
        username: null,
        description: null,
        password: null,
        school: {
          REQUEST_CONTINUE: 0,
          REQUEST_REDUNDANT: 1,
          REQUEST_SKIP: 2,
          id: null,
          type: null,
          name: null,
          logo: null,
          logo_thumb: {},
          website: null,
          email: null,
        },
        register_date: null,
        last_activity_date: null,
        additional: {
          almaty_daryn_school_id: null,
          almaty_daryn_teacher_name: null,
        },
        is_online: false,
        is_need_complete_challenge: false,
        is_multiple_schools: false,
      },
    },
  ];

  await axiosClient.post(
    `/assignment/actions/${assignmentId}.json`,
    finishAction
  );
};

export const updateQuiz = async (
  id: number,
  quizData: Partial<QuizDetailEntity>
): Promise<QuizDetailResponse> => {
  const response = await axiosClient.put<QuizDetailResponse>(
    `/quiz/${id}`,
    quizData
  );
  return response.data;
};

export const deleteQuestionFromQuiz = async (
  quizId: number,
  componentId: number
): Promise<QuizDetailResponse> => {
  // Сначала получаем текущий тест
  const quizResponse = await fetchQuizById(quizId);
  const currentQuiz = quizResponse.entity;

  // Фильтруем компоненты, исключая удаляемый
  const updatedComponents = currentQuiz.components.filter(
    (component) => component.component_id !== componentId
  );

  return await updateQuiz(quizId, {
    ...currentQuiz,
    components: updatedComponents,
  });
};

// НОВЫЕ ФУНКЦИИ

/**
 * Обновление отдельного компонента вопроса
 */
export const updateQuestionComponent = async (
  componentId: number,
  componentData: Partial<QuizQuestionComponent>
): Promise<QuizQuestionComponent> => {
  const response = await axiosClient.put<QuizQuestionComponent>(
    `/quiz-component/${componentId}`,
    componentData
  );
  return response.data;
};

/**
 * Обновление вопроса в тесте (оба PUT запроса)
 */
export const updateQuestionInQuiz = async (
  quizId: number,
  componentId: number,
  updatedQuestionData: Partial<QuizQuestionItem>
): Promise<void> => {
  try {
    // Первый PUT запрос: обновляем отдельный компонент вопроса
    await updateQuestionComponent(
      componentId,
      updatedQuestionData.component || {}
    );

    // Второй PUT запрос: обновляем тест с измененным компонентом
    const quizResponse = await fetchQuizById(quizId);
    const currentQuiz = quizResponse.entity;

    // Находим и обновляем конкретный компонент в тесте
    const updatedComponents = currentQuiz.components.map((component) => {
      if (component.component_id === componentId) {
        return {
          ...component,
          ...updatedQuestionData,
          component: {
            ...component.component,
            ...(updatedQuestionData.component || {}),
          },
        };
      }
      return component;
    });

    await updateQuiz(quizId, {
      ...currentQuiz,
      components: updatedComponents,
    });
  } catch (error) {
    console.error("Ошибка при обновлении вопроса в тесте:", error);
    throw error;
  }
};

/**
 * Добавление нового вопроса в тест
 */
export const addQuestionToQuiz = async (
  quizId: number,
  newComponent: any
): Promise<QuizDetailResponse> => {
  // Получаем текущий тест
  const quizResponse = await fetchQuizById(quizId);
  const currentQuiz = quizResponse.entity;

  // Добавляем новый компонент в конец массива
  const updatedComponents = [...currentQuiz.components, newComponent];

  // Отправляем обновлённый тест
  return await updateQuiz(quizId, {
    ...currentQuiz,
    components: updatedComponents,
  });
};
