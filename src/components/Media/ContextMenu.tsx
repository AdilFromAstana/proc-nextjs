import React, { useEffect, useRef, useState } from "react";
import { MediaFile } from "@/types/media";
import { renameMediaFile, deleteMediaFile } from "@/api/media/mediafilesApi";
import { EyeIcon } from "@/app/icons/EyeIcon";
import { CutIcon } from "@/app/icons/CutIcon";
import { RenameIcon } from "@/app/icons/RenameIcon";
import { DeleteIcon } from "@/app/icons/DeleteIcon";

interface FileContextMenuProps {
  x: number;
  y: number;
  mediafile: MediaFile;
  onClose: () => void;
  onOpen: () => void;
  onOpenFolder?: (folderId: number) => void;
  onFilesChange: () => void;
}

const FileContextMenu = ({
  x,
  y,
  mediafile,
  onClose,
  onOpen,
  onOpenFolder,
  onFilesChange,
}: FileContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newName, setNewName] = useState(mediafile.name);

  // Обработчики событий
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleContextmenu = (e: Event) => e.preventDefault();

    // Подписки на события
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("contextmenu", handleContextmenu);

    return () => {
      // Отписки от событий
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, [onClose]);

  // Обработчики действий
  const handleDelete = async () => {
    try {
      await deleteMediaFile(mediafile.id);
      onFilesChange();
    } catch (error) {
      console.error("Ошибка удаления файла:", error);
      alert("Не удалось удалить файл");
    } finally {
      onClose();
    }
  };

  const handleOpenClick = () => {
    if (mediafile.type === "folder" && onOpenFolder) {
      onOpenFolder(mediafile.id);
    } else {
      onOpen();
    }
    onClose();
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== mediafile.name) {
      try {
        await renameMediaFile(mediafile.id, newName.trim());
        onFilesChange();
      } catch (error) {
        console.error("Ошибка переименования файла:", error);
        alert("Не удалось переименовать файл");
      }
    }
    setShowRenameInput(false);
    onClose();
  };

  // Компонент переименования
  if (showRenameInput) {
    return (
      <div
        ref={menuRef}
        className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 p-4 min-w-[200px]"
        style={{
          left: Math.min(x, window.innerWidth - 200),
          top: Math.min(y, window.innerHeight - 150),
        }}
      >
        <form onSubmit={handleRenameSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRenameInput(false);
                onClose();
              }}
              className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[180px]"
      style={{
        left: Math.min(x, window.innerWidth - 180),
        top: Math.min(y, window.innerHeight - 200),
      }}
    >
      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
        onClick={handleOpenClick}
      >
        <EyeIcon width={18} className="mr-2" />
        Открыть
      </button>

      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
        onClick={() => {
          console.log("Вырезать файл:", mediafile.id);
          onClose();
        }}
      >
        <CutIcon width={18} className="mr-2" />
        Вырезать
      </button>

      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
        onClick={() => setShowRenameInput(true)}
      >
        <RenameIcon width={18} className="mr-2" />
        Переименовать
      </button>

      <hr className="my-1" />

      <button
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
        onClick={handleDelete}
      >
        <DeleteIcon width={18} className="mr-2" />
        Удалить
      </button>
    </div>
  );
};

export default FileContextMenu;
