import React from "react";
import { FolderIcon } from "@/app/icons/FolderIcon";

type BreadcrumbItem = {
  id: number;
  name: string;
};

type Props = {
  path: BreadcrumbItem[];
  onBack?: () => void;
};

export default function Breadcrumb({ path, onBack }: Props) {
  if (path.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          {/* Иконка папки */}
          <div className="flex items-center justify-center w-4 h-4">
            <FolderIcon color="#f1d592" height="16" />
          </div>

          {/* Название папки */}
          <span
            className={`font-medium ${
              index === path.length - 1
                ? "text-gray-900"
                : "text-blue-600 hover:text-blue-800 cursor-pointer"
            }`}
            onClick={
              index === path.length - 1
                ? undefined
                : () => {
                    // Обработка клика на папку (кроме последней)
                    if (onBack && index < path.length - 1) {
                      onBack();
                    }
                  }
            }
          >
            {item.name}
          </span>

          {/* Разделитель */}
          {index < path.length - 1 && (
            <span className="text-gray-400 mx-1">›</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
