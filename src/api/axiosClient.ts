// src/api/axiosClient.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Базовый URL API
const API_BASE_URL = "https://api.oqylyq.kz/api";

// Создаем экземпляр axios с общей конфигурацией
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 секунд таймаут
  headers: {
    "Content-Type": "application/json",
    // Можно добавить Accept, User-Agent и т.д.
  },
});

// 👇 Опционально: добавляем интерцептор для запросов (например, подставить токен)
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем токен из localStorage, cookies или контекста
    const token =
      //   typeof window !== "undefined" ? localStorage.getItem("token") : null;
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiZWVlMWRkNjg5OWMxZjUwMDlhYzExNWU1NDA1NjA3M2UyOWVkYjlkZTJkNTA3ZTczNjRiNThkMDU5NTU3NDJlMTAzOGJiYTBkOTU5N2VmNmMiLCJpYXQiOjE3NTc0OTg2OTguMjczMjg3MSwibmJmIjoxNzU3NDk4Njk4LjI3MzI4OSwiZXhwIjoxNzg5MDM0Njk4LjI0NzM1MTksInN1YiI6IjI3NDc0MzYiLCJzY29wZXMiOlsiKiJdfQ.DInEnjinJ4WMJIAAsW0MInILCmmgjRXVFBbMC7tpA67PpQX79YWmM3Lz1HlRYP3KAfNHIC8hBW6l40KjCkCsDsxmCWrBlbW8hmhnDhVQv_q_tLu2O6FV-fTq2KnFdoPsxnbnYSkQ4jS3KpOV1VOgdjUzJEbt0F-acpCn6AynbEyX35toatApkNopEXHpJxu770c_AH6Sy2MT3YYrFcxHpjbNx3UQknvd2Y676xH5J_NxSB8tQYBzjHTW_0mict7ti-iwOUBPIkTu_oib595-2HCsceBqFmS4bJqTbJJ6HSPy1HMZkBZhD1_lgMsoOiDvLrLhM6RVridOL_ZINXIi-NqjUprHTuyVmBoOHi4PdGM03PgFf6akUB6SPEbyW30y_yluljD__1aoClK0sRBczya_J0swLU-WcFLmZYPqoC3GBqWOqvLZAacZ6ydBESu7ttBvaci35FADwAzdq4u09zW98eSy6zEe5vsCU56k-esjWYEjT17V2EUEOq0HxEtHsBXdf9H7fD-BHoZUxADi9CNr7IWYceSKEW1kjtp-5nToV_Zo3m6w0e1XwUMN13Y9ZP0k5RF0EPK65J-KT84KK-42whGoR7Nxp61Cgnxdg91Pns7LADTpD_m2w8l2CgT54hUqQZJh9VCFW_t7Cx-uCJ_IK-J2o5-l25Y7PIwg8no";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 👇 Опционально: интерцептор ответов — глобальная обработка ошибок
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);

    // Можно показать toast, редирект на логин при 401 и т.д.
    if (error.response?.status === 401) {
      // Например: router.push('/login')
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
