import React, { forwardRef, useImperativeHandle, useState } from "react";

type Props = {
  onOpened?: () => void;
  onClosed?: () => void;
};

export type SwitchOrgRef = {
  open: () => void;
  close: () => void;
};

const SwitchOrgComponent = forwardRef<SwitchOrgRef, Props>(
  ({ onOpened, onClosed }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    // Управление модальными окнами через ref
    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        onOpened?.();
      },
      close: () => {
        setIsOpen(false);
        setShowJoinModal(false); // Закрываем вторую модалку при закрытии первой
        onClosed?.();
      },
    }));

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        {/* Первое модальное окно */}
        <div className="w-full h-full max-h-screen mx-auto overflow-hidden bg-white border rounded-lg shadow-lg relative">
          {/* Закрыть */}
          <button
            onClick={() => {
              setIsOpen(false);
              onClosed?.();
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Содержимое первого окна */}
          <div className="flex flex-col h-full p-8">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Выберите организацию
              </h2>
              <p className="text-gray-500 text-sm max-w-md">
                Ваш аккаунт пока не привязан ни к одной организации. Но вы
                можете присоединиться зная код приглашения.
              </p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors font-medium"
              >
                Присоединиться
              </button>
            </div>

            {/* Кнопки внизу */}
            <div className="flex justify-between px-8 pb-8">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onClosed?.();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Готово
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onClosed?.();
                }}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>

          {/* Второе модальное окно поверх первого */}
          {showJoinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Присоединиться
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Для того чтобы присоединиться к организации введите код
                  приглашения
                </p>

                <input
                  type="text"
                  placeholder="Введите код приглашения"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SwitchOrgComponent.displayName = "SwitchOrgComponent";

export default SwitchOrgComponent;
