// // components/LibraryOfQuestions.tsx
// import { fetchQuizComponents } from "@/api/quiz";
// import { OpenQuestionIcon } from "@/app/icons/Quiz";
// import { CheckCircle } from "@/app/icons/Quiz/CheckCircle";
// import { FreeQuestionIcon } from "@/app/icons/Quiz/FreeQuestionIcon";
// import { QuizQuestionComponent } from "@/types/quiz/quiz";
// import React, { useState, useEffect } from "react";

// interface LibraryOfQuestionsProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddQuestions: (questions: QuizQuestionComponent[]) => void;
// }

// const LibraryOfQuestions: React.FC<LibraryOfQuestionsProps> = ({
//   isOpen,
//   onClose,
//   onAddQuestions,
// }) => {
//   const [questions, setQuestions] = useState<QuizQuestionComponent[]>([]);
//   const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [componentType, setComponentType] = useState("");
//   const [loading, setLoading] = useState(false);

//   const componentTypes = [
//     { value: "", label: "Все типы" },
//     { value: "FreeQuestionComponent", label: "Тестовый вопрос" },
//     { value: "OpenQuestionComponent", label: "Открытый вопрос" },
//     { value: "FillBlanksComponent", label: "Заполните пробелы" },
//     { value: "DragDropComponent", label: "Drag & Drop" },
//   ];

//   const loadQuestions = async (page: number = 1) => {
//     setLoading(true);
//     try {
//       const response = await fetchQuizComponents({
//         page,
//         per_page: 10,
//         query: searchQuery || undefined,
//         type: componentType || undefined,
//       });

//       setQuestions(response.entities.data);
//       setTotalPages(response.entities.last_page);
//       setCurrentPage(response.entities.current_page);
//     } catch (error) {
//       console.error("Ошибка загрузки вопросов:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       loadQuestions(1);
//       setSelectedQuestions([]);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (isOpen) {
//       const debounceTimer = setTimeout(() => {
//         loadQuestions(1);
//       }, 300);
//       return () => clearTimeout(debounceTimer);
//     }
//   }, [searchQuery, componentType, isOpen]);

//   const handleQuestionSelect = (id: number) => {
//     setSelectedQuestions((prev) =>
//       prev.includes(id)
//         ? prev.filter((questionId) => questionId !== id)
//         : [...prev, id]
//     );
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       loadQuestions(page);
//     }
//   };

//   const handleAddQuestions = () => {
//     const selectedQuestionsData = questions.filter((q) =>
//       selectedQuestions.includes(q.id)
//     );
//     onAddQuestions(selectedQuestionsData);
//     onClose();
//   };

//   const getComponentTypeName = (type: string) => {
//     const typeMap: Record<string, string> = {
//       FreeQuestionComponent: "Тестовый вопрос",
//       OpenQuestionComponent: "Открытый вопрос",
//       FillBlanksComponent: "Заполните пробелы",
//       DragDropComponent: "Drag & Drop",
//     };
//     return typeMap[type] || type;
//   };

//   // Функция для рендеринга вариантов ответов
//   const renderOptions = (question: QuizQuestionComponent) => {
//     if (!question.options || question.options.length === 0) return null;

//     return (
//       <div className="space-y-2 mt-4">
//         {question.options.map((option: any, index: number) => (
//           <div key={index} className="flex items-center">
//             <div
//               className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${
//                 option.is_true
//                   ? "bg-blue-500 border-blue-500"
//                   : "border-gray-300"
//               }`}
//             >
//               {option.is_true ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   color="white"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"
//                   ></path>
//                 </svg>
//               ) : (
//                 <></>
//               )}
//             </div>
//             <span
//               className={`text-sm `}
//               dangerouslySetInnerHTML={{ __html: option.answer }}
//             />
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
//         {/* Заголовок модального окна */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Библиотека вопросов
//           </h2>
//         </div>

