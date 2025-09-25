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
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiMjUxYjNlZWY0M2RjOGJlYTBkM2ZmZjZkMWUzZmI3OGM2MGQ1NjEzZGFlYTg5ZGM4ZGQwMzU0MzRlZWMyMTFmZDc2ZGJlMzQ4OGE4ODc5YjgiLCJpYXQiOjE3NTg3MTA5NTYuOTA4Mzc2LCJuYmYiOjE3NTg3MTA5NTYuOTA4Mzc3OSwiZXhwIjoxNzkwMjQ2OTU2Ljg1OTk2MDEsInN1YiI6IjI3NTM1NDQiLCJzY29wZXMiOlsiKiJdfQ.mkGPcYx4bhxh9J66F03K24HOMbZ7xevgPN2rgomIdPk1WuyNPI_Aa-vxXDJl1zie52sMk_nZD0SJY9VOSThM9GLr_FidEu3SPedhejUz3I0elnVNOYaNZclSBvWJUyZ8zzC12vwVIQonhuik6mVCRhLKFXHblT5gToprUCOPpJ4big8-TlmMZ0d7mYwlCennyUaxGNo5eG1CoVZdq-kTFgsf65kNJd4KCxjw_VJ0S3BVvs1cO0pnO7yEpDTjDVS8aKOxrMj85wkaYZaLzKwz8B18OMkrmBbVdlhD1aVdZsDKVzcHKmcGv4Yc8gcy9FSyMdJmkR1qXQL33Im1-HNSCl5BisXjG0B8wL6KdS3m7xplMmFi1xN_l4mOcmdvvlhXGt7CXPF7QHQ811C3mLmBEAoxkntGHtFeq8zRPhsfk8rKyP5cqDpa3Ak7clDI2Gs7ewH4sXxQbJfMPsR9KpaLsXbZ6RN0t3AxpwWCxU5mKqEC_u104khXfaAcdmdQUfkpGUXU4ryzFYS0eLZkimteyB0OchA9HD6ne79OWiiaJocZ5I8sX4GCCoqnAWu7oNg-lsBQ2izyeKjZWuqzlmwWVkRyPd5IZxul6YFySNXPKBXFRVoIu3jdajzmP-utb6zofq3fKPPX1mPJycoUuTAUg-wJOCQfJgFUMEwoG1Dhq4w";

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
