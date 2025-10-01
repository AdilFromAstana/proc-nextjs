import RichText from "@/components/Chunks/RichText";
import { QuizQuestionItem } from "@/types/quiz/quiz";
import { useTranslations } from "next-intl";

export const OpenQuestionCard = ({
  question,
}: {
  question: QuizQuestionItem;
}) => {
  if (!question) return null;
  const t = useTranslations();

  const questionText = question?.component?.question || "";
  const answerText = question?.component?.answer || "";

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("label-question")}
        </label>
        <RichText content={questionText} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("label-answer")}
        </label>
        <RichText content={answerText} />
      </div>
    </div>
  );
};
