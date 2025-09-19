// components/LessonChaptersComponent.tsx
import {
  BaseComponent,
  Chapter,
  ChapterComponent,
  ComponentType,
  LessonDetailResponse,
} from "@/types/lessons/lessonQuestions";
import React, { useState } from "react";

interface Props {
  lesson: LessonDetailResponse | null;
}

export default function LessonChaptersComponent({ lesson }: Props) {
  const [activeChapterId, setActiveChapterId] = useState<number>(
    lesson?.entity?.chapters[0]?.id || 0
  );
  const [chapters, setChapters] = useState<Chapter[]>(
    lesson?.entity?.chapters || []
  );

  if (!lesson?.entity) {
    return <div>Нет данных об уроке</div>;
  }

  // Обновление названия раздела
  const handleChapterNameChange = (chapterId: number, newName: string) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, name: newName } : chapter
      )
    );
  };

  // Удаление раздела
  const handleRemoveChapter = (chapterId: number) => {
    if (window.confirm("Удалить раздел?")) {
      setChapters((prev) => prev.filter((chapter) => chapter.id !== chapterId));
      if (activeChapterId === chapterId) {
        setActiveChapterId(chapters.length > 1 ? chapters[0]?.id || 0 : 0);
      }
    }
  };

  // Добавление нового раздела
  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now(), // временный ID
      name: "Новый раздел",
      description: null,
      position: chapters.length,
      components: [],
    };
    setChapters((prev) => [...prev, newChapter]);
    setActiveChapterId(newChapter.id);
  };

  // Получение иконки для типа компонента
  const getComponentIcon = (componentType: ComponentType) => {
    const icons: Record<ComponentType, string> = {
      TextComponent: "📝",
      MediaComponent: "🖼️",
      IFrameComponent: "🌐",
      YoutubeComponent: "▶️",
      PollComponent: "📊",
      FreeQuestionComponent: "❓",
      OpenQuestionComponent: "📝",
      DragAndDropQuestionComponent: "🧩",
    };
    return icons[componentType] || "📄";
  };

  // Получение названия для типа компонента
  const getComponentName = (componentType: ComponentType) => {
    const names: Record<ComponentType, string> = {
      TextComponent: "Текст",
      MediaComponent: "Медиа",
      IFrameComponent: "Источник",
      YoutubeComponent: "YouTube",
      PollComponent: "Опрос",
      FreeQuestionComponent: "Тестовый вопрос",
      OpenQuestionComponent: "Открытый вопрос",
      DragAndDropQuestionComponent: "Drag&Drop",
    };
    return names[componentType] || componentType;
  };

  // Рендеринг компонентов в разделе
  const renderComponent = (component: ChapterComponent) => {
    const renderComponentHeader = () => (
      <div className="flex items-center gap-2 text-sm mb-2">
        <span className="w-8 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded text-xs font-medium">
          {component.position + 1}
        </span>
        <span className="text-blue-600 font-medium">
          {getComponentIcon(component.component_type)}{" "}
          {getComponentName(component.component_type)}
        </span>
      </div>
    );

    switch (component.component_type) {
      case "TextComponent":
        return (
          <div
            key={component.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            {renderComponentHeader()}
            <div
              className="text-gray-800 prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: component.data.content || "",
              }}
            />
          </div>
        );

      case "MediaComponent":
        return (
          <div
            key={component.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            {renderComponentHeader()}
            {component.component?.type === "image" && (
              <img
                src={component.component.path}
                alt={component.component.name}
                className="max-w-full h-auto rounded-md"
              />
            )}
          </div>
        );

      case "IFrameComponent":
        return (
          <div
            key={component.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            {renderComponentHeader()}
            <iframe
              src={component.data.url}
              width="100%"
              height={component.data.settings?.height || "200"}
              className="rounded-md"
              title="Встроенный контент"
            ></iframe>
          </div>
        );

      case "YoutubeComponent":
        const youtubeId =
          component.data.url?.split("v=")[1]?.split("&")[0] ||
          component.data.url?.split("youtu.be/")[1]?.split("?")[0];
        return (
          <div
            key={component.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            {renderComponentHeader()}
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                width="100%"
                height="315"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
                title="YouTube видео"
              ></iframe>
            ) : (
              <div className="text-red-500">Неверная ссылка на YouTube</div>
            )}
          </div>
        );

      case "PollComponent":
        return (
          <div
            key={component.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            {renderComponentHeader()}
            <div
              className="font-medium mb-2"
              dangerouslySetInnerHTML={{
                __html: component.component?.question || "",
              }}
            />
            <div className="space-y-2">
              {component.component?.options?.map((option: any) => (
                <div
                  key={option.id}
                  className="flex items-center p-2 bg-gray-50 rounded"
                >
                  <input type="radio" className="mr-2" disabled />
                  <div dangerouslySetInnerHTML={{ __html: option.answer }} />
                </div>
              ))}
            </div>
          </div>
        );

      case "FreeQuestionComponent":
        return (
          <div
            key={component.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            {renderComponentHeader()}
            <div
              className="font-medium mb-2"
              dangerouslySetInnerHTML={{
                __html: component.component?.question || "",
              }}
            />
            <div className="space-y-2">
              {component.component?.options?.map((option: any) => (
                <div
                  key={option.id}
                  className="flex items-center p-2 bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    className="mr-2 cursor-default pointer-events-none"
                    readOnly
                    checked={option.is_true === 1}
                  />
                  <div dangerouslySetInnerHTML={{ __html: option.answer }} />
                </div>
              ))}
            </div>
          </div>
        );

      case "OpenQuestionComponent":
        return (
          <div
            key={component.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            {renderComponentHeader()}

            {/* Вопрос */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Вопрос
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <div
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: component.component?.question || "",
                  }}
                />
              </div>
            </div>

            {/* Ответ */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Ответ
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <div
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: component.component?.answer || "",
                  }}
                />
              </div>
            </div>
          </div>
        );

      case "DragAndDropQuestionComponent":
        return (
          <div
            key={component.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            {renderComponentHeader()}
            {component.component?.image && (
              <div className="relative">
                <img
                  src={component.component.image}
                  alt="Drag and Drop"
                  className="max-w-full h-auto rounded-md"
                />
                <div className="text-sm text-gray-600 mt-2">
                  Перетащите элементы на изображение
                </div>
              </div>
            )}
            <div className="mt-3">
              <div className="font-medium mb-2">
                Элементы для перетаскивания:
              </div>
              <div className="flex flex-wrap gap-2">
                {component.component?.options?.map((option: any) => (
                  <div
                    key={option.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded cursor-move"
                  >
                    {option.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        // Для неизвестных типов компонентов
        const unknownComponent = component as BaseComponent;
        return (
          <div
            key={unknownComponent.id}
            className="mt-2 p-3 bg-white rounded-lg border shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="w-8 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {unknownComponent.position + 1}
              </span>
              <span className="text-blue-600 font-medium">
                📄 Неизвестный компонент
              </span>
            </div>
            <div className="text-gray-500">
              Компонент типа "{unknownComponent.component_type}" не
              поддерживается
            </div>
          </div>
        );
    }
  };

  // Список разделов слева
  const renderChaptersList = () => {
    return (
      <div className="w-64 bg-white border-gray-200">
        <ul>
          {chapters.map((chapter) => (
            <li key={chapter.id} className=" border">
              <button
                onClick={() => setActiveChapterId(chapter.id)}
                className={`w-full text-left px-3 py-2 transition-colors text-sm flex items-center ${
                  activeChapterId === chapter.id
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold bg-gray-200 mr-2 flex-shrink-0">
                  {chapter.position + 1}
                </span>
                <span className="truncate flex-grow">{chapter.name}</span>
                <span
                  className="ml-2 text-red-500 cursor-pointer hover:text-red-700 text-lg flex-shrink-0 "
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChapter(chapter.id);
                  }}
                >
                  –
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={handleAddChapter}
          className="mt-4 w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
        >
          <span>Добавить раздел</span>
        </button>
      </div>
    );
  };

  // Основной контент справа
  const renderContent = () => {
    const activeChapter = chapters.find((c) => c.id === activeChapterId);
    if (!activeChapter) return null;

    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Поле для редактирования названия раздела */}
        <input
          type="text"
          value={activeChapter.name}
          onChange={(e) =>
            handleChapterNameChange(activeChapter.id, e.target.value)
          }
          placeholder="Введите название раздела"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm mb-4"
        />

        {/* Компоненты внутри раздела */}
        <div className="space-y-4">
          {activeChapter.components.length > 0 ? (
            activeChapter.components.map((component) =>
              renderComponent(component)
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              В этом разделе пока нет компонентов
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Список разделов */}
      {renderChaptersList()}

      {/* Контент */}
      {renderContent()}
    </div>
  );
}
