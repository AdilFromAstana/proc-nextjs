"use client";

import { mockNews, NewsItem } from "@/mockData";
import React, { useState, useEffect } from "react";

type NewsComponentProps = {
  news?: NewsItem[];
};

export default function NewsComponent({ news }: NewsComponentProps) {
  const [hideNews, setHideNews] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Используем переданные новости или тестовые данные
  const actualNews = news || mockNews;

  // Если включена свитч-кнопка, используем пустой массив, иначе - актуальные новости
  const displayedNews = hideNews ? [] : actualNews;

  // Разбиваем новости на страницы (по 3 новости на страницу)
  const pageSize = 3;
  const totalPages = Math.ceil(displayedNews.length / pageSize);
  const currentPageNews = displayedNews.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Имитация загрузки
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString("ru-RU");

    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Навигация по страницам
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="mb-4 rounded-lg border bg-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl">Новости</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              Скрыть новости
            </span>
            <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
            <a className="text-blue-600 hover:text-blue-800 text-sm" href="#">
              Посмотреть все
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border bg-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">Новости</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">
            Скрыть новости
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={hideNews}
              onChange={(e) => setHideNews(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <a className="text-blue-600 hover:text-blue-800 text-sm" href="#">
            Посмотреть все
          </a>
        </div>
      </div>

      {displayedNews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Элементы отсутствуют
        </div>
      ) : (
        <div className="relative">
          {/* Карусель новостей */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {currentPageNews.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                  {item.description}
                </p>
                {item.createdAt && (
                  <div className="text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Стрелки навигации поверх контента */}
          <button
            onClick={goToPrevPage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all z-10"
            aria-label="Предыдущая страница"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNextPage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all z-10"
            aria-label="Следующая страница"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Точки навигации снизу */}
          <div className="flex justify-center space-x-2 mt-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentPage === index
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Страница ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
