import { QuestionType } from "@/types/quiz/quiz";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

// Типы для пропсов
interface ButtonsPanelProps {
  onCreateTestQuestion: () => void;
  onCreateOpenQuestion: () => void;
  onCreateFillBlanksQuestion: () => void;
  onCreateDragDropQuestion: () => void;
  onOpenLibrary: () => void;
  onImportFromFile: () => void;
}

// Интерфейс для кнопок панели
interface PanelButton {
  id: QuestionType;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

// Кастомные иконки (вы можете заменить на свои)
const TestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    height={24}
    color="blue"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M256 42.667c117.82 0 213.334 95.512 213.334 213.333c0 117.82-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334S138.18 42.667 256 42.667m0 282.667c-14.729 0-26.668 11.938-26.668 26.666s11.94 26.667 26.667 26.667s26.667-11.939 26.667-26.667s-11.94-26.666-26.667-26.666m-3.56-189.332c-20.765 0-38.218 5.657-52.338 16.94c-16.732 13.516-25.091 33.476-25.091 59.898h45.362v-.304c0-10.081 2.123-18.35 6.36-24.8c5.845-8.67 15.327-13.01 28.435-13.01c8.067 0 14.933 2.118 20.57 6.346c7.054 5.858 10.593 14.725 10.593 26.624c0 7.463-1.824 14.114-5.45 19.966c-3.025 5.242-7.864 10.38-14.528 15.425c-14.114 9.679-23.292 19.26-27.52 28.743c-3.631 7.864-5.455 20.367-5.455 37.504h42.665c0-11.296 1.501-19.76 4.54-25.41c2.416-4.638 7.463-9.575 15.127-14.822c13.315-9.885 22.785-19.064 28.436-27.534c6.853-10.08 10.288-21.881 10.288-35.397c0-28.01-11.392-47.878-34.195-59.58C286.533 139.534 270.6 136 252.44 136"
    ></path>
  </svg>
);

const OpenTestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={24}
    color="blue"
    {...props}
  >
    <path
      fill="currentColor"
      d="M17 11h-2V9h2m-4 2h-2V9h2m-4 2H7V9h2m11-7H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2"
    ></path>
  </svg>
);

const FillBlanksIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={24}
    color="blue"
    {...props}
  >
    <path
      fill="currentColor"
      d="M3 15h2v4h14v-4h2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2z"
    ></path>
  </svg>
);

const DragDropIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={24}
    color="blue"
    {...props}
  >
    <path
      fill="currentColor"
      d="m22.67 12l-4.49 4.5l-2.51-2.5l1.98-2l-1.98-1.96l2.51-2.51zM12 1.33l4.47 4.49l-2.51 2.51L12 6.35l-2 1.98l-2.5-2.51zm0 21.34l-4.47-4.49l2.51-2.51L12 17.65l2-1.98l2.5 2.51zM1.33 12l4.49-4.5L8.33 10l-1.98 2l1.98 1.96l-2.51 2.51zM12 10a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2"
    ></path>
  </svg>
);

const LibraryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={24}
    color="blue"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12 14.27L10.64 13A11.24 11.24 0 0 0 5 10.18v6.95c2.61.34 5 1.34 7 2.82c2-1.48 4.39-2.48 7-2.82v-6.95c-2.16.39-4.09 1.39-5.64 2.82M19 8.15c.65-.1 1.32-.15 2-.15v11c-3.5 0-6.64 1.35-9 3.54C9.64 20.35 6.5 19 3 19V8c.68 0 1.35.05 2 .15c2.69.41 5.1 1.63 7 3.39c1.9-1.76 4.31-2.98 7-3.39M12 6c.27 0 .5-.1.71-.29c.19-.21.29-.44.29-.71s-.1-.5-.29-.71C12.5 4.11 12.27 4 12 4s-.5.11-.71.29c-.18.21-.29.45-.29.71s.11.5.29.71c.21.19.45.29.71.29m2.12 1.12a2.997 2.997 0 1 1-4.24-4.24a2.997 2.997 0 1 1 4.24 4.24"
    ></path>
  </svg>
);

const ImportIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={24}
    color="blue"
    {...props}
  >
    <path
      fill="currentColor"
      d="m8.84 12l-4.92 4.92L2.5 15.5L5 13H0v-2h5L2.5 8.5l1.42-1.42zM12 3C8.59 3 5.68 4.07 4.53 5.57L5 6l1.03 1.07C6 7.05 6 7 6 7c0-.5 2.13-2 6-2s6 1.5 6 2s-2.13 2-6 2c-2.62 0-4.42-.69-5.32-1.28l3.12 3.12c.7.1 1.44.16 2.2.16c2.39 0 4.53-.53 6-1.36v2.81c-1.3.95-3.58 1.55-6 1.55c-.96 0-1.9-.1-2.76-.27l-1.65 1.64c1.32.4 2.82.63 4.41.63c2.28 0 4.39-.45 6-1.23V17c0 .5-2.13 2-6 2s-6-1.5-6-2v-.04L5 18l-.46.43C5.69 19.93 8.6 21 12 21c4.41 0 8-1.79 8-4V7c0-2.21-3.58-4-8-4"
    ></path>
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
    ></path>
  </svg>
);

const OpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
  </svg>
);

// Компонент панели
const ButtonsPanel = ({
  onCreateTestQuestion,
  onCreateOpenQuestion,
  onCreateFillBlanksQuestion,
  onCreateDragDropQuestion,
  onOpenLibrary,
  onImportFromFile,
}: ButtonsPanelProps) => {
  const t = useTranslations();
  const [isHidden, setIsHidden] = useState(false);

  // Массив кнопок панели с переданными функциями
  const panelButtons: PanelButton[] = [
    {
      id: "test",
      label: t("label-quiz-question"),
      icon: <TestIcon />,
      action: onCreateTestQuestion,
    },
    {
      id: "free",
      label: t("label-free-question"),
      icon: <OpenTestIcon />,
      action: onCreateOpenQuestion,
    },
    {
      id: "fill-blanks",
      label: t("label-fill-spaces"),
      icon: <FillBlanksIcon />,
      action: onCreateFillBlanksQuestion,
    },
    {
      id: "drag-drop",
      label: "Drag & Drop",
      icon: <DragDropIcon />,
      action: onCreateDragDropQuestion,
    },
    {
      id: "library",
      label: t("btn-import-from-library"),
      icon: <LibraryIcon />,
      action: onOpenLibrary,
    },
    {
      id: "import",
      label: t("btn-import-from-file"),
      icon: <ImportIcon />,
      action: onImportFromFile,
    },
  ];

  // Функция для открытия/закрытия панели
  const togglePanel = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <div
        className="flex justify-center items-center rounded-full m-2 bg-gray-200 border border-gray-300 shadow-sm hover:bg-gray-300 transition-colors cursor-pointer w-10 h-10 mx-auto"
        onClick={togglePanel}
      >
        {!isHidden ? (
          <CloseIcon height={24} color="blue" />
        ) : (
          <OpenIcon height={24} color="blue" />
        )}
      </div>

      {/* Панель кнопок */}
      {!isHidden && (
        <div className="max-w-7xl mx-auto pb-4">
          <div className="flex justify-center bg-gray-50 rounded-lg p-2">
            {panelButtons.map((button) => (
              <button
                key={button.id}
                onClick={button.action}
                className={`flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-200`}
              >
                <div className="mb-1">{button.icon}</div>
                <span className="text-xs">{button.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonsPanel;
