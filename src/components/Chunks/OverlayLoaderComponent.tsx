import React, { useState, useEffect } from "react";
// Имитация MoonLoader - можно заменить на react-spinners
const MoonLoader = ({
  size,
  margin,
  color,
}: {
  size: string;
  margin: string;
  color: string;
}) => (
  <div
    style={{
      width: size,
      height: size,
      margin,
      border: `4px solid ${color}`,
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }}
  />
);

interface OverlayLoaderProps {
  theme?: "darken" | "lighten";
  label?: string;
  showed?: boolean;
  className?: string;
}

const OverlayLoaderComponent: React.FC<OverlayLoaderProps> = ({
  theme = "darken",
  label = null,
  showed = false,
  className = "",
}) => {
  const [visible, setVisible] = useState<boolean>(showed);

  // Watcher
  useEffect(() => {
    setVisible(showed);
  }, [showed]);

  // Methods
  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return (
    <div
      className={`overlay-loader-component ${
        visible ? "visible" : ""
      } theme-${theme} ${className}`}
    >
      <div className="overlay-loader-content">
        <MoonLoader size="90px" margin="10px" color="#FFF" />
        {label && <div className="overlay-loader-label">{label}</div>}
      </div>
    </div>
  );
};

// Экспортируем методы для внешнего использования
export interface OverlayLoaderRef {
  show: () => void;
  hide: () => void;
}

export default OverlayLoaderComponent;
