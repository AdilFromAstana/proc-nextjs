"use client";
import React from "react";
import { Question } from "./WordToCreateTest";
import { processTextWithRichContent } from "../parseDocxLogic/processRichText";

export default function QuestionRenderer({ question }: { question: Question }) {
  return (
    <>
      {/* 🔽 Скрываем MathML */}
      <style jsx global>{`
        .katex .katex-html {
          display: none !important;
        }
      `}</style>

      <div className="font-semibold mb-2">
        <span className="font-bold">{question.id}.</span>{" "}
        {processTextWithRichContent(question.question)}
      </div>
      <ul className="list-disc list-inside text-sm">
        {question.options.map((o) => (
          <li
            key={o.id}
            className={o.isCorrect ? "text-green-600 font-medium" : ""}
          >
            {processTextWithRichContent(o.text)} {o.isCorrect && "(Верный)"}
          </li>
        ))}
      </ul>
    </>
  );
}
