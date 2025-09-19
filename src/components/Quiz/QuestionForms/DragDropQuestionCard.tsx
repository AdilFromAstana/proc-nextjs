import { UploadIcon } from "@/app/icons/UploadIcon";
import { QuizQuestionItem } from "@/types/quiz/quiz";

export const DragDropQuestionCard = ({
  question,
}: {
  question: QuizQuestionItem;
}) => {
  const fileName = question.component.file_name || "Файл не загружен";

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Файл для Drag & Drop
        </label>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-center">
          <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{fileName}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Элементы для перетаскивания
        </label>
        <div className="space-y-2">
          {question.component.items?.map((item: any, index: number) => (
            <div
              key={index}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm"
            >
              <span className="text-gray-700">{item.text}</span>
            </div>
          )) || <p className="text-gray-500 text-sm">Нет элементов</p>}
        </div>
      </div>
    </div>
  );
};
