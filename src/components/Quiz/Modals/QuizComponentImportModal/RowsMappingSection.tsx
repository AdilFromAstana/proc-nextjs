// components/modals/RowsMappingSection.tsx
import BgdButton from "@/components/Chunks/BgdButton";
import BgdFormItem from "@/components/Chunks/BgdFormItem";
import React from "react";

interface RowsMappingSectionProps {
  letterList: string[];
  postData: any;
  letterValues: any[];
  shortenLetterState: boolean;
  errors: Record<string, string[]>;
  t: (key: string) => string;
  onRowChange: (letter: string, value: string) => void;
  onToggleLetterList: () => void;
}

const RowsMappingSection: React.FC<RowsMappingSectionProps> = ({
  letterList,
  postData,
  letterValues,
  shortenLetterState,
  errors,
  t,
  onRowChange,
  onToggleLetterList,
}) => {
  return (
    <BgdFormItem
      label={t("label-import-quiz-rows")}
      hint={t("hint-import-quiz-rows")}
      error={errors.rows ? errors.rows[0] : undefined}
    >
      <div className="bg-gray-200 rounded shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {letterList.map((letter) => (
            <div
              key={`letter-${letter}`}
              className="flex items-center p-4 bg-white rounded even:bg-gray-50"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded font-bold uppercase mr-3">
                {letter}
              </div>
              <div className="flex-1">
                <select
                  value={postData.rows[letter] || ""}
                  onChange={(e) => onRowChange(letter, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">
                    {t("placeholder-import-quiz-letter-value")}
                  </option>
                  {letterValues.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <BgdButton color="blue" size="small" onClick={onToggleLetterList}>
            {shortenLetterState ? t("btn-show-more") : t("btn-show-less")}
          </BgdButton>
        </div>
      </div>
    </BgdFormItem>
  );
};

export default RowsMappingSection;
