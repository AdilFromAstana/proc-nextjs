import React, { useState } from "react";
import { MediaFile } from "@/types/media";
import { FolderIcon } from "@/app/icons/FolderIcon";
import { FileDocumentIcon } from "@/app/icons/FileDocumentIcon";
import { VideoIcon } from "@/app/icons/VideoIcon";
import { AudioIcon } from "@/app/icons/AudioIcon";
import ContextMenu from "./ContextMenu";

const MediafilesListItem = ({
  mediafile,
  onOpenDetails,
  onOpenFolder,
  onFilesChange,
}: {
  mediafile: MediaFile;
  onOpenDetails: () => void;
  onOpenFolder: (folderId: number) => void;
  onFilesChange: () => void;
}) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  };

  const getImagePreview = () => {
    if (mediafile.type === "image" && mediafile.thumbs) {
      return mediafile.src;
    }
    return mediafile.src;
  };

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
        return (
          <div className="w-12 h-12 flex items-center justify-center">
            <FolderIcon color="#2563EB" height="24px" />
          </div>
        );
      case "document":
        return (
          <div className="w-12 h-12 flex items-center justify-center">
            <FileDocumentIcon color="#2563EB" height="24px" />
          </div>
        );
      case "video":
        return (
          <div className="w-12 h-12 flex items-center justify-center">
            <VideoIcon color="#2563EB" height="24px" />
          </div>
        );
      case "audio":
        return (
          <div className="w-12 h-12 flex items-center justify-center">
            <AudioIcon color="#2563EB" height="24px" />
          </div>
        );
      case "image":
        return (
          <div className="w-12 h-12 flex items-center justify-center">
            <img
              src={getImagePreview() || ""}
              alt={mediafile.name}
              className="max-h-12 object-contain"
              width="24"
              height="24"
            />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 flex items-center justify-center">
            <FileDocumentIcon color="#2563EB" height="24px" />
          </div>
        );
    }
  };

  return (
    <div
      className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-200 cursor-pointer relative"
      onClick={onOpenDetails}
      onContextMenu={handleContextMenu}
      onDoubleClick={() => {
        if (mediafile.type === "folder") {
          onOpenFolder(mediafile.id);
        }
      }}
    >
      {getFileIcon()}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {mediafile.name}
        </h3>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-600">{getFileType()}</h3>
      </div>
      <div className="flex-1 min-w-0">
        {mediafile.type !== "folder" ? (
          <h3 className="text-gray-600">
            {formatFileSize(mediafile.file_size)}
          </h3>
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-600">{formatDate(mediafile.created_at)}</h3>
      </div>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          mediafile={mediafile}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onOpen={onOpenDetails}
          onOpenFolder={onOpenFolder}
          onFilesChange={onFilesChange}
        />
      )}
    </div>
  );
};

export default MediafilesListItem;
