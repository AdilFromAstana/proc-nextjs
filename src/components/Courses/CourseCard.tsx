import React from "react";
import { CourseItemInList } from "@/types/courses/courses";
import { useRouter } from "next/navigation";
import { GlobusIcon } from "@/app/icons/Courses/GlobusIcon";
import { useTranslations } from "next-intl";

interface CourseCardProps {
  course: CourseItemInList;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const t = useTranslations();

  const router = useRouter();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "published":
        return {
          label: t("label-course-status-published"),
          color: "bg-green-100 text-green-800",
        };
      case "draft":
        return {
          label: t("label-course-status-draft"),
          color: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case "free":
        return {
          label: "Бесплатный",
          color: "bg-blue-100 text-blue-800",
        };
      case "paid":
        return {
          label: "По предоплате",
          color: "bg-purple-100 text-purple-800",
        };
      case "private":
        return {
          label: "Приватный",
          color: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          label: type,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const handleCardClick = () => {
    router.push(`/courses/${course.id}`);
  };

  const statusInfo = getStatusInfo(course.status);

  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="h-48 bg-gray-200 relative">
        {course.image && (
          <img
            src={course.image}
            alt={course.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.name}
        </h3>
        {course.short_description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {course.short_description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
