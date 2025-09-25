// components/modals/QuestionTypeSection.tsx
import BgdFormItem from "@/components/Chunks/BgdFormItem";
import PillComponent from "@/components/Chunks/PillComponent";
import React from "react";

interface QuestionTypeSectionProps {
  questionTypes: any[];
  postData: any;
  errors: Record<string, string[]>;
  t: (key: string) => string;
  onTypeChange: (type: string) => void;
}

const QuestionTypeSection: React.FC<QuestionTypeSectionProps> = ({
  questionTypes,
  postData,
  errors,
  t,
  onTypeChange,
}) => {
  return (
    <BgdFormItem
      label={t("label-import-quiz-type")}
      hint={t("hint-import-quiz-type")}
      error={errors.type ? errors.type[0] : undefined}
    >
      <PillComponent
        value={postData.type || ""}
        options={questionTypes}
        size="small"
        given="raw"
        onChange={onTypeChange}
      />
    </BgdFormItem>
  );
};

export default QuestionTypeSection;
