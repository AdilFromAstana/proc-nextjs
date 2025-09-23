// components/courses/CourseMaterials.tsx
import React, { useState } from "react";
import { ChevronDown } from "@/app/icons/Courses/ChevronDown";
import { ChevronUp } from "@/app/icons/Courses/ChevronUp";
import { MaterialsIcon } from "@/app/icons/Courses/MaterialsIcon";
import { FlagIcon } from "@/app/icons/Courses/FlagIcon";
import { CourseMaterialItem, MaterialItemData } from "@/types/courses/courses";

type MaterialsBlockProps = {
  groups: CourseMaterialItem[];
};

function getContrastColor(hexColor: string) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
}

function MaterialAvatar({ material }: { material: MaterialItemData }) {
  return (
    <div
      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3"
      style={{
        backgroundColor: material.color ? `#${material.color}` : "#e0e0e0",
      }}
    >
      {material.image ? (
        <img
          src={material.image}
          alt="Material"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span
          className="font-bold"
          style={{
            color: material.color
              ? getContrastColor(`#${material.color}`)
              : "#374151",
          }}
        >
          {material.name?.charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}

export function MaterialsBlock({ groups }: MaterialsBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        {/* Заголовок как кнопка */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-4 text-left"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <MaterialsIcon height={26} color="grey" />
              <span className="sr-only">Список материалов</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Список материалов</h3>
              <p className="text-sm text-gray-500">Задания</p>
            </div>
          </div>
          <div>
            {isOpen ? <ChevronUp height={26} /> : <ChevronDown height={26} />}
          </div>
        </button>

        {isOpen && (
          <>
            {groups && groups.length > 0 ? (
              <div className="p-4 bg-white">
                {groups.map((group) => (
                  <div key={group.id} className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 mr-3">
                        <FlagIcon height={26} color="grey" />
                        <span className="sr-only">Модуль</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-600">
                          {group.name}
                        </h4>
                        {group.description && (
                          <p className="text-sm text-gray-600">
                            {group.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {group.materials && group.materials.length > 0 && (
                      <>
                        {group.materials.map((material) => (
                          <div
                            key={material.id}
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MaterialAvatar material={material} />
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h5 className="font-medium text-gray-900">
                                  {material.name || `Материал #${material.id}`}
                                </h5>
                                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded capitalize">
                                  {material.type}
                                </span>
                              </div>
                              {material.short_description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {material.short_description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Элементы отсутствуют</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
