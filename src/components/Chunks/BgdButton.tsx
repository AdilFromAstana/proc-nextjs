// components/ui/BgdButton.tsx
import React, { useRef, useState } from "react";

interface BgdButtonProps {
  color?:
    | "gray"
    | "dark"
    | "green"
    | "red"
    | "orange"
    | "blue"
    | "white"
    | "purple"
    | "free";
  size?: "normal" | "medium" | "small" | "extra-small";
  rounded?: boolean;
  wide?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onFileUploaded?: (data: any) => void;
  type?: string;
  accept?: string;
  children: React.ReactNode;
}

const BgdButton: React.FC<BgdButtonProps> = ({
  color = "blue",
  size = "normal",
  rounded = false,
  wide = false,
  disabled = false,
  loading = false,
  onClick,
  onFileUploaded,
  type,
  accept,
  children,
}) => {
  const [loadingState, setLoadingState] = useState(loading);
  const [disabledState, setDisabledState] = useState(disabled);
  const uploadButtonRef = useRef<HTMLInputElement>(null);

  const isFileButton = type === "file";

  const colorClasses: Record<string, string> = {
    gray: "bg-gray-500 text-white border-gray-500 hover:bg-gray-600",
    dark: "bg-gray-600 text-white border-gray-600 hover:bg-gray-700",
    green: "bg-green-500 text-white border-green-500 hover:bg-green-600",
    red: "bg-red-700 text-white border-red-700 hover:bg-red-800",
    orange: "bg-orange-500 text-white border-orange-500 hover:bg-orange-600",
    blue: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    white: "bg-white text-gray-800 border-white hover:bg-gray-100",
    purple: "bg-purple-600 text-white border-purple-600 hover:bg-purple-700",
    free: "bg-transparent text-gray-800 border-transparent hover:bg-gray-100",
  };

  const sizeClasses: Record<string, string> = {
    normal: "text-base font-semibold py-2.5 px-4",
    medium: "text-sm font-semibold py-2 px-4",
    small: "text-sm font-medium py-1 px-3.5",
    "extra-small": "text-xs font-medium py-1 px-2.5",
  };

  const buttonClasses = [
    "inline-block",
    "relative",
    "text-center",
    "no-underline",
    "outline-none",
    "border-2",
    "rounded",
    rounded ? "rounded-full" : "rounded",
    wide ? "w-full block" : "w-auto inline-block",
    loadingState ? "opacity-75 cursor-not-allowed" : "",
    disabledState ? "opacity-50 cursor-not-allowed" : "",
    colorClasses[color],
    sizeClasses[size],
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e: React.MouseEvent) => {
    if (disabledState) return;
    onClick?.(e);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (onFileUploaded) {
      Array.from(files).forEach((file: any) => {
        onFileUploaded({
          file: {
            file_name: file.name,
            file_size: file.size,
            file_url: URL.createObjectURL(file),
          },
        });
      });
    }
  };

  return (
    <div className={wide ? "w-full" : "inline-block"}>
      <button
        type="button"
        disabled={disabledState}
        className={buttonClasses}
        onClick={handleClick}
      >
        {isFileButton && (
          <input
            ref={uploadButtonRef}
            type="file"
            accept={accept}
            onChange={handleFileSelected}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        )}

        <div className="relative z-20 flex items-center justify-center">
          {loadingState ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}

          {children && <span>{children}</span>}
        </div>
      </button>
    </div>
  );
};

export default BgdButton;
