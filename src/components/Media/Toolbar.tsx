"use client";

import { BackDirectoryIcon } from "@/app/icons/BackDirectoryIcon";
import { GridViewIcon } from "@/app/icons/GridViewIcon";
import { ListViewIcon } from "@/app/icons/ListViewIcon";
import { NewFolderIcon } from "@/app/icons/NewFolderIcon";
import { UploadIcon } from "@/app/icons/UploadIcon";

type Props = {
  viewMode: "grid" | "list";
  onToggleView: () => void;
  onBack?: () => void;
  onUpload?: () => void;
  onNewFolder?: () => void;
};

export default function Toolbar({
  viewMode,
  onToggleView,
  onBack,
  onUpload,
  onNewFolder,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {onBack && (
        <div onClick={onBack} className="cursor-pointer">
          <BackDirectoryIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
        </div>
      )}

      {onUpload && (
        <div onClick={onUpload} className="cursor-pointer">
          <UploadIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
        </div>
      )}

      {onNewFolder && (
        <div onClick={onNewFolder} className="cursor-pointer">
          <NewFolderIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
        </div>
      )}

      <div onClick={onToggleView} className="cursor-pointer">
        {viewMode === "grid" ? (
          <GridViewIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
        ) : (
          <ListViewIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
        )}
      </div>
    </div>
  );
}
