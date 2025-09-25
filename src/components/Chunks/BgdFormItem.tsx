// components/ui/BgdFormItem.tsx
import React from "react";

interface BgdFormItemProps {
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  last?: boolean;
  children: React.ReactNode;
}

const BgdFormItem: React.FC<BgdFormItemProps> = ({
  label,
  hint,
  error,
  disabled = false,
  last = false,
  children,
}) => {
  const domClasses = [
    "mb-4",
    "relative",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    last ? "mb-0" : "",
    disabled ? "pointer-events-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={domClasses}>
      {label && (
        <label
          className="block text-gray-700 font-semibold text-sm mb-2"
          dangerouslySetInnerHTML={{ __html: label }}
        />
      )}

      {hint && (
        <div
          className="block text-gray-500 text-xs leading-4 mb-2"
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      )}

      {children}

      {error && (
        <div
          className="text-red-500 text-xs font-medium mt-2"
          dangerouslySetInnerHTML={{ __html: error }}
        />
      )}
    </div>
  );
};

export default BgdFormItem;
