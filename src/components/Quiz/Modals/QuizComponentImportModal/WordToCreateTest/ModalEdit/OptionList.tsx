// "use client";
// import React from "react";
// import FormulaEditor from "./FormulaEditor";
// import { Option } from "../WordToCreateTest";
// import { processTextWithRichContent } from "../../parseDocxLogic/processRichText";
// import { Button } from "@/components/ui/button";

// export default function OptionList({
//   options,
//   isRaw = true,
//   onOptionChange,
//   onToggleCorrect,
//   onAddOption,
//   onDeleteOption,
// }: {
//   options: Option[];
//   isRaw?: boolean;
//   onOptionChange: (index: number, text: string) => void;
//   onToggleCorrect: (index: number) => void;
//   onAddOption: () => void;
//   onDeleteOption: (index: number) => void;
// }) {
//   return (
//     <div className="p-4 flex-1 overflow-y-auto flex flex-col items-center">
//       {options.map((opt, i) => (
//         <div
//           key={opt.id}
//           className={`flex items-center gap-2 mb-2 cursor-pointer w-full min-h-10 ${
//             opt.isCorrect ? "bg-green-50" : ""
//           }`}
//           onClick={() => onToggleCorrect(i)}
//         >
//           <input
//             type="checkbox"
//             checked={opt.isCorrect}
//             readOnly
//             className="pointer-events-none w-8 h-8"
//           />

//           {isRaw ? (
//             <input
//               type="text"
//               value={opt.text}
//               onChange={(e) => onOptionChange(i, e.target.value)}
//               className="w-full p-2 border rounded-md h-full"
//               onClick={(e) => e.stopPropagation()}
//             />
//           ) : opt.text.startsWith("[FORMULA:") ? (
//             <FormulaEditor
//               value={opt.text.replace("[FORMULA:", "").replace("]", "")}
//               onChange={(newLatex) =>
//                 onOptionChange(i, `[FORMULA:${newLatex}]`)
//               }
//             />
//           ) : (
//             <div className="p-2 border rounded-md w-full h-full">
//               {processTextWithRichContent(opt.text)}
//             </div>
//           )}

//           {/* 🔥 кнопка удалить */}
//           <Button
//             onClick={(e) => {
//               e.stopPropagation();
//               onDeleteOption(i);
//             }}
//             className="text-red-500 hover:text-red-700 px-2 cursor-pointer"
//           >
//             ✕
//           </Button>
//         </div>
//       ))}

//       {/* 🔥 кнопка добавить */}
//       <Button
//         onClick={onAddOption}
//         className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
//       >
//         + Добавить вариант ответа
//       </Button>
//     </div>
//   );
// }

"use client";
import React from "react";
import { Option } from "../WordToCreateTest";
import { Button } from "@/components/ui/button";
import Mathfield from "./Mathfield";

export default function OptionList({
  options,
  isRaw = true,
  onOptionChange,
  onToggleCorrect,
  onAddOption,
  onDeleteOption,
}: {
  options: Option[];
  isRaw?: boolean;
  onOptionChange: (index: number, text: string) => void;
  onToggleCorrect: (index: number) => void;
  onAddOption: () => void;
  onDeleteOption: (index: number) => void;
}) {
  function renderWithFormulas(index: number, value: string) {
    const parts = value.split(/(\[FORMULA:[\s\S]*?\])/g);

    return parts.map((part, idx) => {
      if (part.startsWith("[FORMULA:")) {
        const latex = part.replace(/^\[FORMULA:/, "").replace(/\]$/, "");

        return (
          <Mathfield
            key={idx}
            value={latex}
            onChange={(newLatex) => {
              const newValue = parts
                .map((p, i) => (i === idx ? `[FORMULA:${newLatex}]` : p))
                .join("");
              // всегда передаём index (из параметра функции),
              // а не idx (локальный индекс внутри parts)
              onOptionChange(index, newValue);
            }}
            options={{
              virtualKeyboardMode: "off",
              menu: "false",
            }}
            style={{
              width: "100%",
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "6px",
              background: "white",
              display: "inline-block",
              minWidth: "60px",
              height: "100%",
            }}
          />
        );
      }

      // редактируемый текст
      return (
        <span
          key={idx}
          contentEditable
          suppressContentEditableWarning
          className="whitespace-pre-wrap outline-none rounded hover:bg-yellow-50 p-1 w-full border-2 h-full flex items-center"
          onBlur={(e) => {
            const newText = e.currentTarget.innerText;
            const newValue = parts
              .map((p, i) => (i === idx ? newText : p))
              .join("");
            // здесь тоже используем index
            onOptionChange(index, newValue);
          }}
        >
          {part}
        </span>
      );
    });
  }

  return (
    <div className="p-4 flex-1 overflow-y-auto flex flex-col items-center">
      {options.map((opt, i) => (
        <div
          key={opt.id}
          className={`flex items-center gap-2 mb-2 cursor-pointer w-full min-h-10 justify-between ${
            opt.isCorrect ? "bg-green-50" : ""
          }`}
          onClick={() => onToggleCorrect(i)}
        >
          <input
            type="checkbox"
            checked={opt.isCorrect}
            readOnly
            className="pointer-events-none w-8 h-8"
          />
          {renderWithFormulas(i, opt.text)}
          {/* 🔥 кнопка удалить */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteOption(i);
            }}
            className="text-red-500 hover:text-red-700 px-2 cursor-pointer"
          >
            ✕
          </Button>
        </div>
      ))}

      {/* 🔥 кнопка добавить */}
      <Button
        onClick={onAddOption}
        className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
      >
        + Добавить вариант ответа
      </Button>
    </div>
  );
}
