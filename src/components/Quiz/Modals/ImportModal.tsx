// components/Quiz/Modals/ImportModal.tsx
import MediafilesPageClient from "@/components/Media/MediafilesPageClient";
import React, { useState } from "react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export default function ImportModal({
  isOpen,
  onClose,
  onAdd,
}: ImportModalProps) {
  const [fileName, setFileName] = useState("");

  if (!isOpen) return null;

  const handleFileImport = () => {
    // Здесь будет логика импорта файла
    onAdd({ filename: fileName || "Импортированный файл" });
  };

  // return (
  //   <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
  //     <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
  //       <div className="p-6">
  //         <div className="flex justify-between items-center mb-4">
  //           <h2 className="text-xl font-semibold">
  //             Импортировать вопросы из файла
  //           </h2>
  //           <button
  //             onClick={onClose}
  //             className="text-gray-500 hover:text-gray-700 text-2xl"
  //           >
  //             ×
  //           </button>
  //         </div>

  //         <div className="space-y-4">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Выберите файл
  //             </label>
  //             <input
  //               type="file"
  //               onChange={(e) => {
  //                 const file = e.target.files?.[0];
  //                 if (file) {
  //                   setFileName(file.name);
  //                 }
  //               }}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md"
  //               accept=".txt,.csv,.json"
  //             />
  //             {fileName && (
  //               <p className="text-sm text-gray-600 mt-1">
  //                 Выбран файл: {fileName}
  //               </p>
  //             )}
  //           </div>

  //           <div className="flex justify-end space-x-3 pt-4">
  //             <button
  //               onClick={onClose}
  //               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
  //             >
  //               Отмена
  //             </button>
  //             <button
  //               onClick={handleFileImport}
  //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
  //             >
  //               Импортировать
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <MediafilesPageClient />
      </div>
    </div>
  );
}
