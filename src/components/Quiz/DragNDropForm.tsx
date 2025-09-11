import React, { useState, useRef } from "react";
import { Question } from "@/types/quizQuestion";

type ElementType = "text" | "image";

interface FormElement {
  id: string;
  type: ElementType;
  content: string;
  x: number;
  y: number;
}

type Props = {
  onAdd: (question: Omit<Question, "id">) => void;
  onCancel: () => void;
};

export default function DragNDropForm({ onAdd, onCancel }: Props) {
  const [questionText, setQuestionText] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [elements, setElements] = useState<FormElement[]>([]);
  const [showElementTypeSelector, setShowElementTypeSelector] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addElement = (elementType: ElementType) => {
    if (!backgroundImage) return;

    const newElement: FormElement = {
      id: Date.now().toString(),
      type: elementType,
      content: elementType === "text" ? "Текстовый элемент" : "",
      x: 50,
      y: 50,
    };

    setElements([...elements, newElement]);
    setShowElementTypeSelector(false);
  };

  const updateElementContent = (id: string, content: string) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, content } : el)));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedElement(id);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement || !imageContainerRef.current) return;

    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    setElements(
      elements.map((el) =>
        el.id === draggedElement
          ? {
              ...el,
              x: Math.max(0, Math.min(x - 25, containerRect.width - 50)),
              y: Math.max(0, Math.min(y - 25, containerRect.height - 50)),
            }
          : el
      )
    );

    setDraggedElement(null);
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
  };

  const handleAdd = () => {
    if (!questionText.trim() || !backgroundImage) return;

    onAdd({
      type: "drag-drop",
      content: {
        text: questionText,
        backgroundImage,
        elements,
      },
    });

    // Сброс формы
    setQuestionText("");
    setBackgroundImage(null);
    setElements([]);
    setShowElementTypeSelector(false);
    setDraggedElement(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Вопрос
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Введите текст вопроса"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {!backgroundImage ? (
          <div className="text-center">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Выберите изображение
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              Загрузите изображение для начала работы
            </p>
          </div>
        ) : (
          <div>
            <div className="relative inline-block">
              <img
                src={backgroundImage}
                alt="Background"
                className="max-w-full max-h-96 mx-auto"
              />

              <div
                ref={imageContainerRef}
                className="absolute inset-0"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {elements.map((element) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.id)}
                    onDragEnd={handleDragEnd}
                    className="absolute cursor-move"
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                    }}
                  >
                    <div className="flex items-center gap-2 bg-white bg-opacity-90 p-2 rounded shadow-lg">
                      {element.type === "text" ? (
                        <span className="px-2 py-1">
                          {element.content || "Текст"}
                        </span>
                      ) : element.content ? (
                        <img
                          src={element.content}
                          alt="Element"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            Изображение
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => removeElement(element.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() =>
                  setShowElementTypeSelector(!showElementTypeSelector)
                }
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Добавить элемент
              </button>

              {showElementTypeSelector && (
                <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addElement("text")}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                      Текст
                    </button>
                    <button
                      onClick={() => addElement("image")}
                      className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
                    >
                      Изображение
                    </button>
                  </div>
                </div>
              )}
            </div>

            {elements.map((element) => (
              <div
                key={`input-${element.id}`}
                className="mt-3 p-3 border border-gray-200 rounded-md"
              >
                {element.type === "text" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Текст элемента
                    </label>
                    <input
                      type="text"
                      value={element.content}
                      onChange={(e) =>
                        updateElementContent(element.id, e.target.value)
                      }
                      placeholder="Введите текст"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Изображение элемента
                    </label>
                    {element.content ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={element.content}
                          alt="Element preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <label className="cursor-pointer text-blue-500 hover:text-blue-700 text-sm">
                          Заменить
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    updateElementContent(
                                      element.id,
                                      event.target.result as string
                                    );
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer text-blue-500 hover:text-blue-700">
                        Загрузить изображение
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  updateElementContent(
                                    element.id,
                                    event.target.result as string
                                  );
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
        >
          Отмена
        </button>
        <button
          onClick={handleAdd}
          disabled={!questionText.trim() || !backgroundImage}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Готово
        </button>
      </div>
    </div>
  );
}
