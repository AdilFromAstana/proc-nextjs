import React, { useState, useRef } from "react";
import { ChevronDown } from "@/app/icons/Courses/ChevronDown";
import { ChevronUp } from "@/app/icons/Courses/ChevronUp";
import { NewsIcon } from "@/app/icons/Courses/NewsIcon";
import { CourseNewsItem } from "@/types/courses/courses";

type NewsBlockProps = {
  records: CourseNewsItem[];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `сегодня, в ${date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (diffDays === 1) {
    return `вчера, в ${date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (diffDays < 7) {
    return `${diffDays} дней назад`;
  } else {
    return date.toLocaleDateString("ru-RU");
  }
};

export function NewsBlock({ records }: NewsBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // Показывать стрелки только если есть новости
  const hasNews = records && records.length > 0;

  return (
    <div className="mb-6">
      {/* Заголовок + карусель */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        {/* Кнопка раскрытия */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-4 text-left"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <NewsIcon height={26} color="gray" />
              <span className="sr-only">Новости</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Новости</h3>
              <p className="text-sm text-gray-500">Последние объявления</p>
            </div>
          </div>
          <div>
            {isOpen ? <ChevronUp height={24} /> : <ChevronDown height={24} />}
          </div>
        </button>

        {/* Карусель новостей */}
        {isOpen && (
          <div className="relative">
            {/* Стрелки для прокрутки */}
            {hasNews && (
              <>
                <button
                  onClick={scrollLeft}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  aria-label="Прокрутить влево"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                  onClick={scrollRight}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  aria-label="Прокрутить вправо"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Список новостей */}
            <div
              ref={carouselRef}
              className="flex space-x-4 p-4 overflow-x-auto scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex-shrink-0 w-64 max-w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {record.image && (
                    <div className="relative h-32">
                      <img
                        src={record.image}
                        alt={record.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {record.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {record.announce}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(record.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {!hasNews && (
              <div className="p-8 text-center text-gray-500">
                <p>Элементы отсутствуют</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
