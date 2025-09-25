// components/modals/FileUploadSection.tsx
import BgdButton from "@/components/Chunks/BgdButton";
import BgdFormItem from "@/components/Chunks/BgdFormItem";
import React from "react";

interface FileUploadSectionProps {
  uploadedFile: any;
  errors: Record<string, string[]>;
  t: (key: string) => string;
  onFileUpload: (fileData: any) => void;
  onRemoveFile: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploadedFile,
  errors,
  t,
  onFileUpload,
  onRemoveFile,
}) => {
  return (
    <BgdFormItem
      label={t("label-import-quiz-file")}
      hint={t("hint-import-quiz-file")}
      error={errors.file ? errors.file[0] : undefined}
    >
      {!uploadedFile ? (
        <BgdButton
          color="blue"
          size="medium"
          type="file"
          accept=".xls, .xlsx, .csv"
          onFileUploaded={onFileUpload}
        >
          📁 {t("btn-upload-file")}
        </BgdButton>
      ) : (
        <div className="bg-green-50 border-2 border-green-200 border-solid rounded px-3 py-3 relative inline-block">
          <div className="text-gray-800 text-sm font-semibold">
            {uploadedFile.file_name}
          </div>
          <div className="text-gray-600 text-xs mt-1">
            {Math.round(uploadedFile.file_size / 1024)} kb
          </div>
          <button
            onClick={onRemoveFile}
            className="absolute -top-2.5 -right-2.5 w-5 h-5 leading-5 rounded-full bg-red-600 text-white text-center text-xs hover:bg-red-700"
          >
            ×
          </button>
        </div>
      )}
    </BgdFormItem>
  );
};

export default FileUploadSection;
