// components/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  progress?: number;
  animate?: boolean;
  gradient?: boolean;
  label?: string;
  showpercent?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  animate = true,
  gradient = false,
  label,
  showpercent = true,
  className = "",
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const isHalf = clampedProgress >= 50;
  const showText = isHalf || !gradient;

  // Точный градиент как в оригинале
  const gradientStyle = gradient
    ? {
        backgroundImage:
          "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,47,0,1) 15%, rgba(255,126,0,1) 31%, rgba(255,222,0,1) 49%, rgba(193,235,68,1) 66%, rgba(122,224,0,1) 83%, rgba(44,187,0,1) 100%)",
      }
    : {};

  return (
    <div
      className={`
        relative h-[30px] leading-[30px] mx-auto rounded-[30px] text-center overflow-hidden
        border-[5px] border-[#EEE] bg-[#EEE]
        ${className}
        ${gradient ? "gradient" : ""}
        ${animate ? "animated" : ""}
        ${isHalf ? "half" : ""}
      `}
      style={gradientStyle}
    >
      {/* Progress bar */}
      <div
        className={`
          h-full rounded-[20px] relative overflow-hidden transition-all duration-500
          ${gradient ? "bg-transparent" : "bg-[#1a73e8]"}
        `}
        style={{ width: `${clampedProgress}%` }}
      >
        {/* Animated stripes container */}
        {animate && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="uploading-bar-animated" />
          </div>
        )}
      </div>

      {/* Gradient mask */}
      {gradient && (
        <div
          className="absolute top-0 right-0 h-full bg-[#EEE]"
          style={{ width: `${100 - clampedProgress}%` }}
        />
      )}

      {/* Progress percentage */}
      {showpercent && showText && (
        <div
          className={`
            absolute top-1/2 left-0 w-full text-[0.7rem] font-bold text-center
            -translate-y-1/2 z-10
            ${
              isHalf && !gradient
                ? "text-white"
                : gradient
                ? "text-gray-700"
                : "text-[#1a73e8]"
            }
          `}
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          {clampedProgress}%
        </div>
      )}

      {/* Label */}
      {label && showText && (
        <div
          className={`
            absolute top-1/2 left-0 w-full text-[0.7rem] font-bold text-center
            -translate-y-1/2 z-10
            ${
              isHalf && !gradient
                ? "text-white"
                : gradient
                ? "text-gray-700"
                : "text-[#1a73e8]"
            }
          `}
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          {label}
        </div>
      )}

      <style jsx>{`
        @keyframes move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }

        .gradient {
          background-image: linear-gradient(
            90deg,
            rgba(255, 0, 0, 1) 0%,
            rgba(255, 47, 0, 1) 15%,
            rgba(255, 126, 0, 1) 31%,
            rgba(255, 222, 0, 1) 49%,
            rgba(193, 235, 68, 1) 66%,
            rgba(122, 224, 0, 1) 83%,
            rgba(44, 187, 0, 1) 100%
          );
        }

        .gradient .uploading-label,
        .gradient .uploading-progress {
          color: #333;
        }

        .gradient .uploading-bar {
          background-color: transparent;
        }

        .animated .uploading-bar-animated {
          animation: move 2s linear infinite;
          background-image: linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent
          );
          background-size: 50px 50px;
          width: 100%;
          height: 100%;
        }

        .half .uploading-label,
        .half .uploading-progress {
          color: #fff;
        }

        .uploading-bar {
          width: auto;
          height: 100%;
          border-radius: 20px;
          background-color: #1a73e8;
          transition: width 0.5s;
          position: relative;
          overflow: hidden;
        }

        .uploading-bar-animated {
          width: 100%;
          height: 100%;
        }

        .uploading-label,
        .uploading-progress {
          color: #1a73e8;
          width: 100%;
          font-family: Tahoma;
          font-size: 0.7rem;
          font-weight: 600;
          text-align: center;
          transform: translateY(-50%);
          position: absolute;
          top: 50%;
          left: 0;
          z-index: 9;
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
