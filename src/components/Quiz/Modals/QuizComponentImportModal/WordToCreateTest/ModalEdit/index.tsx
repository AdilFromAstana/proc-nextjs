"use client";
import React, { useState } from "react";
import QuestionField from "./QuestionField";
import OptionList from "./OptionList";
import { Question } from "../WordToCreateTest";
import { v4 as uuidv4 } from "uuid"; // для уникальных id

const ModalEdit = ({
  question,
  onSave,
  onClose,
}: {
  question: Question;
  onSave: (q: Question) => void;
  onClose: () => void;
}) => {
  const [edited, setEdited] = useState<Question>(question);
  const [isRaw, setIsRaw] = useState(false);

  const handleOptionChange = (index: number, newText: string) => {
    const newOptions = [...edited.options];
    newOptions[index].text = newText;
    setEdited({ ...edited, options: newOptions });
  };

  const handleCorrectChange = (index: number) => {
    const newOptions = edited.options.map((o, i) => ({
      ...o,
      isCorrect: i === index ? !o.isCorrect : o.isCorrect,
    }));
    setEdited({ ...edited, options: newOptions });
  };

  // 🔥 Добавление варианта
  const handleAddOption = () => {
    const newOption = {
      id: uuidv4(),
      text: "",
      isCorrect: false,
    };
    setEdited({ ...edited, options: [...edited.options, newOption] });
  };

  // 🔥 Удаление варианта
  const handleDeleteOption = (index: number) => {
    const newOptions = edited.options.filter((_, i) => i !== index);
    setEdited({ ...edited, options: newOptions });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg h-[60vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">Редактировать вопрос</h3>
          <select
            value={isRaw ? "raw" : "visual"}
            onChange={(e) => setIsRaw(e.target.value === "raw")}
            className="px-3 py-1 border rounded-md bg-white"
          >
            <option value="visual">Визуально</option>
            <option value="raw">Текстом</option>
          </select>
        </div>

        {/* Question */}
        <div className="p-4 border-b">
          <QuestionField
            value={edited.question}
            isRaw={isRaw}
            onChange={(v) => setEdited({ ...edited, question: v })}
          />
        </div>

        {/* Options */}
        <OptionList
          options={edited.options}
          isRaw={isRaw}
          onOptionChange={handleOptionChange}
          onToggleCorrect={handleCorrectChange}
          onAddOption={handleAddOption}
          onDeleteOption={handleDeleteOption}
        />

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(edited)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;
