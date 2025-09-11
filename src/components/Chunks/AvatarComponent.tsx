import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

// Props интерфейсы
interface AvatarProps {
  value?: string;
  upload?: boolean;
  action?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  letter?: string;
  image?: string;
  color?: string;
  selected?: boolean;
  loading?: boolean;
  border?: boolean;
  gradient?: boolean;
  rounded?: boolean;
  online?: boolean;
  className?: string;
  onChange?: (src: string) => void;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  value = null,
  upload = false,
  action = null,
  name = "file",
  size = "xs",
  letter = null,
  image = null,
  color = null,
  selected = false,
  loading = false,
  border = false,
  gradient = true,
  rounded = true,
  online = false,
  className = "",
  onChange,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(image || value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Размеры аватара
  const sizeClasses = {
    xs: "w-6 h-6 text-xs leading-6",
    sm: "w-8 h-8 text-sm leading-8",
    md: "w-9 h-9 text-base leading-9",
    lg: "w-16 h-16 text-2xl leading-16",
    xl: "w-24 h-24 text-3xl leading-24",
  };

  // Размеры индикатора онлайн
  const onlineSizeClasses = {
    xs: "w-2.5 h-2.5 border-2 right-0 bottom-0",
    sm: "w-2.5 h-2.5 border-2 right-0.5 bottom-0.5",
    md: "w-2.5 h-2.5 border-2 right-0.5 bottom-0.5",
    lg: "w-5 h-5 border-4 right-1 bottom-1",
    xl: "w-5 h-5 border-4 right-1.5 bottom-1.5",
  };

  // Размеры с border
  const borderSizeClasses = {
    xs: "border-2",
    sm: "border-2",
    md: "border-3",
    lg: "border-6",
    xl: "border-8",
  };

  const firstLetter = letter ? letter.charAt(0).toUpperCase() : "NN";

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !action) return;

    try {
      const formData = new FormData();
      formData.append(name, file);

      // TODO: реализовать API вызов
      // const response = await fetch(action, {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();
      // setImageSrc(data.src);
      // onChange?.(data.src);

      console.log("Uploading avatar:", file);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  // Классы для изображения
  const imageClasses = cn(
    "relative inline-block overflow-hidden",
    sizeClasses[size],
    rounded && "rounded-full",
    border && cn("outline outline-white shadow-sm", borderSizeClasses[size]),
    selected && "opacity-75",
    className
  );

  // Классы для буквы
  const letterClasses = cn(
    "relative flex items-center justify-center font-bold text-white uppercase",
    sizeClasses[size],
    rounded && "rounded-full",
    border && cn("outline outline-white shadow-sm", borderSizeClasses[size]),
    selected && "opacity-75",
    className
  );

  // Стили для фона буквы
  const letterStyles = color
    ? { backgroundColor: `#${color}` }
    : { backgroundColor: "#1a73e8" };

  // Классы для загрузки (скелетон)
  const loadingClasses = cn(
    "relative inline-block bg-gray-200 animate-pulse",
    sizeClasses[size],
    rounded && "rounded-full"
  );

  if (loading) {
    return <div className={loadingClasses} />;
  }

  return (
    <div className="inline-block relative">
      {imageSrc ? (
        // Изображение
        <div className={imageClasses}>
          {selected && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <svg
                className="text-white w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {upload && (
            <input
              ref={fileInputRef}
              type="file"
              onChange={uploadAvatar}
              className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
            />
          )}
          <img
            src={imageSrc}
            alt="Avatar"
            className={rounded ? "w-full h-full object-cover" : "w-full"}
          />
        </div>
      ) : letter ? (
        // Буква
        <div className={letterClasses} style={letterStyles}>
          {selected && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <svg
                className="text-white w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {upload && (
            <input
              ref={fileInputRef}
              type="file"
              onChange={uploadAvatar}
              className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
            />
          )}
          <span>{firstLetter}</span>
        </div>
      ) : (
        // Плейсхолдер
        <div className={loadingClasses} />
      )}

      {online && (
        <div
          className={cn(
            "absolute bg-green-500 border-white rounded-full",
            onlineSizeClasses[size],
            border && "border-2"
          )}
        />
      )}
    </div>
  );
};

export default AvatarComponent;
