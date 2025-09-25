// components/ui/PillComponent.tsx
import React from "react";

interface PillOption {
  [key: string]: any;
}

interface PillComponentProps {
  value?: string;
  options: PillOption[];
  size?: "default" | "small";
  given?: string;
  onChange?: (value: string) => void;
}

const PillComponent: React.FC<PillComponentProps> = ({
  value,
  options,
  size = "default",
  given = "raw",
  onChange,
}) => {
  const color = "blue";

  const activeColorClasses: Record<string, string> = {
    gray: "bg-gray-500",
    dark: "bg-gray-600",
    green: "bg-green-500",
    red: "bg-red-700",
    orange: "bg-orange-500",
    blue: "bg-blue-600",
    white: "bg-white text-gray-800",
    purple: "bg-purple-600",
  };

  const sizeClasses =
    size === "small"
      ? "text-sm py-3.5 px-4 flex-grow-0"
      : "text-base py-4 px-6";

  const containerClasses = [
    "inline-flex",
    "flex-row",
    "justify-center",
    "items-stretch",
    "overflow-auto",
    "rounded",
    "shadow-sm",
    "bg-gray-100",
  ].join(" ");

  const pillClasses = [
    "flex-grow",
    "font-semibold",
    "text-center",
    "truncate",
    "transition-colors",
    "duration-200",
    sizeClasses,
    "cursor-pointer",
  ].join(" ");

  const handleSelect = (pill: any) => {
    const pillValue = pill[given];
    onChange?.(pillValue);
  };

  const isSelected = (pill: any) => {
    return value === pill[given];
  };

  return (
    <div className={containerClasses}>
      {options.map((pill: any, index: number) => {
        const isActive = isSelected(pill);
        const pillSpecificClasses = [
          pillClasses,
          isActive
            ? `${activeColorClasses[color]} text-white`
            : "text-gray-500 hover:bg-gray-200",
        ].join(" ");

        return (
          <button
            key={index}
            className={pillSpecificClasses}
            onClick={() => handleSelect(pill)}
          >
            <span dangerouslySetInnerHTML={{ __html: pill.label }} />
          </button>
        );
      })}
    </div>
  );
};

export default PillComponent;
