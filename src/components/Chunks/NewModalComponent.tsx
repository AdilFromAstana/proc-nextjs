import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import OverlayLoaderComponent from "./OverlayLoaderComponent";

// Props интерфейсы
interface NewModalProps {
  className?: string;
  fullsize?: boolean;
  icon?: string;
  title?: string;
  description?: string;
  closebtn?: boolean;
  portal?: string;
  position?: "bottom" | "top" | "left" | "right" | "center";
  isVisible?: boolean;
  children?: React.ReactNode;
  onOpened?: () => void;
  onClosed?: () => void;
}

const NewModalComponent: React.FC<NewModalProps> = ({
  className = null,
  fullsize = false,
  icon = null,
  title = null,
  description = null,
  closebtn = true,
  portal = "body",
  position = "bottom",
  isVisible = false,
  children,
  onOpened,
  onClosed,
}) => {
  // Refs
  const loaderComponentRef = useRef<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // State
  const [isVisibleState, setIsVisibleState] = useState<boolean>(isVisible);
  const [isVisibleWrapState, setIsVisibleWrapState] = useState<boolean>(false);

  // Computed values
  const domClasses = [
    className,
    `modal-position-${position}`,
    fullsize ? "modal-fullsize" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const transitionName = (() => {
    switch (position) {
      case "right":
        return "modal-right-side";
      case "left":
        return "modal-left-side";
      case "bottom":
        return "modal-bottom-side";
      case "top":
        return "modal-top-side";
      default:
        return "modal-fade";
    }
  })();

  // Methods
  const showLoader = () => {
    if (loaderComponentRef.current) {
      loaderComponentRef.current.show();
    }
  };

  const hideLoader = () => {
    if (loaderComponentRef.current) {
      loaderComponentRef.current.hide();
    }
  };

  const open = (): Promise<void> => {
    return new Promise((resolve) => {
      setIsVisibleState(true);

      setTimeout(() => {
        setIsVisibleWrapState(true);
      }, 100);

      // Блокируем прокрутку body
      const bodyElem = document.querySelector("body");
      if (bodyElem && !bodyElem.classList.contains("modal-active")) {
        bodyElem.classList.add("modal-active");
      }

      // Используем setTimeout вместо $nextTick
      setTimeout(() => {
        if (onOpened) {
          onOpened();
        }
        resolve();
      }, 0);
    });
  };

  const close = (force: boolean = false): Promise<void> => {
    return new Promise((resolve) => {
      // TODO: реализовать lock логику
      // if (this.lock && !force) {
      //   return;
      // }

      setIsVisibleWrapState(false);

      setTimeout(() => {
        setIsVisibleState(false);
        if (onClosed) {
          onClosed();
        }
        resolve();
      }, 300);

      // Разблокируем прокрутку body
      const bodyElem = document.querySelector("body");
      if (bodyElem && bodyElem.classList.contains("modal-active")) {
        bodyElem.classList.remove("modal-active");
      }
    });
  };

  const pause = () => {
    showLoader();
  };

  const resume = () => {
    hideLoader();
  };

  // Effects
  useEffect(() => {
    setIsVisibleState(isVisible);
    if (isVisible) {
      setTimeout(() => {
        setIsVisibleWrapState(true);
      }, 100);
    }
  }, [isVisible]);

  // Render
  const renderModalContent = () => (
    <div className={`new-modal-component ${domClasses}`} ref={modalRef}>
      {isVisibleWrapState && (
        <div className="modal-wrap">
          <OverlayLoaderComponent />

          {closebtn && (
            <div
              className="modal-close-btn"
              onClick={(e) => {
                e.preventDefault();
                close(false);
              }}
            />
          )}

          {(title ||
            description ||
            React.Children.toArray(children).some(
              (child) =>
                typeof child === "object" &&
                (child as any).props?.slot === "modal-header"
            )) && (
            <div
              className={`modal-header ${
                React.Children.count(children) > 0
                  ? "modal-header-margin-bottom"
                  : ""
              }`}
            >
              {icon && icon}
              {title && <div className="modal-title">{title}</div>}
              {description && (
                <div className="modal-description">{description}</div>
              )}
              {/* Slot для modal-header */}
              {React.Children.toArray(children).filter(
                (child) =>
                  typeof child === "object" &&
                  (child as any).props?.slot === "modal-header"
              )}
            </div>
          )}

          {React.Children.count(children) > 0 && (
            <div className="modal-content">{children}</div>
          )}

          {React.Children.toArray(children).some(
            (child) =>
              typeof child === "object" &&
              (child as any).props?.slot === "modal-footer"
          ) && (
            <div className="modal-footer">
              {/* Slot для modal-footer */}
              {React.Children.toArray(children).filter(
                (child) =>
                  typeof child === "object" &&
                  (child as any).props?.slot === "modal-footer"
              )}
            </div>
          )}
        </div>
      )}

      {/* Slot для outside-wrap */}
      {React.Children.toArray(children).filter(
        (child) =>
          typeof child === "object" &&
          (child as any).props?.slot === "outside-wrap"
      )}
    </div>
  );

  // Используем портал если указан
  if (portal && portal !== "body") {
    const portalElement = document.querySelector(portal);
    if (portalElement && isVisibleState) {
      return createPortal(renderModalContent(), portalElement);
    }
    return null;
  }

  // По умолчанию рендерим в body
  if (isVisibleState) {
    return createPortal(renderModalContent(), document.body);
  }

  return null;
};

// Экспортируем методы для внешнего использования
export interface NewModalRef {
  open: () => Promise<void>;
  close: (force?: boolean) => Promise<void>;
  showLoader: () => void;
  hideLoader: () => void;
  pause: () => void;
  resume: () => void;
}

export default NewModalComponent;
