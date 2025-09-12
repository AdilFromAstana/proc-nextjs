import React, { forwardRef, useImperativeHandle, useState } from "react";

type Props = {
  onOpened?: () => void;
  onClosed?: () => void;
};

export type BasketModalRef = {
  open: () => void;
  close: () => void;
};

const BasketModalComponent = forwardRef<BasketModalRef, Props>(
  ({ onOpened, onClosed }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        onOpened?.();
      },
      close: () => {
        setIsOpen(false);
        onClosed?.();
      },
    }));

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border relative">
          {/* Заголовок с шагами */}
          <div className="flex justify-center items-center p-4 border-b">
            <div className="flex justify-between items-center w-full max-w-md">
              {/* Шаг 1: Корзина */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <span className="mt-1 text-green-600">Корзина</span>
              </div>

              {/* Шаг 2: Доставка */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="mt-1 text-gray-400">Доставка</span>
              </div>

              {/* Шаг 3: Оплата */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="mt-1 text-gray-400">Оплата</span>
              </div>
            </div>

            {/* Кнопка закрытия в правом углу */}
            <button
              onClick={() => {
                setIsOpen(false);
                onClosed?.();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
          </div>

          {/* Содержимое корзины */}
          <div className="p-6">
            {/* Список товаров */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center text-gray-500">
              Элементы отсутствуют
            </div>

            {/* Итого и промокод в одном ряду */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              {/* Левая часть: Итого */}
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">ИТОГО</p>
                <p className="text-2xl font-bold text-gray-900">0 ₸</p>
              </div>

              {/* Правая часть: Промокод */}
              <div className="flex flex-col items-end">
                <p className="text-xxs text-gray-500 mb-1 text-right">
                  Активируйте имеющийся промокод
                </p>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Промокод"
                    className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400 transition-colors">
                    Применить
                  </button>
                </div>
              </div>
            </div>

            {/* Кнопка продолжить */}
            <div className="mt-6">
              <button
                className="px-6 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
                disabled
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BasketModalComponent.displayName = "BasketModalComponent";

export default BasketModalComponent;
