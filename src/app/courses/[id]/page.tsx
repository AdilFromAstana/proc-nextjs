"use client";

import { fetchCourseById } from "@/api/courses";
import { InfoIcon } from "@/app/icons/InfoIcon";
import { GlobusIcon } from "@/app/icons/Courses/GlobusIcon";
import { CourseItem } from "@/types/courses/courses";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NewsBlock } from "@/components/Courses/CourseItemComponents/NewsBlock";
import { MaterialsBlock } from "@/components/Courses/CourseItemComponents/MaterialsBlock";
import { WarningIcon } from "@/app/icons/Courses/WarningIcon";
import { EditQuestionIcon } from "@/app/icons/Quiz";
import { fetchCertificatesList } from "@/api/certificates/listApi";
import { CashIcon } from "@/app/icons/Courses/CashIcon";

export default function CourseItemPage() {
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
                Редактировать
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <InfoIcon height={26} color="grey" />
                      <span className="sr-only">Информация</span>
                    </div>
                    <h2 className="ml-2 text-lg font-semibold text-gray-500">
                      О курсе
                    </h2>
                  </div>
                </div>

                <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <GlobusIcon height={20} color="#85a888" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Опубликовано
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Текущий курс опубликован и виден всем
                      </p>
                    </div>
                  </div>
                </div>

                {courseData.availability_type === "prepaid" && (
                  <div className="mb-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <CashIcon height={20} color="orange" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-700">
                          Платный контент
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          Доступ к курсу по предоплате
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {courseData.description && (
                  <div className="prose max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: courseData.description,
                      }}
                    />
                  </div>
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

            <NewsBlock records={courseData.records || []} />

            <MaterialsBlock groups={courseData.groups || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
