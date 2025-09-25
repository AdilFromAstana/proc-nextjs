// src/components/Quiz/QuestionCard/QuestionHeader.tsx
import React from "react";
import {
  DeleteQuestionIcon,
  EditQuestionIcon,
  ScoreIcon,
} from "@/app/icons/Quiz";
import { getQuestionIcon } from "../questionUtils";

interface QuestionHeaderProps {
  position: number;
  questionType: string;
  questionName: string;
  score?: string;
  isEditing: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  position,
  questionType,
  questionName,
  score,
  isEditing,
  onEditClick,
  onDeleteClick,
  onSaveClick,
  onCancelClick,
}) => {
  const QuestionIcon = getQuestionIcon(questionType);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-700 bg-blue-100 rounded">
          {position + 1}
        </div>

        <div className="flex items-center space-x-1">
          {QuestionIcon && <QuestionIcon height={18} color="blue" />}
          <span className="text-sm font-medium text-gray-700">
            {questionName}
          </span>
        </div>

        {score && (
          <div className="flex items-center space-x-1">
            <ScoreIcon height={18} />
            <span className="text-sm font-medium text-gray-700">{score} Б</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {!isEditing ? (
          <>
            <EditQuestionIcon
              height={20}
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={onEditClick}
            />
            <DeleteQuestionIcon
              height={20}
              className="text-red-600 cursor-pointer hover:text-red-800"
              onClick={onDeleteClick}
            />
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={onSaveClick}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              type="button"
            >
              Сохранить
            </button>
            <button
              onClick={onCancelClick}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              type="button"
            >
              Отмена
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionHeader;
