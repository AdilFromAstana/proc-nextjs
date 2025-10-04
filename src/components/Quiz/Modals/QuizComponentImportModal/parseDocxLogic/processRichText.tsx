"use client";
import React, { JSX, ReactElement, useEffect, useRef, useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import Mathfield from "../WordToCreateTest/ModalEdit/Mathfield";

export interface ProcessTextWithRichContentProps {
  /** Исходная строка с текстом и маркерами [FORMULA:..] или [IMAGE:..] */
  text: string;
  /** Колбэк для передачи изменений наружу */
  onChange?: (value: string) => void;
  /** Режим редактирования (по умолчанию true) */
  editable?: boolean;
}

function normalizeText(input: string): string {
  // заменяем $...$ и $$...$$ на [FORMULA:...]
  return input.replace(/(\${1,2})([\s\S]*?)\1/g, (_, __, formula) => {
    console.log("formula: ", formula);
    return `[FORMULA:${formula.trim()}]`;
  });
}

export const ProcessTextWithRichContent: React.FC<
  ProcessTextWithRichContentProps
> = ({ text, onChange, editable = true }): ReactElement => {
  const regex = /(?:\[(FORMULA|IMAGE):([\s\S]*?)\]|(\${1,2})([\s\S]*?)\3)/g;
  const parts: JSX.Element[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(regex)) {
    const [full, type, content, dollar, latexContent] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      const raw = text.substring(lastIndex, start);

      if (editable) {
        parts.push(
          <InlineToolbarText
            key={`text-${start}`}
            text={raw}
            onChange={(newText) => {
              const newValue =
                text.substring(0, lastIndex) + newText + text.substring(start);
              onChange?.(newValue);
            }}
          />
        );
      } else {
        parts.push(<span key={`text-${start}`}>{raw}</span>);
      }
    }

    if (type === "FORMULA") {
      if (editable) {
        parts.push(
          <span
            key={`formula-${start}`}
            className="relative inline-"
          >
            <Mathfield
              value={content}
              onChange={(newLatex) => {
                const newValue =
                  text.substring(0, start) +
                  `[FORMULA:${newLatex}]` +
                  text.substring(start + full.length);
                onChange?.(newValue);
              }}
              options={{ virtualKeyboardMode: "off", menu: "false" }}
              style={{
                border: "1px solid #cbd5e1",
                padding: "6px 8px",
                borderRadius: "0.5rem",
                background: "white",
                display: "inline-block",
                minWidth: "40px",
                margin: "0 4px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            />

            {/* 🔽 Кнопка удаления */}
            <button
              onClick={() => {
                const newValue =
                  text.substring(0, start) +
                  text.substring(start + full.length);
                onChange?.(newValue);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              title="Удалить формулу"
            >
              ✖
            </button>
          </span>
        );
      } else {
        if (content.includes("\\begin{")) {
          parts.push(<BlockMath key={`block-${start}`} math={content} />);
        } else {
          parts.push(<InlineMath key={`inline-${start}`} math={content} />);
        }
      }
    } else if (type === "IMAGE") {
      if (editable) {
        parts.push(
          <input
            key={`image-${start}`}
            type="text"
            defaultValue={content}
            className="border border-slate-300 rounded-lg px-2 py-1 mx-1 text-sm w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            onBlur={(e) => {
              const newValue =
                text.substring(0, start) +
                `[IMAGE:${e.currentTarget.value}]` +
                text.substring(start + full.length);
              onChange?.(newValue);
            }}
          />
        );
      } else {
        parts.push(
          <img
            key={`img-${start}`}
            src={content}
            alt="embedded"
            className="inline-block max-h-32 mx-2 rounded-md shadow"
          />
        );
      }
    } else if (dollar) {
      const formula = latexContent.trim();
      if (editable) {
        parts.push(
          <Mathfield
            key={`formula-${start}`}
            value={formula}
            onChange={(newLatex) => {
              const newValue =
                text.substring(0, start) +
                `[FORMULA:${newLatex}]` +
                text.substring(start + full.length);
              onChange?.(newValue);
            }}
          />
        );
      } else {
        if (formula.includes("\\begin{")) {
          parts.push(<BlockMath key={`block-${start}`} math={formula} />);
        } else {
          parts.push(<InlineMath key={`inline-${start}`} math={formula} />);
        }
      }
    }

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length || text.length === 0) {
    const raw = text.substring(lastIndex);
    if (editable) {
      parts.push(
        <InlineToolbarText
          key={`text-${lastIndex}`}
          text={raw}
          onChange={(newText) => {
            const newValue = text.substring(0, lastIndex) + newText;
            onChange?.(newValue);
          }}
        />
      );
    } else {
      parts.push(<span key={`text-${lastIndex}`}>{raw}</span>);
    }
  }

  return <>{parts}</>;
};

//
// 🔹 contentEditable с тулбаром
//
const InlineToolbarText = ({
  text,
  onChange,
}: {
  text: string;
  onChange: (v: string) => void;
}) => {
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState<{ [key: string]: boolean }>({});
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = text;
    }
  }, []);

  const updateToolbarState = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const exec = (cmd: string) => {
    document.execCommand(cmd, false);
    const newHtml = ref.current?.innerHTML || "";
    onChange(newHtml);
    updateToolbarState();
  };

  const handleInput = () => {
    const newHtml = ref.current?.innerHTML || "";
    const normalized = normalizeText(newHtml); // 👈 конвертируем
    console.log("normalized: ", normalized);
    onChange(normalized);
    updateToolbarState();
  };

  return (
    <span className="relative inline-block">
      {focused && (
        <div className="absolute -top-10 left-0 flex gap-1 bg-white border border-slate-200 rounded-md shadow-md px-2 py-1 z-50 text-sm">
          {[
            { cmd: "bold", label: <b>B</b> },
            { cmd: "italic", label: <i>I</i> },
            { cmd: "underline", label: <u>U</u> },
          ].map((btn) => (
            <button
              key={btn.cmd}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(btn.cmd)}
              className={`px-2 py-0.5 rounded transition ${
                active[btn.cmd]
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-slate-100 active:bg-slate-200 text-slate-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <span
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={`whitespace-pre-wrap outline-none border-none rounded-none px-1 py-0.5 text-sm transition min-w-[20px] min-h-[1.2em] ${
          focused ? "" : "hover:bg-yellow-50"
        }`}
        data-placeholder="Введите текст..."
        onFocus={() => {
          setFocused(true);
          updateToolbarState();
        }}
        onBlur={() => {
          setFocused(false);
          const newHtml = ref.current?.innerHTML || "";
          const normalized = normalizeText(newHtml); // 👈 конвертируем
          console.log("normalized: ", normalized);
          onChange(normalized);
        }}
        onInput={handleInput}
        onKeyUp={updateToolbarState}
        onMouseUp={updateToolbarState}
      />
    </span>
  );
};
