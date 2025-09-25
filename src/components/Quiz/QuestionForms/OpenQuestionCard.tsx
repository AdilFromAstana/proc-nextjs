import RichText from "@/components/Chunks/RichText";
import { QuizQuestionItem } from "@/types/quiz/quiz";

export const OpenQuestionCard = ({
  question,
}: {
  question: QuizQuestionItem;
}) => {
  if (!question) return null;
  const questionText = question?.component?.question || "";
  const answerText = question?.component?.answer || "";

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Вопрос
        </label>
        <RichText content={questionText} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ответ
        </label>
        <RichText content={answerText} />
      </div>
    </div>
  );
};
