"use client";

import React, { useState } from "react";
import { MediaFile } from "@/types/media";
import { FolderIcon } from "@/app/icons/FolderIcon";
import { FileDocumentIcon } from "@/app/icons/FileDocumentIcon";
import { VideoIcon } from "@/app/icons/VideoIcon";
import { AudioIcon } from "@/app/icons/AudioIcon";
import ContextMenu from "./ContextMenu";

const MediafileCard = ({
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

  const openInNewTab = (url: string) => {
    const win = window.open(url, "_blank");
    if (win) {
      win.focus();
    }
  };

  const handleDoubleClick = () => {
    if (mediafile.type === "folder") {
      onOpenFolder(mediafile.id);
    } else if (mediafile.type === "image" && mediafile.path) {
      openInNewTab(mediafile.path);
    }
  };

  const getImagePreview = () => {
    if (mediafile.type === "image" && mediafile.thumbs) {
      return mediafile.src!;
    }
    return mediafile.src!;
  };

  const getFileIcon = () => {
    switch (mediafile.type) {
      case "folder":
        return <FolderIcon color="#2563EB" height="48px" />;
      case "document":
        return <FileDocumentIcon color="#2563EB" height="48px" />;
      case "video":
        return <VideoIcon color="#2563EB" height="48px" />;
      case "audio":
        return <AudioIcon color="#2563EB" height="48px" />;
      case "image":
        return (
          <img
            src={getImagePreview()}
            alt={mediafile.name}
            className="max-h-48 object-contain"
          />
        );
      default:
        return <FileDocumentIcon color="#2563EB" height="48px" />;
    }
  };

  return (
    <div
      className="overflow-hidden hover:shadow-md transition-shadow group relative"
      onClick={onOpenDetails}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center justify-center rounded-lg bg-[#EEF4FF] w-[144px] h-[108px] mx-auto border-2 border-transparent group-hover:border-blue-500 transition-colors">
        {getFileIcon()}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-center text-gray-900 mb-2 line-clamp-2">
          {mediafile.name}
        </h3>
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

export default MediafileCard;
