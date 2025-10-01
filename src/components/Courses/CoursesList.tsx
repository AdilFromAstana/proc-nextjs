import { CourseItemInList } from "@/types/courses/courses";
import React from "react";
import CourseCard from "./CourseCard";
import { useTranslations } from "next-intl";

interface CoursesListProps {
  courses: CourseItemInList[];
}

export default function CoursesList({ courses }: CoursesListProps) {
  const t = useTranslations();
  if (courses.length === 0) {
    return (
      <div className="text-center ">
        <h3 className="mt-2 font-medium text-gray-900">
          {t("label-empty-elements")}
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
