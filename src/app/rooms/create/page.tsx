"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SchedulesComponent from "@/components/Rooms/SchedulesComponent";
import { mockTimezones } from "@/mockData";

// Типы для компьютеров
interface Computer {
  id: string;
  name: string;
  description: string;
  hostname: string;
  isActive: boolean;
  imageUrl?: string;
}

export default function CreateRoomPage() {
  const [isEditing] = React.useState(true); // Всегда в режиме редактирования
  const [roomName, setRoomName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [timezone, setTimezone] = React.useState("");
  const [accessControl, setAccessControl] = React.useState(false);
  const [activeTab, setActiveTab] = useState<
    "computers" | "access" | "schedule"
  >("computers");
  const [computers, setComputers] = useState<Computer[]>([]);
  const [selectedComputers, setSelectedComputers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComputer, setNewComputer] = useState<Omit<Computer, "id">>({
    name: "",
    description: "",
    hostname: "",
    isActive: true,
    imageUrl: "",
  });

  const [schedules, setSchedules] = useState<any[]>([]);

  // Обработчик открытия модалки
  const handleOpenAddModal = () => {
    setNewComputer({
      name: "",
      description: "",
      hostname: "",
      isActive: true,
      imageUrl: "",
    });
    setShowAddModal(true);
  };

  // Обработчик закрытия модалки
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  // Обработчик сохранения нового компьютера
  const handleSaveComputer = () => {
    if (!newComputer.name.trim()) return;

    const computer: Computer = {
      ...newComputer,
      id: `comp-${Date.now()}`,
    };

    setComputers([...computers, computer]);
    setShowAddModal(false);
  };

  // Обработчик удаления компьютера
  const handleDeleteComputer = (id: string) => {
    setComputers(computers.filter((comp) => comp.id !== id));
    setSelectedComputers(selectedComputers.filter((compId) => compId !== id));
  };

  // Обработчик выбора/отмены выбора компьютера
  const handleToggleComputerSelection = (id: string) => {
    if (selectedComputers.includes(id)) {
      setSelectedComputers(selectedComputers.filter((compId) => compId !== id));
    } else {
      setSelectedComputers([...selectedComputers, id]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Новый кабинет</h1>
      </div>

      {/* Основная информация - Collapsible */}
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="basic-info">
          <AccordionTrigger className="bg-white rounded-lg shadow-sm border px-4 py-3 [&[data-state=open]]:rounded-b-none">
            Основная информация
          </AccordionTrigger>
          <AccordionContent className="bg-white rounded-b-lg shadow-sm border border-t-0 p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Наименование *
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Введите наименование"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Переключатель активности */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Активность
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    При неактивном состоянии кабинет не сможет принимать бронь
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                placeholder="Введите описание"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Осталось {200 - description.length} символа(-ов)
              </p>
            </div>

            {/* Дропдаун часового пояса */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Часовой пояс
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите часовой пояс</option>
                {mockTimezones.entities.map((tz) => (
                  <option key={tz.id} value={tz.region}>
                    {tz.region} ({tz.utc})
                  </option>
                ))}
              </select>
            </div>

            {/* Кнопка сохранения */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  // Здесь будет логика сохранения
                  console.log("Сохранить кабинет:", {
                    roomName,
                    description,
                    isActive,
                    timezone,
                    accessControl,
                    computers,
                    schedules,
                  });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Табы */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex space-x-4 mb-4 border-b pb-2">
          <button
            onClick={() => setActiveTab("computers")}
            className={`font-medium pb-1 ${
              activeTab === "computers"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Компьютеры
          </button>
          <button
            onClick={() => setActiveTab("access")}
            className={`font-medium pb-1 ${
              activeTab === "access"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            СКУД
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`font-medium pb-1 ${
              activeTab === "schedule"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            График работы
          </button>
        </div>

        {/* Содержимое табов */}
        <div className="mt-4">
          {/* Таб Компьютеры */}
          {activeTab === "computers" && (
            <div>
              {/* Контроллеры выбора */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Добавить
                  </button>
                  <button
                    onClick={() => {
                      if (selectedComputers.length > 0) {
                        if (
                          window.confirm(
                            `Вы уверены, что хотите удалить ${selectedComputers.length} выбранных компьютера(ов)?`
                          )
                        ) {
                          selectedComputers.forEach((id) =>
                            handleDeleteComputer(id)
                          );
                          setSelectedComputers([]);
                        }
                      }
                    }}
                    disabled={selectedComputers.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Удалить
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Выбрано {selectedComputers.length} PC
                </div>
              </div>

              {/* Список компьютеров */}
              <div className="space-y-2">
                {computers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Нет добавленных компьютеров
                  </div>
                ) : (
                  computers.map((computer) => (
                    <div
                      key={computer.id}
                      className={`flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white cursor-pointer transition-colors ${
                        selectedComputers.includes(computer.id)
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => handleToggleComputerSelection(computer.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          {computer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {computer.name}
                          </div>
                          {computer.hostname && (
                            <div className="text-xs text-gray-500">
                              {computer.hostname}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">
                          {computer.isActive ? "Активен" : "Неактивен"}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComputer(computer.id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Модальное окно добавления компьютера */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                  <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                          Новый компьютер
                        </h2>
                        <button
                          onClick={handleCloseAddModal}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <p className="text-gray-500 mb-6">Добавить компьютер</p>

                      {/* Изображение */}
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm text-gray-500 mt-2">
                          Выбрать изображение
                        </p>
                      </div>

                      {/* Активность */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Активность
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          При неактивном состоянии компьютер не сможет принимать
                          бронь
                        </p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={newComputer.isActive}
                            onChange={(e) =>
                              setNewComputer({
                                ...newComputer,
                                isActive: e.target.checked,
                              })
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* Название */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Название
                        </label>
                        <input
                          type="text"
                          value={newComputer.name}
                          onChange={(e) =>
                            setNewComputer({
                              ...newComputer,
                              name: e.target.value,
                            })
                          }
                          placeholder="Введите название"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Описание */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Описание
                        </label>
                        <textarea
                          value={newComputer.description}
                          onChange={(e) =>
                            setNewComputer({
                              ...newComputer,
                              description: e.target.value,
                            })
                          }
                          placeholder="Введите описание"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Осталось {191 - newComputer.description.length}{" "}
                          символа(-ов)
                        </p>
                      </div>

                      {/* Адрес (Hostname) */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Адрес (Hostname)
                        </label>
                        <input
                          type="text"
                          value={newComputer.hostname}
                          onChange={(e) =>
                            setNewComputer({
                              ...newComputer,
                              hostname: e.target.value,
                            })
                          }
                          placeholder="Введите адрес"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Кнопки */}
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={handleCloseAddModal}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={handleSaveComputer}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Сохранить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Таб СКУД */}
          {activeTab === "access" && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Контроль доступа
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Данная опция позволит контролировать доступ в кабинет
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={accessControl}
                    onChange={(e) => setAccessControl(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Таб График работы */}
          {activeTab === "schedule" && (
            <div>
              <SchedulesComponent
                schedules={schedules}
                onChange={setSchedules}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
