"use client";

import { CourseItem } from "@/mockData";

type Props = {
  course: CourseItem;
  viewMode: "grid" | "list";
};

export default function CourseListItem({ course, viewMode }: Props) {
  if (viewMode === "grid") {
    return (
      <div className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-48 flex items-center justify-center">
          <svg
            width="144"
            height="108"
            viewBox="0 0 48 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="144" height="108" rx="10" fill="#EEF4FF" />
            <path
              d="M14 14C14 12.8954 14.8954 12 16 12H20.5858C21.1166 12 21.6247 12.2107 22 12.5858L23.4142 14H32C33.1046 14 34 14.8954 34 16V24C34 25.1046 33.1046 26 32 26H16C14.8954 26 14 25.1046 14 24V14Z"
              fill="#2563EB"
            />
          </svg>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-center text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
        </div>
      </div>
    );
  }

  // list mode
  return (
    <div className="border rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <svg
        width="48"
        height="36"
        viewBox="0 0 48 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="36" rx="6" fill="#EEF4FF" />
        <path
          d="M14 14C14 12.8954 14.8954 12 16 12H20.5858C21.1166 12 21.6247 12.2107 22 12.5858L23.4142 14H32C33.1046 14 34 14.8954 34 16V24C34 25.1046 33.1046 26 32 26H16C14.8954 26 14 25.1046 14 24V14Z"
          fill="#2563EB"
        />
      </svg>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{course.title}</h3>
      </div>
    </div>
  );
}
