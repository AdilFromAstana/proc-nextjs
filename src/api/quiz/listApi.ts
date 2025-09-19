import {
  FetchQuizListParams,
  QuizComponentsResponse,
  QuizDetailEntity,
  QuizDetailResponse,
  QuizListResponse,
  QuizQuestionComponent,
  QuizQuestionItem,
} from "@/types/quiz/quiz";
import axiosClient from "../axiosClient";

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
