import { ProcessTextWithRichContent } from "../parseDocxLogic/processRichText";

interface AnswerOptionProps {
  option: any;
  isEditing: boolean;
  toggleCorrect: (id: string, isEditing: boolean) => void;
  updatePercent: (id: string, value: number) => void;
  removeOption: (id: string) => void;
  updateOptionAnswer: (id: string, value: string) => void;
}

export function AnswerOption({
  updateOptionAnswer,
  option,
  isEditing,
  toggleCorrect,
  updatePercent,
  removeOption,
}: AnswerOptionProps) {
  const isCorrect = option.isCorrect;
  const itemClass = isCorrect
    ? "bg-green-50 border-green-300 shadow-sm"
    : "bg-white border-slate-200 hover:bg-slate-50";
  return (
    <div
      className={`flex items-center gap-3 p-3 my-1 border rounded-lg transition-all duration-200 ${itemClass}`}
    >
      {/* Чекбокс */}
      <button
        onClick={() => toggleCorrect(option.id, isEditing)}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          option.isCorrect
            ? "bg-green-600 text-white"
            : "bg-slate-200 text-slate-700"
        }`}
      >
        ✔
      </button>

      {/* Dropdown процентов */}
      <div className="w-24">
        <select
          value={option.percent}
          onChange={(e) => updatePercent(option.id, Number(e.target.value))}
          disabled={!isEditing}
          className="w-full rounded-md border p-1 text-sm"
        >
          <option value={0}>0%</option>
          <option value={20}>20%</option>
          <option value={25}>25%</option>
          <option value={33}>33%</option>
          <option value={50}>50%</option>
          <option value={75}>75%</option>
          <option value={100}>100%</option>
        </select>
      </div>

      {/* Текст */}
      <div className="flex-grow mr-4 min-w-0">
        <div
          className={`text-base break-words ${
            isCorrect ? "font-semibold" : "text-slate-800"
          }`}
        >
          <ProcessTextWithRichContent
            text={option.answer}
            editable={isEditing}
            key={option.id}
            onChange={(newValue) => updateOptionAnswer(option.id, newValue)}
          />
        </div>
      </div>

      {isEditing && (
        <button
          onClick={() => removeOption(option.id)}
          className="text-red-600"
        >
          ✖
        </button>
      )}
    </div>
  );
}
