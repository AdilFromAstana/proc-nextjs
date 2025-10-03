"use client";

import React, { useState } from "react";
import { mockStudents, mockTeachers } from "@/mockData";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export default function CreateClassPage() {
  const [isEditing] = React.useState(true); // Всегда в режиме редактирования
  const [className, setClassName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedStudents, setSelectedStudents] = React.useState<number[]>([]);
  const [activeTab, setActiveTab] = React.useState<"students" | "teachers">(
    "students"
  );

  const allStudents = mockStudents;
  const allTeachers = mockTeachers;

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Создание класса</h1>
        <p className="text-gray-600">Заполните информацию о новом классе</p>
      </div>

      {/* Основная информация */}
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem
          value="basic-info"
          className="bg-white rounded-lg shadow-sm border"
        >
          <AccordionTrigger className="px-4 py-3 [&[data-state=open]]:rounded-b-none">
            <h2 className="text-sm font-medium text-gray-500">
              Основная информация
            </h2>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 rounded-b-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название группы *
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Введите название группы"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                placeholder="Введите краткое описание"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Осталось {200 - description.length} символа(-ов)
              </p>
            </div>

            {/* Кнопка сохранения */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  // Здесь будет логика сохранения
                  console.log("Сохранить класс:", { className, description });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Табы */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex space-x-4 mb-4 border-b pb-2">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 font-medium pb-1 ${
              activeTab === "students"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            Студенты
            <span className="text-sm text-gray-500">{allStudents.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("teachers")}
            className={`flex items-center gap-2 font-medium pb-1 ${
              activeTab === "teachers"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
            </svg>
            Преподаватели
            <span className="text-sm text-gray-500">{allTeachers.length}</span>
          </button>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>
                На странице {activeTab === "students" ? "10" : "5"}{" "}
                {activeTab === "students" ? "студентов" : "преподавателей"}
              </option>
            </select>
          </div>
        </div>

        {/* Выбор */}
        <div className="flex justify-between items-center mb-4 bg-gray-50 rounded-md p-3">
          <p className="text-sm text-gray-700">
            Выбрано {selectedStudents.length}{" "}
            {activeTab === "students"
              ? `студент${selectedStudents.length === 1 ? "" : "ов"}`
              : `преподавател${selectedStudents.length === 1 ? "ь" : "ей"}`}
          </p>
          <div className="flex gap-4">
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Добавить
            </button>
            <button className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Удалить
            </button>
          </div>
        </div>

        {/* Список */}
        <div className="space-y-2">
          {activeTab === "students"
            ? allStudents.map((student) => (
                <CollapsibleCard
                  key={student.id}
                  item={student}
                  itemType={activeTab}
                  title="Имя студента"
                />
              ))
            : allTeachers.map((teacher) => (
                <CollapsibleCard
                  key={teacher.id}
                  item={teacher}
                  itemType={activeTab}
                  title="Имя преподавателя"
                />
              ))}
        </div>
      </div>
    </div>
  );
}

interface CollapsibleCardProps {
  item: {
    id: string | number;
    name: string;
    avatar?: string;
    [key: string]: any; // для дополнительных полей
  };
  title: string;
  itemType: "students" | "teachers" | string;
  onOpen?: (id: string | number) => void;
  className?: string;
}

export function CollapsibleCard({
  title,
  item,
  itemType,
  onOpen,
  className = "",
}: CollapsibleCardProps) {
  const t = useTranslations();

  const [imgError, setImgError] = useState(false);

  const defaultAvatar =
    "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png";

  return (
    <Collapsible className={`group/collapsible ${className}`}>
      <CollapsibleTrigger className="w-full">
        <div
          className={`bg-blue-300 flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors hover:bg-gray-50`}
        >
          <span className="ml-2 transition-all duration-200">{item.name}</span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div
          className={`bg-white flex gap-3 p-3 border rounded-md transition-colors flex-col`}
        >
          <img
            src={imgError || !item.avatar ? defaultAvatar : item.avatar}
            alt={item.name}
            className="w-8 h-8 rounded-full object-cover"
            onError={() => setImgError(true)}
          />

          <div>{title}</div>
          <div className="transition-all duration-200">{item.name}</div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium w-fit"
            onClick={() => {
              console.log(`Open ${itemType}`, item.id);
              onOpen?.(item.id);
            }}
          >
            {t("btn-open")}
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
