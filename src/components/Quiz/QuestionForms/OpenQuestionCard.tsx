import { QuizQuestionItem } from "@/types/quiz/quiz";

export const OpenQuestionCard = ({
  question,
}: {
  question: QuizQuestionItem;
}) => {
  const questionText = question.component.question || "";
  const answerText = question.component.answer || "";

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Вопрос
        </label>
        <textarea
          value={questionText}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none resize-none"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ответ
        </label>
        <textarea
          value={answerText}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none resize-none"
          rows={2}
        />
      </div>
    </div>
  );
};
