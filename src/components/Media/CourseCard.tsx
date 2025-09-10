"use client";

import React from "react";
import { CourseItem, CourseStatus, CourseType } from "@/mockData";

const CourseCard = ({ course }: { course: CourseItem }) => {
  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: CourseType) => {
    switch (type) {
      case "free":
        return "Бесплатный";
      case "paid":
        return "По предоплате";
      case "private":
        return "Приватный";
      default:
        return type;
    }
  };

  const getTypeColor = (type: CourseType) => {
    switch (type) {
      case "free":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-purple-100 text-purple-800";
      case "private":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 flex items-center justify-center">
        {/* placeholder instead of image */}
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
};

export default CourseCard;
