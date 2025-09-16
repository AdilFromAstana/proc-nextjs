import { useState } from "react";
import MediafileCard from "./MediafileCard";
import MediafilesListItem from "./MediafilesListItem";
import { MediaFile } from "@/types/media";
import FileDetailModal from "./FileDetailModal";
import { UploadIcon } from "@/app/icons/UploadIcon";
import UploadFileModal from "./UploadFileModal";

type Props = {
  mediafiles: MediaFile[];
  viewMode: "grid" | "list";
  onOpenFolder: (folderId: number) => void;
  onUploadSuccess: (newFile: MediaFile) => void;
  currentFolderId: number | null;
  onFilesChange: () => void;
};

export default function MediafilesList({
  mediafiles,
  viewMode,
  onOpenFolder,
  onUploadSuccess,
  currentFolderId,
  onFilesChange,
}: Props) {
  const [selectedMediafile, setSelectedMediafile] = useState<MediaFile | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUpload = () => {
    // Открываем модальное окно загрузки
    setUploadModalOpen(true);
  };

  const openModal = (mediafile: MediaFile) => {
    setSelectedMediafile(mediafile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMediafile(null);
  };

  if (mediafiles.length === 0) {
    return (
      <div>
        <div className="text-center py-12 text-[gray] text-2xl">
          В этой директории еще ничего нет
        </div>
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
            onClick={handleUpload}
          >
            <UploadIcon height="24" />
            <span>Загрузить</span>
          </button>
        </div>

        {uploadModalOpen && (
          <UploadFileModal
            onClose={() => setUploadModalOpen(false)}
            onUploadSuccess={onUploadSuccess}
            parentId={currentFolderId}
          />
        )}
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="flex">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(150,auto))] gap-6">
            {mediafiles.map((c) => (
              <MediafileCard
                key={c.id}
                mediafile={c}
                onOpenDetails={() => openModal(c)}
                onOpenFolder={onOpenFolder}
                onFilesChange={onFilesChange} // Передаем дальше
              />
            ))}
          </div>
        </div>

        {isModalOpen && selectedMediafile && (
          <div className="w-full max-w-md ml-6">
            <FileDetailModal
              mediafile={selectedMediafile}
              onClose={closeModal}
            />
          </div>
        )}

        {uploadModalOpen && (
          <UploadFileModal
            onClose={() => setUploadModalOpen(false)}
            onUploadSuccess={onUploadSuccess}
            parentId={currentFolderId}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="grid grid-cols-1 mr-10">
          {mediafiles.map((c) => (
            <MediafilesListItem
              key={c.id}
              mediafile={c}
              onOpenDetails={() => openModal(c)}
              onOpenFolder={onOpenFolder}
              onFilesChange={onFilesChange}
            />
          ))}
        </div>
      </div>

      {isModalOpen && selectedMediafile && (
        <div className="w-full max-w-md ml-6">
          <FileDetailModal mediafile={selectedMediafile} onClose={closeModal} />
        </div>
      )}

      {uploadModalOpen && (
        <UploadFileModal
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={onUploadSuccess}
          parentId={currentFolderId}
        />
      )}
    </div>
  );
}
