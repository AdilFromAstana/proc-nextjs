// "use client";
// import React, { useRef } from "react";
// import { addStyles, EditableMathField, MathField } from "react-mathquill";

// addStyles();

// export default function QuestionField({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   const mathFieldRef = useRef<MathField | null>(null);

//   function renderWithFormulas(value: string) {
//     const parts = value.split(/(\[FORMULA:[\s\S]*?\])/g);

//     return parts.map((part, idx) => {
//       if (part.startsWith("[FORMULA:")) {
//         const latex = part.replace(/^\[FORMULA:/, "").replace(/\]$/, "");
//         console.log("latex: ", latex);

//         return (
//           <EditableMathField
//             key={idx}
//             latex={latex}
//             onChange={(mf) => {
//               mathFieldRef.current = mf;
//               const newLatex = mf.latex();
//               const newValue = parts
//                 .map((p, i) => (i === idx ? `[FORMULA:${newLatex}]` : p))
//                 .join("");
//               onChange(newValue);
//             }}
//             className="border p-2 rounded-md bg-white w-fit"
//           />
//         );
//       }

//       // всегда редактируемый текст
//       return (
//         <span
//           key={idx}
//           contentEditable
//           suppressContentEditableWarning
//           className="whitespace-pre-wrap outline-none rounded hover:bg-yellow-50"
//           onBlur={(e) => {
//             const newText = e.currentTarget.innerText;
//             const newValue = parts
//               .map((p, i) => (i === idx ? newText : p))
//               .join("");
//             onChange(newValue);
//           }}
//         >
//           {part}
//         </span>
//       );
//     });
//   }

//   return (
//     <div className="p-2 border rounded-md bg-gray-50 flex flex-wrap items-end">
//       {renderWithFormulas(value)}
//     </div>
//   );
// }

"use client";
import React from "react";
import Mathfield from "./Mathfield"; // импортируем твой компонент Mathlive

export default function QuestionField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  function renderWithFormulas(value: string) {
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
              onChange(newValue);
            }}
            options={{
              virtualKeyboardMode: "off",
              menu: "false",
            }}
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "6px",
              background: "white",
              display: "inline-block",
              minWidth: "60px",
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
          className="whitespace-pre-wrap outline-none rounded hover:bg-yellow-50 px-1"
          onBlur={(e) => {
            const newText = e.currentTarget.innerText;
            const newValue = parts
              .map((p, i) => (i === idx ? newText : p))
              .join("");
            onChange(newValue);
          }}
        >
          {part}
        </span>
      );
    });
  }

  return (
    <div className="p-2 border rounded-md bg-gray-50 flex flex-wrap items-end">
      {renderWithFormulas(value)}
    </div>
  );
}
