"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";

// Компоненты и иконки
// import LanguageSwitcherComponent from "@/components/LanguageSwitcherComponent";
// import SchoolSelectModalComponent from "@/components/Oqylyq/School/SelectModalComponent";
// import ChatComponent from "@/components/Oqylyq/Chat/ChatComponent";
// import BasketModalComponent from "@/components/Oqylyq/Basket/BasketModalComponent";
// import TaskListComponent from "@/components/Oqylyq/Task/ListComponent";

// Actions
import {
  showBasket,
  hideBasket,
  showTaskList,
  hideTaskList,
} from "@/store/pageSlice";
import { fetchCurrentUser } from "@/store/authSlice";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();

  // Refs для модальных компонентов
  const schoolSelectComponentRef = useRef<any>(null);
  const chatComponentRef = useRef<any>(null);
  const basketComponentRef = useRef<any>(null);
  const taskListComponentRef = useRef<any>(null);

  // Состояния из Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const school = useSelector((state: RootState) => state.school.school);
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const taskListState = useSelector(
    (state: RootState) => state.page.taskListState
  );
  const basketShowedState = useSelector(
    (state: RootState) => state.page.basketShowedState
  );

  // Загружаем пользователя при монтировании
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Отслеживание изменений состояний модальных окон
  useEffect(() => {
    if (taskListState && taskListComponentRef.current) {
      taskListComponentRef.current.open();
    } else if (taskListComponentRef.current) {
      taskListComponentRef.current.close();
    }
  }, [taskListState]);

  useEffect(() => {
    if (basketShowedState && basketComponentRef.current) {
      basketComponentRef.current.open();
    } else if (basketComponentRef.current) {
      basketComponentRef.current.close();
    }
  }, [basketShowedState]);

  // Не показываем хедер если нет пользователя
  if (!user) {
    return null;
  }

  return (
    <header className="w-full p-5 relative">
      <div className="flex flex-row justify-start items-center">
        {/* LANGUAGES */}
        <div className="header-lang">
          {/* <LanguageSwitcherComponent /> */}
        </div>

        {/* TOOLBAR */}
        <div className="header-toolbar flex flex-nowrap flex-row justify-between items-center ml-auto">
          {/* SWITCH ORG */}
          <div className="toolbar-item ml-7.5 sm:ml-6">
            <a
              href="#"
              className="toolbar-chat-item block"
              onClick={(e) => {
                e.preventDefault();
                schoolSelectComponentRef.current?.open();
              }}
            >
              {/* <IconSwap className="text-[#7c8da7] text-lg sm:text-base" /> */}
              СВайп
            </a>
          </div>

          {/* CHAT */}
          <div className="toolbar-item ml-7.5 sm:ml-6">
            <a
              href="#"
              className="toolbar-chat-item block"
              onClick={(e) => {
                e.preventDefault();
                chatComponentRef.current?.open();
              }}
            >
              {/* <IconForum className="text-[#7c8da7] text-lg sm:text-base" /> */}
              Форум
            </a>
          </div>

          {/* BASKET */}
          <div className="toolbar-item ml-7.5 sm:ml-6">
            <a
              href="#"
              className="toolbar-basket-item block relative"
              onClick={(e) => {
                e.preventDefault();
                basketComponentRef.current?.open();
              }}
            >
              {/* <IconCart className="text-[#7c8da7] text-lg sm:text-base" /> */}
              Телега
            </a>
          </div>
        </div>
      </div>

      {/* Модальные компоненты */}
      {/* <SchoolSelectModalComponent ref={schoolSelectComponentRef} />
      <ChatComponent ref={chatComponentRef} />
      <BasketModalComponent
        ref={basketComponentRef}
        onOpened={() => dispatch(showBasket())}
        onClosed={() => dispatch(hideBasket())}
      />
      <TaskListComponent ref={taskListComponentRef} /> */}
    </header>
  );
}