//         {/* Поиск и фильтры */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Поиск вопросов..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="w-full md:w-64">
//               <select
//                 value={componentType}
//                 onChange={(e) => setComponentType(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {componentTypes.map((type) => (
//                   <option key={type.value} value={type.value}>
//                     {type.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Список вопросов */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//             </div>
//           ) : questions.length === 0 ? (
//             <div className="flex items-center justify-center h-64 text-gray-500">
//               Вопросы не найдены
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {questions.map((question) => {
//                 const isSelected = selectedQuestions.includes(question.id);
//                 return (
//                   <div
//                     key={question.id}
//                     className={`relative border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
//                       isSelected
//                         ? "border-blue-500 bg-blue-50"
//                         : "hover:border-gray-300 hover:bg-gray-50"
//                     }`}
//                     onClick={() => handleQuestionSelect(question.id)}
//                   >
//                     {/* Индикатор выбора при наведении */}
//                     <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                       <div
//                         className={`flex items-center gap-2 px-4 py-2 rounded-full ${
//                           isSelected
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         <svg
//                           className={`w-5 h-5 ${
//                             isSelected ? "text-green-500" : "text-gray-400"
//                           }`}
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                         <span className="font-medium">
//                           {isSelected ? "Выбрано" : "Выбрать"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Тип вопроса */}
//                     <div
//                       className={`inline-flex items-center p-1.5 mb-1.5 rounded gap-1 text-xs font-medium bg-blue-100 text-blue-800 `}
//                     >
//                       {question.component_type === "OpenQuestionComponent" && (
//                         <OpenQuestionIcon height={18} />
//                       )}
//                       {question.component_type === "FreeQuestionComponent" && (
//                         <FreeQuestionIcon height={18} />
//                       )}
//                       {getComponentTypeName(question.component_type)}
//                     </div>

//                     {/* Вопрос */}
//                     <div className="mb-4">
//                       <div className="text-sm font-medium text-gray-700 mb-1">
//                         Вопрос
//                       </div>
//                       <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700">
//                         <div
//                           dangerouslySetInnerHTML={{
//                             __html: question.question,
//                           }}
//                         />
//                       </div>
//                     </div>

//                     {question.component_type === "OpenQuestionComponent" &&
//                       question.answer && (
//                         <div className="mb-4">
//                           <div className="text-sm font-medium text-gray-700 mb-1">
//                             Ответ
//                           </div>
//                           <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700">
//                             <div
//                               dangerouslySetInnerHTML={{
//                                 __html: question.answer,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       )}

//                     {question.component_type === "FreeQuestionComponent" &&
//                       renderOptions(question)}

//                     {isSelected && (
//                       <div className="absolute top-2 right-2">
//                         <CheckCircle color="blue" opacity={0.7} height={30} />
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Пагинация и кнопки */}
//         <div className="px-6 py-4 border-t border-gray-200">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             {/* Пагинация */}
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1 || loading}
//                 className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Назад
//               </button>

//               <span className="text-sm text-gray-600">
//                 Страница {currentPage} из {totalPages}
//               </span>

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages || loading}
//                 className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Вперед
//               </button>
//             </div>

//             {/* Кнопки действий */}
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Отмена
//               </button>

//               <button
//                 onClick={handleAddQuestions}
//                 disabled={selectedQuestions.length === 0 || loading}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Готово ({selectedQuestions.length})
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LibraryOfQuestions;

// components/LibraryOfQuestions.tsx
import { fetchQuizComponents } from "@/api/quiz";
import { OpenQuestionIcon } from "@/app/icons/Quiz";
import { FreeQuestionIcon } from "@/app/icons/Quiz/FreeQuestionIcon";
import { QuizQuestionComponent } from "@/types/quiz/quiz";
import React, { useState, useEffect } from "react";

interface LibraryOfQuestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestions: (questions: QuizQuestionComponent[]) => void;
}

// Компонент скелетона для строки таблицы
const QuestionSkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-4 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        <div className="ml-2 h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
  </tr>
);

