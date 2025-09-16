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
  showChat,
  hideChat,
  showSwitchOrg,
  hideSwitchOrg,
} from "@/store/pageSlice";
import { fetchCurrentUser } from "@/store/authSlice";
import { IconForum } from "../../app/icons/IconForum";
import { IconSwap } from "../../app/icons/IconSwap";

import { IconCart } from "../../app/icons/IconCart";
import BasketModalComponent from "./BasketModalComponent";
import SwitchOrgComponent from "./SwitchOrgComponent";

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

  const switchOrgShowedState = useSelector(
    (state: RootState) => state.page.switchOrgShowedState
  );

  // Загружаем пользователя при монтировании
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Отслеживание изменений состояний модальных окон

  useEffect(() => {
    if (switchOrgShowedState && schoolSelectComponentRef.current) {
      schoolSelectComponentRef.current.open();
    } else if (schoolSelectComponentRef.current) {
      schoolSelectComponentRef.current.close();
    }
  }, [switchOrgShowedState]);

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
    <header className="w-full p-5 relative bg-gray-50">
      <div className="flex flex-row justify-start items-center">
        {/* LANGUAGES */}
        <div className="header-lang">{/* <LanguageSwitcherComponent /> */}</div>

        {/* TOOLBAR */}
        <div className="header-toolbar flex flex-nowrap flex-row justify-between items-center ml-auto">
          {/* SWITCH ORG */}
          <div className="toolbar-item ml-7.5 sm:ml-6">
            <a
              href="#"
              className="toolbar-chat-item block text-[#7c8da7] hover:text-blue-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                dispatch(showSwitchOrg()); // Открываем через Redux
              }}
            >
              <IconSwap className="text-lg sm:text-base w-6 h-6" />
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
              <IconForum className="text-[#7c8da7] text-lg sm:text-base w-6 h-6" />
            </a>
          </div>

          {/* BASKET */}
          <div className="toolbar-item ml-7.5 sm:ml-6">
            <a
              href="#"
              className="toolbar-basket-item block relative"
              onClick={(e) => {
                console.log("click basket");
                e.preventDefault();
                basketComponentRef.current?.open();
              }}
            >
              <IconCart className="text-[#7c8da7] text-lg sm:text-base w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Модальные компоненты */}
      {/* 
      
      <TaskListComponent ref={taskListComponentRef} /> */}

      <SwitchOrgComponent
        ref={schoolSelectComponentRef}
        onOpened={() => dispatch(showSwitchOrg())}
        onClosed={() => dispatch(hideSwitchOrg())}
      />
      <BasketModalComponent
        ref={basketComponentRef}
        onOpened={() => dispatch(showBasket())}
        onClosed={() => dispatch(hideBasket())}
      />
    </header>
  );
}
