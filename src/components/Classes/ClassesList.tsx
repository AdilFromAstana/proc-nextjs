"use client";

import { fetchClassesList } from "@/api/classes";
import { ClassEntity } from "@/types/classes/classes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";

interface ClassesListProps {
  classes: ClassEntity[];
}

export default function ClassesList({ classes }: ClassesListProps) {
  const t = useTranslations();
  const router = useRouter();

  const handleCreateClass = () => {
    router.push("/classes/create");
  };

  const handleClassClick = (classId: number) => {
    router.push(`/classes/${classId}`);
  };

  if (classes.length === 0) {
    return (
      <div className="w-full m-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">{t("label-upload")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {classes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t("label-empty-elements")}
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleClassClick(lesson.id)}
              className="bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer rounded-lg"
            >
              <div className="flex items-start">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg"
                  style={{
                    backgroundColor: lesson.color
                      ? `#${lesson.color}`
                      : "#6b7280",
                  }}
                >
                  {lesson.image ? (
                    <img
                      src={lesson.image}
                      alt={lesson.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    lesson.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {lesson.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 truncate">
                    {lesson.description || t("label-empty-description")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
