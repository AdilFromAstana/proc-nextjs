"use client";
import React from "react";
import FormulaEditor from "./FormulaEditor";
import { Option } from "../WordToCreateTest";
import { processTextWithRichContent } from "../../parseDocxLogic/processRichText";
import { Button } from "@/components/ui/button";

export default function OptionList({
  options,
  isRaw,
  onOptionChange,
  onToggleCorrect,
  onAddOption,
  onDeleteOption,
}: {
  options: Option[];
  isRaw: boolean;
  onOptionChange: (index: number, text: string) => void;
  onToggleCorrect: (index: number) => void;
  onAddOption: () => void;
  onDeleteOption: (index: number) => void;
}) {
  return (
    <div className="p-4 flex-1 overflow-y-auto flex flex-col items-center">
      {options.map((opt, i) => (
        <div
          key={opt.id}
          className={`flex items-center gap-2 mb-2 cursor-pointer w-full min-h-10 ${
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

          {isRaw ? (
            <input
              type="text"
              value={opt.text}
              onChange={(e) => onOptionChange(i, e.target.value)}
              className="w-full p-2 border rounded-md h-full"
              onClick={(e) => e.stopPropagation()}
            />
          ) : opt.text.startsWith("[FORMULA:") ? (
            <FormulaEditor
              value={opt.text.replace("[FORMULA:", "").replace("]", "")}
              onChange={(newLatex) =>
                onOptionChange(i, `[FORMULA:${newLatex}]`)
              }
            />
          ) : (
            <div className="p-2 border rounded-md w-full h-full">
              {processTextWithRichContent(opt.text)}
            </div>
          )}

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
