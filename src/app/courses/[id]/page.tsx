"use client";

import { fetchCourseById } from "@/api/courses";
import { InfoIcon } from "@/app/icons/InfoIcon";
import { GlobusIcon } from "@/app/icons/Courses/GlobusIcon";
import { CourseItem } from "@/types/courses/courses";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NewsBlock } from "@/components/Courses/CourseItemComponents/NewsBlock";
import { MaterialsBlock } from "@/components/Courses/CourseItemComponents/MaterialsBlock";
import { EditQuestionIcon } from "@/app/icons/Quiz";
import { CashIcon } from "@/app/icons/Courses/CashIcon";
import { useTranslations } from "next-intl";
import { WarningIcon } from "@/app/icons/Courses/WarningIcon";

export default function CourseItemPage() {
  const t = useTranslations();

  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<CourseItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!params.id || isNaN(Number(params.id))) {
        throw new Error("Некорректный ID курса");
      }

      const response = await fetchCourseById(Number(params.id));
      setCourseData(response.entity);
    } catch (err) {
      console.error("Ошибка загрузки курса:", err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки курса");
      setCourseData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = () => {
    router.push(`/courses/${params.id}/edit`);
  };

  const courseStatusRender = (status: "published" | "draft") => {
    const isPublished = status === "published";

    const statusStyles = {
      published: {
        container: "bg-green-50 border border-green-200",
        iconColor: "#10b981",
        title: "text-green-800",
        description: "text-green-600",
      },
      draft: {
        container: "bg-yellow-50 border border-yellow-200",
        iconColor: "#f59e0b",
        title: "text-yellow-800",
        description: "text-yellow-600",
      },
    };

    const styles = isPublished ? statusStyles.published : statusStyles.draft;

    return (
      <div className={`mb-4 p-4 rounded-lg ${styles.container}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            {isPublished ? (
              <GlobusIcon height={20} color={styles.iconColor} />
            ) : (
              <WarningIcon height={20} color={styles.iconColor} />
            )}
          </div>
          <div>
            <p className={`text-sm font-medium ${styles.title}`}>
              {isPublished
                ? t("label-course-status-published-title")
                : t("label-course-status-draft-title")}
            </p>
            <p className={`text-xs ${styles.description} mt-1`}>
              {isPublished
                ? t("label-course-status-published-description")
                : t("label-course-status-draft-description")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const courseAvailabilityRender = (type: "free" | "private" | "prepaid") => {
    const availabilityConfig = {
      free: {
        container: "bg-blue-50 border border-blue-200",
        iconColor: "#3b82f6",
        title: t("label-course-type-free-title"),
        description: t("label-course-type-free-description"),
        titleColor: "text-blue-800",
        descriptionColor: "text-blue-600",
      },
      private: {
        container: "bg-purple-50 border border-purple-200",
        iconColor: "#8b5cf6",
        title: t("label-course-type-private-title"),
        description: t("label-course-type-private-description"),
        titleColor: "text-purple-800",
        descriptionColor: "text-purple-600",
      },
      prepaid: {
        container: "bg-orange-50 border border-orange-200",
        iconColor: "#f97316",
        title: t("label-course-type-prepaid-title"),
        description: t("label-course-type-prepaid-description"),
        titleColor: "text-orange-800",
        descriptionColor: "text-orange-600",
      },
    };

    const config = availabilityConfig[type];

    return (
      <div className={`mb-4 p-4 rounded-lg ${config.container}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <CashIcon height={20} color={config.iconColor} />
          </div>
          <div>
            <p className={`text-sm font-medium ${config.titleColor}`}>
              {config.title}
            </p>
            <p className={`text-xs ${config.descriptionColor} mt-1`}>
              {config.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    loadCourse();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={loadCourse}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl">Курс не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {courseData.name}
                </h1>
                {courseData.short_description && (
                  <p className="mt-2 text-gray-600">
                    {courseData.short_description}
                  </p>
                )}
              </div>

              <button
                onClick={handleEditCourse}
                className="flex items-center px-4 py-2 gap-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <EditQuestionIcon height={20} color="white" />
                {t("btn-edit")}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0">
                    <InfoIcon height={26} color="grey" />
                  </div>
                  <h2 className="ml-2 text-lg font-semibold text-gray-500">
                    {t("label-course-about")}
                  </h2>
                </div>

                {courseStatusRender(courseData.status)}
                {courseAvailabilityRender(courseData.availability_type)}

                {courseData.description ? (
                  <div className="prose max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: courseData.description,
                      }}
                    />
                  </div>
                ) : (
                  <div className="">{t("label-empty-description")}</div>
                )}
              </div>

              {courseData.image && (
                <div className="flex justify-center md:justify-end">
                  <img
                    src={courseData.image}
                    alt={courseData.name}
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {courseData.records.length > 0 && (
              <NewsBlock records={courseData.records} />
            )}

            {courseData.groups.length > 0 && (
              <MaterialsBlock groups={courseData.groups} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
