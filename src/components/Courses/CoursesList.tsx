import { CourseItemInList } from "@/types/courses/courses";
import React from "react";
import CourseCard from "./CourseCard";

interface CoursesListProps {
  courses: CourseItemInList[];
}

const CoursesList = ({ courses }: CoursesListProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Элементы отсутствуют
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Попробуйте изменить фильтры или создать новый курс.
        </p>
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
};

export default CoursesList;
