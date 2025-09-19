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
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiYWY4NmQ5ZGRlYzUyYjlkMTdlNjY5YzEzZDg4NzhiNjMyMzkyOWQ3NzA4MThlZTYwYzEyNTQ5NzU3ZThkMDNhZDFjODliOWZhZjZjYWI1YTkiLCJpYXQiOjE3NTc0MDcxNDUuNzQyMzIyOSwibmJmIjoxNzU3NDA3MTQ1Ljc0MjMyNTEsImV4cCI6MTc4ODk0MzE0NS43MTY1LCJzdWIiOiIyNzQ3NDM2Iiwic2NvcGVzIjpbIioiXX0.fJ3YCCmuP_YmyCmEpxmSSCu8oVbVrOENVhTt51zpX5TNs9YgWcKKOOgkp7bn3IwgqHJ5_ch2Ylsd0MZdZN6UonzYKJFetYpNkEPKYyFit2wwkCB8purKioFL8Xj1qqHOpf9DBDojCOyAnrW7e7Y5UO0mUEym999JLNgTgBt6zs4tQVoVKlMgTziaUrXDW0zyPPO1Gp5ZuGVGxyOV4eVfnUbPf7hbgMQ6Yc-k_hdJgjbCeH7l518lXkpcGNPtQs_EhX4wy8Y_tzkFkgcaE_cD_TZAg7WWFPWYvgI-gXKJnuqhZ6WIqtO7yH7hO1bwDF6NYD8kzg7mNm_nFNYeUS5tTtUGGnif1g8ytx1eWOgXo9dxGfIQZT2JzgF3VZg80OxXJlSaCpAlG2LAE7Jvt9xkamnXSCnchRYsLeSCTbMsNV5FQ_B2I1l5-zEHznMr7UM-NsgJiMq02z1w2kOr-z2_EDw132LBIU0Wlvq_UoTt42uBI67aZgmX8A5nsZuV4iVDoJyeDzh_LU5NWfOLfl5ZxVldlIuzonwvKOtL-_k68ECLQYztAyGgGFpx0j-vkwVtizmr8La33egqCJEDnSZtpCNM4oXMdKn-ZX9hr_gS82_Eb7FZTHIRGwytWkDiI9j5O6r_nZyac40GUaOUvWRw1oyZ-xMiftKSquhWEEudCnQ";

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
