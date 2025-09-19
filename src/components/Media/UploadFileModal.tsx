import { uploadMediaFile } from "@/api/media/mediafilesApi";
import { CloseButtonIcon } from "@/app/icons/CloseButtonIcon";
import { UploadIcon } from "@/app/icons/UploadIcon";
import { MediaFile } from "@/types/media";
import React, { useState } from "react";

interface UploadModalProps {
  onClose: () => void;
  parentId: number | null; // Добавляем parentId
  onUploadSuccess: (newFile: MediaFile) => void; // Callback для обновления списка
}

const UploadFileModal = ({
  onClose,
  parentId,
  onUploadSuccess,
}: UploadModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Обработчик перетаскивания
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Обработчик выбора файла
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Обработчик загрузки файла
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Обработчик отправки файлов
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Загружаем каждый файл по отдельности
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Обновляем прогресс
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));

        // Загружаем файл
        await uploadMediaFile(file, parentId);
      }

      // Закрываем модальное окно
      onClose();

      // Вызываем callback для обновления списка файлов в родительском компоненте
      // Но теперь это будет через onFilesChange, а не onUploadSuccess
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
      alert("Ошибка при загрузке файлов");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative w-full max-w-md mx-auto mt-16 mb-16 p-6 bg-white rounded-lg shadow-xl">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Загрузка</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CloseButtonIcon height="24" />
          </button>
        </div>

        <p className="text-gray-600 mb-8">
          Здесь вы можете загрузить видео, аудио, изображение, документ или
          zip-файл
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
              id="file-upload"
            />

            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <UploadIcon height="64" color="gray" />

              <p className="text-gray-500">
                Переместите сюда файл или выберите с устройства
              </p>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={selectedFiles.length === 0}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                selectedFiles.length > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Загрузить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFileModal;