const LibraryOfQuestions: React.FC<LibraryOfQuestionsProps> = ({
  isOpen,
  onClose,
  onAddQuestions,
}) => {
  const [questions, setQuestions] = useState<QuizQuestionComponent[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [componentType, setComponentType] = useState("");
  const [loading, setLoading] = useState(false);

  const componentTypes = [
    { value: "", label: "Все типы" },
    { value: "FreeQuestionComponent", label: "Тестовый вопрос" },
    { value: "OpenQuestionComponent", label: "Открытый вопрос" },
    { value: "FillBlanksComponent", label: "Заполните пробелы" },
    { value: "DragDropComponent", label: "Drag & Drop" },
  ];

  const loadQuestions = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetchQuizComponents({
        page,
        per_page: 15,
        query: searchQuery || undefined,
        type: componentType || undefined,
      });

      setQuestions(response.entities.data);
      setTotalPages(response.entities.last_page);
      setCurrentPage(response.entities.current_page);
    } catch (error) {
      console.error("Ошибка загрузки вопросов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadQuestions(1);
      setSelectedQuestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const debounceTimer = setTimeout(() => {
        loadQuestions(1);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, componentType, isOpen]);

  const handleQuestionSelect = (id: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(id)
        ? prev.filter((questionId) => questionId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map((q) => q.id));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadQuestions(page);
    }
  };

  const handleAddQuestions = () => {
    const selectedQuestionsData = questions.filter((q) =>
      selectedQuestions.includes(q.id)
    );
    onAddQuestions(selectedQuestionsData);
    onClose();
  };

  const getComponentTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      FreeQuestionComponent: "Тестовый",
      OpenQuestionComponent: "Открытый",
      FillBlanksComponent: "Пробелы",
      DragDropComponent: "Drag & Drop",
    };
    return typeMap[type] || type;
  };

  const getComponentTypeIcon = (type: string) => {
    switch (type) {
      case "OpenQuestionComponent":
        return <OpenQuestionIcon height={16} />;
      case "FreeQuestionComponent":
        return <FreeQuestionIcon height={16} />;
      default:
        return (
          <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs">
            ?
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Заголовок модального окна */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Библиотека вопросов
          </h2>
        </div>

        {/* Поиск и фильтры */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск вопросов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {componentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Счетчик выбранных вопросов */}
        <div className="px-6 py-2 bg-blue-50 border-b border-gray-200 text-sm">
          <span className="text-blue-700 font-medium">
            Выбрано: {selectedQuestions.length} из {questions.length} вопросов
          </span>
        </div>

        {/* Таблица вопросов */}
        <div className="flex-1 overflow-y-auto">
          {loading && questions.length === 0 ? (
            // Skeleton загрузка при первоначальной загрузке
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                    >
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                    >
                      Тип
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Вопрос
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <QuestionSkeletonRow key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Вопросы не найдены
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedQuestions.length === questions.length &&
                          questions.length > 0
                        }
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                    >
                      Тип
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Вопрос
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading
                    ? // Skeleton загрузка при фильтрации/поиске
                      Array.from({
                        length: Math.min(questions.length, 10),
                      }).map((_, index) => <QuestionSkeletonRow key={index} />)
                    : // Обычные строки с данными
                      questions.map((question) => {
                        const isSelected = selectedQuestions.includes(
                          question.id
                        );
                        return (
                          <tr
                            key={question.id}
                            className={`${
                              isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                            } cursor-pointer`}
                            onClick={() => handleQuestionSelect(question.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleQuestionSelect(question.id);
                                }}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                                  {getComponentTypeIcon(
                                    question.component_type
                                  )}
                                </div>
                                <div className="ml-2 text-sm font-medium text-gray-900">
                                  {getComponentTypeName(
                                    question.component_type
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className="text-sm text-gray-900 line-clamp-2"
                                dangerouslySetInnerHTML={{
                                  __html: question.question,
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Пагинация и кнопки */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Пагинация */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Назад
              </button>

              <span className="text-sm text-gray-600">
                Страница {currentPage} из {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Вперед
              </button>
            </div>

            {/* Кнопки действий */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отмена
              </button>

              <button
                onClick={handleAddQuestions}
                disabled={selectedQuestions.length === 0 || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Готово ({selectedQuestions.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryOfQuestions;
