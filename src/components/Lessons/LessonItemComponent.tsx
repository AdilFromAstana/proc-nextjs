import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { LessonDetailResponse } from "@/types/lessons/lessonQuestions";
import LessonChaptersComponent from "./LessonChaptersComponent";

type Props = {
  lesson: LessonDetailResponse | null;
};

export default function LessonItemComponent({ lesson }: Props) {
  console.log("lesson item: ", lesson);

  if (!lesson?.entity) {
    return <div>Нет данных о уроке</div>;
  }
  const [lessonName, setLessonName] = useState(lesson.entity.name || "");
  const [lessonDescription, setLessonDescription] = useState(
    lesson.entity.description || ""
  );

  const remainingChars = 200 - lessonDescription.length;
  return (
    <div className="w-full m-8">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900">
          {lesson.entity.name || "Новый тест"}
        </h1>
      </div>
      <Accordion type="multiple" className="w-full mt-4 space-y-2 mb-4">
        <AccordionItem
          value="main-info"
          className="p-4 border border-gray-200 rounded-md"
        >
          <AccordionTrigger>Основная информация</AccordionTrigger>
          <AccordionContent>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название теста
              </label>
              <input
                type="text"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                placeholder="Введите название теста"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                maxLength={200}
                placeholder="Описание теста"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 resize-none"
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">
                Осталось {remainingChars} символа(-ов)
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <LessonChaptersComponent lesson={lesson} />
    </div>
  );
}
