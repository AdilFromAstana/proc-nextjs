import { QuizQuestionItem } from "@/types/quiz/quiz";

export const FillSpaceQuestionCard = ({
  question,
}: {
  question: QuizQuestionItem;
}) => {
  if (!question) return null;
  const questionText = question?.component?.question || "";
  const blanks = question?.component?.options || [];

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Вопрос с пропусками
        </label>
        <div className="p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[60px]">
          <p className="text-gray-700">{questionText}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Пропуски и ответы
        </label>
        <div className="space-y-2">
          {blanks.map((blank: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Пропуск {index + 1}:
              </span>
              <input
                type="text"
                value={blank.answer || ""}
                readOnly
                className="px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
