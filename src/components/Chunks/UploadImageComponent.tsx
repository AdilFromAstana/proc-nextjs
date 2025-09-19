// components/Chunks/UploadImageComponent.tsx
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface UploadImageComponentProps {
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  action?: string;
  accept?: string;
  maxSize?: number; // в байтах
}

export const UploadImageComponent: React.FC<UploadImageComponentProps> = ({
  value = "",
  onChange,
  name = "file",
  action = "/api/upload.json",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB по умолчанию
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл изображения",
      });
      return false;
    }

    // Проверка размера файла
    if (file.size > maxSize) {
      toast({
        title: "Ошибка",
        description: `Файл слишком большой. Максимальный размер: ${
          maxSize / 1024 / 1024
        }MB`,
      });
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append(name, file);

    const response = await fetch(action, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Ошибка загрузки файла");
    }

    const result = await response.json();
    return result.url || result.data?.url || "";
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);

    try {
      // Создаем preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Загружаем файл
      const uploadedUrl = await uploadFile(file);
      onChange(uploadedUrl);

      toast({
        title: "Успех",
        description: "Изображение успешно загружено",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
      });
      // Возвращаем предыдущее значение
      setPreview(value);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-image-component">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={isUploading}
      />

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-gray-400">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-60 rounded-lg object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <ImageIcon className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Перетащите изображение сюда или нажмите для загрузки
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF до {maxSize / 1024 / 1024}MB
              </p>
            </div>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : preview ? (
            "Изменить изображение"
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Выбрать изображение
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
