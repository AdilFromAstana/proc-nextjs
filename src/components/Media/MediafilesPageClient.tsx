"use client";

import React, { useState, useEffect } from "react";
import { filterMediafiles } from "@/lib/mediafiles/filters";
import { sortMediafiles } from "@/lib/mediafiles/sorting";
import Toolbar from "./Toolbar";
import MediafilesList from "./MediafilesList";
import { MediaFile } from "@/types/media";
import { fetchMediaFiles, openFolderById } from "@/api/mediafilesApi";
import { createFolder } from "@/api/mediafilesApi";
import Breadcrumb from "./Breadcrumb";
import UploadFileModal from "./UploadFileModal";

export default function MediafilesPageClient() {
  const [mediafiles, setMediafiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("name_asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderHistory, setFolderHistory] = useState<number[]>([]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  type BreadcrumbItem = {
    id: number;
    name: string;
  };

  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([
    { id: 0, name: "Главная" },
  ]);

  // Загрузка медиафайлов при монтировании компонента
  useEffect(() => {
    const loadMediaFiles = async () => {
      try {
        setLoading(true);
        let response;

        if (currentFolderId) {
          // Загружаем содержимое конкретной папки
          response = await openFolderById(currentFolderId);
        } else {
          // Загружаем корневые файлы
          response = await fetchMediaFiles();
        }

        setMediafiles(response.data);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить медиафайлы");
        console.error("Ошибка загрузки медиафайлов:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMediaFiles();
  }, [currentFolderId]);

  const updateBreadcrumbPath = (id: number, name: string) => {
    if (id === 0) {
      // Корень
      setBreadcrumbPath([{ id: 0, name: "Главная" }]);
    } else {
      // Добавляем новую папку в путь
      setBreadcrumbPath((prev) => [...prev, { id, name }]);
    }
  };

  // Добавляем функцию для обновления списка файлов
  const reloadMediaFiles = async () => {
    try {
      let response;
      if (currentFolderId) {
        response = await openFolderById(currentFolderId);
      } else {
        response = await fetchMediaFiles();
      }
      setMediafiles(response.data);
    } catch (err) {
      console.error("Ошибка перезагрузки файлов:", err);
    }
  };

  // Функция для загрузки файлов
  const handleUpload = () => {
    // Открываем модальное окно загрузки
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (newFile: MediaFile) => {
    // Добавляем новый файл в список
    setMediafiles((prev) => [...prev, newFile]);
  };

  const handleOpenFolder = (folderId: number) => {
    // Находим папку по ID
    const folder = mediafiles.find((f) => f.id === folderId);

    if (folder) {
      // Обновляем путь хлебных крошек
      updateBreadcrumbPath(folderId, folder.name);

      // Сохраняем текущую папку в историю
      if (currentFolderId !== null) {
        setFolderHistory((prev) => [...prev, currentFolderId]);
      }
      setCurrentFolderId(folderId);
    }
  };

  const handleBack = () => {
    if (folderHistory.length > 0) {
      // Берем последнюю папку из истории
      const previousFolderId = folderHistory[folderHistory.length - 1];
      setCurrentFolderId(previousFolderId);
      // Удаляем последнюю папку из истории
      setFolderHistory((prev) => prev.slice(0, -1));
    } else {
      // Если история пуста, возвращаемся в корень
      setCurrentFolderId(null);
      setBreadcrumbPath([{ id: 0, name: "Главная" }]);
    }
  };

  // Функция для создания новой папки
  const handleNewFolder = async () => {
    try {
      // Создаем папку в текущей директории
      const newFolder = await createFolder("Новая папка", currentFolderId); // currentFolderId может быть null
      console.log("Создана новая папка:", newFolder);

      // Добавляем новую папку в существующий список
      setMediafiles((prev) => [...prev, newFolder]);
    } catch (err) {
      console.error("Ошибка создания папки:", err);
      setError("Не удалось создать папку");
    }
  };

  const filtered = filterMediafiles(mediafiles, {
    searchQuery,
    statusFilter,
    typeFilter,
  });

  const sorted = sortMediafiles(filtered, sortOrder);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="font-medium">Ошибка загрузки</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toolbar
        viewMode={viewMode}
        onToggleView={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        onBack={handleBack}
        onUpload={handleUpload}
        onNewFolder={handleNewFolder}
      />

      <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
      {uploadModalOpen && (
        <UploadFileModal
          onClose={() => setUploadModalOpen(false)}
          parentId={currentFolderId}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      <MediafilesList
        mediafiles={sorted}
        viewMode={viewMode}
        onOpenFolder={handleOpenFolder}
        onUploadSuccess={handleUploadSuccess}
        currentFolderId={currentFolderId}
        onFilesChange={reloadMediaFiles}
      />
    </>
  );
}
