"use client";

import React, { useState, useEffect } from "react";
import { CourseItem, CourseItemEdit } from "@/types/courses/courses";
import { useRouter, useParams } from "next/navigation";
import { deleteCourse, fetchCourseByIdEdit, updateCourse } from "@/api/courses";
import { fetchCertificateById } from "@/api/certificates/listApi";
import { CertificateItem } from "@/types/certificates/certificates";
import { SaveIcon } from "@/app/icons/Quiz/QuizHeaderIcons/SaveIcon";
import { DeleteIcon } from "@/app/icons/DeleteIcon";
import { CloseIcon } from "@/app/icons/Quiz/QuizHeaderIcons/CloseIcon";
import { HeaderActions } from "@/components/Quiz/HeaderActions";
import axiosClient from "@/api/axiosClient";

export default function CourseEditPage() {
  const router = useRouter();
  const params = useParams();

  const [courseItemData, setCourseItemData] = useState<CourseItem | null>(null);
  const [courseCertificate, setCourseCertificate] =
    useState<CertificateItem | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!params.id || isNaN(Number(params.id))) {
        throw new Error("Некорректный ID курса");
      }

      const response = await fetchCourseByIdEdit(Number(params.id));
      setCourseItemData(response.entity);
    } catch (err) {
      console.error("Ошибка загрузки курса:", err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки курса");
    } finally {
      setLoading(false);
    }
  };

  const loadCertificate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchCertificateById(
        courseItemData.certificate_id
      );
      setCourseCertificate(response.entity);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [params.id]);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (courseItemData) {
      setCourseItemData((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setUploadingImage(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosClient.post("/upload.json", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = response.data.src;

        console.log("imageUrl: ", response);

        if (courseItemData) {
          setCourseItemData((prev) => ({
            ...prev!,
            image: imageUrl,
          }));
        }
      } catch (err) {
        console.error("Ошибка при загрузке изображения:", err);
        setError(
          "Не удалось загрузить изображение. Пожалуйста, попробуйте снова."
        );
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleStatusChange = (status: "draft" | "published") => {
    if (courseItemData) {
      setCourseItemData((prev) => ({
        ...prev!,
        status,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseItemData) return;

    setSaving(true);
    setError(null);

    try {
      const courseToUpdate: CourseItemEdit = {
        id: courseItemData.id,
        owner_id: courseItemData.owner_id,
        invite_code_id: courseItemData.invite_code_id,
        certificate_id: courseItemData.certificate_id,
        status: courseItemData.status,
        availability_type: courseItemData.availability_type,
        image: courseItemData.image,
        name: courseItemData.name,
        description: courseItemData.description || "",
        short_description: courseItemData.short_description || "",
        starting_at_type: courseItemData.starting_at_type,
        starting_at: courseItemData.starting_at,
        ending_at_type: courseItemData.ending_at_type,
        ending_at: courseItemData.ending_at,
        certificate: null,
        invite_code: null,
        groups: [],
        records: [],
        teachers: [],
        students: [],
        products: [],
        settings: [],
        removed_teachers: [],
        removed_students: [],
        removed_records: [],
        removed_products: [],
        removed_groups: [],
        removed_materials: [],
        materials_count: courseItemData.materials_count || 0,
        students_count: courseItemData.students_count || 0,
        teachers_count: courseItemData.teachers_count || 0,
        records_count: courseItemData.records_count || 0,
        products_count: courseItemData.products_count || 0,
      };

      const updatedCourse = await updateCourse(
        courseItemData.id,
        courseToUpdate
      );

      router.push(`/courses/${updatedCourse.entity.id}`);
    } catch (err) {
      console.error("Ошибка при сохранении курса:", err);
      setError("Не удалось сохранить курс. Пожалуйста, попробуйте снова.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!courseItemData) return;

    if (window.confirm("Вы уверены, что хотите удалить этот курс?")) {
      try {
        await deleteCourse(courseItemData.id);

        router.push("/courses");
      } catch (err) {
        console.error("Ошибка при удалении курса:", err);
        alert("Не удалось удалить курс");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !courseItemData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            {error || "Курс не найден"}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadCourse}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Повторить попытку
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Редактирование курса
          </h1>

          <HeaderActions
            actions={[
              {
                icon: SaveIcon,
                label: "Сохранить",
                onClick: handleSubmit,
                className: "hover:text-blue-600 hover:bg-blue-50",
              },
              {
                icon: DeleteIcon,
                label: "Удалить",
                onClick: handleDelete,
                className: "hover:text-red-600 hover:bg-red-50",
              },
              {
                icon: CloseIcon,
                label: "Закрыть",
                onClick: () => router.back(),
                className: "hover:text-gray-800 hover:bg-gray-100",
              },
            ]}
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200">
              <div className="relative h-48 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                {uploadingImage ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-sm text-gray-500">
                      Загрузка изображения...
                    </p>
                  </div>
                ) : imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Превью"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : courseItemData?.image ? (
                  <img
                    src={courseItemData.image}
                    alt="Текущее изображение"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <p className="mt-2 text-sm text-gray-500">
                      Выбрать изображение
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Статус
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {courseItemData?.status === "draft"
                    ? "Не видно никому кроме вас"
                    : "Видно всем, за исключением приватного доступа"}
                </p>
                <div className="mt-2 flex space-x-2">
                  {(["draft", "published"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        courseItemData?.status === status
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status === "draft" ? "Черновик" : "Опубликован"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Название курса
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={courseItemData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="p-6 border-b border-gray-200">
              <label
                htmlFor="short_description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Краткое описание
              </label>
              <textarea
                id="short_description"
                name="short_description"
                value={courseItemData.short_description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Краткое описание курса..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Осталось {200 - (courseItemData.short_description?.length || 0)}{" "}
                символа(-ов)
              </p>
            </div>

            <div className="p-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Полное описание
              </label>
              <textarea
                id="description"
                name="description"
                value={courseItemData.description || ""}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Полное описание курса..."
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
