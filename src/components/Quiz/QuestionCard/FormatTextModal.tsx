// FormatTextModal.tsx
import React, { useState } from "react";

interface FormatTextModalProps {
  isOpen: boolean;
  text: string;
  onClose: () => void;
  onAccept: (formattedText: string) => void;
}

export const FormatTextModal: React.FC<FormatTextModalProps> = ({
  isOpen,
  text,
  onClose,
  onAccept,
}) => {
  const [formattedText, setFormattedText] = useState(text);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Форматировать текст
        </h3>

        <textarea
          value={formattedText}
          onChange={(e) => setFormattedText(e.target.value)}
          className="w-full h-64 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={() => onAccept(formattedText)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};
