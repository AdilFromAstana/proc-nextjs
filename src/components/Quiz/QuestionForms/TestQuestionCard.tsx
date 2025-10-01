import RichText from "@/components/Chunks/RichText";
import { QuizQuestionItem } from "@/types/quiz/quiz";

export const TestQuestionCard = ({
  question,
}: {
  question: QuizQuestionItem;
}) => {
  if (!question) return null;

  const questionText = question?.component?.question || "";
  const answers = question?.component?.options || [];

  return (
    <div>
      <RichText content={questionText} />
      <div className="space-y-2">
        {answers.map((answer: any, index: number) => (
          <label
            key={index}
            className="flex items-start space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={answer.is_true}
              readOnly
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <RichText content={answer.answer} />
          </label>
        ))}
      </div>
    </div>
  );
};
