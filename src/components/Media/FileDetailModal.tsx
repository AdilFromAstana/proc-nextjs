import React from "react";
import { MediaFile } from "@/types/media";
import { CloseButtonIcon } from "@/app/icons/CloseButtonIcon";
import { FolderIcon } from "@/app/icons/FolderIcon";
import { FileDocumentIcon } from "@/app/icons/FileDocumentIcon";
import { VideoIcon } from "@/app/icons/VideoIcon";
import { AudioIcon } from "@/app/icons/AudioIcon";

interface FileDetailModalProps {
  mediafile: MediaFile;
  onClose: () => void;
}

const FileDetailModal = ({ mediafile, onClose }: FileDetailModalProps) => {
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileType = (): string => {
    switch (mediafile.type) {
      case "folder":
        return "Папка";
      case "image":
        return "Изображение";
      case "document":
        return "Документ";
      case "video":
        return "Видео";
      case "audio":
        return "Аудио";
      default:
        return mediafile.mime_type || "Файл";
    }
  };

  const getFileIcon = () => {
    switch (mediafile.type) {
      case "folder":
        return <FolderIcon color="white" height="64px" />;
      case "document":
        return <FileDocumentIcon color="white" height="64px" />;
      case "video":
        return <VideoIcon color="white" height="64px" />;
      case "audio":
        return <AudioIcon color="white" height="64px" />;
      case "image":
        return (
          <img
            src={mediafile.path || ""}
            alt={mediafile.name}
            className="w-full h-full object-cover"
          />
        );
      default:
        return <FileDocumentIcon color="#2563EB" height="48px" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg max-w-md w-full relative">
      <CloseButtonIcon
        color="gray"
        onClick={onClose}
        height="24"
        className="absolute top-4 right-4 cursor-pointer hover:opacity-75 transition-opacity"
      />
      <div className="p-6 pt-12">
        {/* Превью */}
        <div className="mb-6">
          <div className="w-full h-84 bg-black flex items-center justify-center rounded-lg">
            <div className="text-gray-500 text-center">{getFileIcon()}</div>
          </div>
        </div>

        {/* Информация */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Наименование</p>
            <p className="text-white">{mediafile.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Тип файла</p>
            <p className="text-white">{getFileType()}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Размер файла</p>
            <p className="text-white">{formatFileSize(mediafile.file_size)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Создан</p>
            <p className="text-white">{formatDate(mediafile.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailModal;
