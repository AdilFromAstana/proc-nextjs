"use client";
import { File, Loader2, X } from "lucide-react"; // Добавил X для кнопки удаления
import React, { useState } from "react";

// Устанавливаем константы для ограничений
const MAX_FILE_SIZE_MB = 50;
const SUPPORTED_MIME_TYPES = ".docx,.xlsx,.csv";
const SUPPORTED_FILE_TEXT = "DOCX/EXCEL/CSV"; // Для отображения

const StepUpload = ({
  file,
  onFileChange,
  onFileRemove, // Новое свойство: обработчик удаления файла
}: {
  file: File | null;
  onFileChange: (f: File) => void;
  onFileRemove: () => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Состояние для ошибок

  const handleFileSelect = (f: File) => {
    if (!f) return;

    // 1. Проверка размера (UX: предотвращение загрузки слишком большого файла)
    const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (f.size > maxSize) {
      setError(`Размер файла не должен превышать ${MAX_FILE_SIZE_MB} МБ.`);
      return;
    }

    // 2. Проверка типа файла
    const fileExtension = f.name.split(".").pop()?.toLowerCase();
    const acceptedExtensions = SUPPORTED_MIME_TYPES.split(",").map((ext) =>
      ext.trim().replace(".", "")
    );

    if (!fileExtension || !acceptedExtensions.includes(fileExtension)) {
      setError(
        `Неподдерживаемый тип файла. Используйте ${SUPPORTED_FILE_TEXT}.`
      );
      return;
    }

    // Очистка ошибок и начало загрузки
    setError(null);
    setIsLoading(true);

    // Эмуляция загрузки
    setTimeout(() => {
      onFileChange(f);
      setIsLoading(false);
    }, 2000); // Уменьшил время загрузки для более быстрого тестирования
  };

  return (
    <div className="h-full flex flex-col">
      {/* ЗОНА ЗАГРУЗКИ */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
          }
        }}
        className={`flex flex-col items-center justify-center h-60 p-6 border-2 border-dashed rounded-xl transition-colors flex-1 relative ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : error
            ? "border-red-500" // Визуализация ошибки
            : "border-gray-300"
        }`}
      >
        {/* ИНДИКАТОР ЗАГРУЗКИ */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-700 font-medium">Загрузка файла...</p>
          </div>
        ) : (
          <>
            <File className="w-32 h-32 text-gray-400 mb-4" />
            <p className="text-gray-800 text-center mb-1 text-xl font-medium">
              Перетащите {SUPPORTED_FILE_TEXT} файл
            </p>
            {/* ДОБАВЛЕНИЕ ОГРАНИЧЕНИЙ (UX) */}
            <p className="text-sm text-gray-500 mb-4">
              Макс. размер: {MAX_FILE_SIZE_MB} МБ
            </p>

            <input
              type="file"
              className="hidden"
              id="file"
              accept={SUPPORTED_MIME_TYPES}
              onChange={(e) =>
                e.target.files && handleFileSelect(e.target.files[0])
              }
              // Очищаем значение, чтобы можно было загрузить тот же файл снова после ошибки
              onClick={(e) => ((e.target as HTMLInputElement).value = "")}
            />
            <label
              htmlFor="file"
              className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition text-xl"
            >
              Выбрать файл
            </label>
          </>
        )}
      </div>

      {/* СООБЩЕНИЕ ОБ ОШИБКЕ (UX) */}
      {error && (
        <div className="mt-4 p-3 border border-red-500 rounded-md bg-red-50">
          <p className="text-red-700 font-medium">Ошибка: {error}</p>
        </div>
      )}

      {/* ПОДТВЕРЖДЕНИЕ ЗАГРУЖЕННОГО ФАЙЛА С УПРАВЛЕНИЕМ */}
      {!isLoading && file && (
        <div className="mt-4 flex items-center justify-between p-3 border rounded-md bg-green-50 border-green-200">
          <div className="flex items-center gap-2">
            <File className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{file.name}</span>
          </div>
          {/* КНОПКА УДАЛЕНИЯ (UX) */}
          <button
            onClick={onFileRemove}
            className="p-1 rounded-full text-gray-400 hover:bg-green-100 hover:text-red-600 transition"
            aria-label="Удалить файл"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StepUpload;
