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
      // "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiMjUxYjNlZWY0M2RjOGJlYTBkM2ZmZjZkMWUzZmI3OGM2MGQ1NjEzZGFlYTg5ZGM4ZGQwMzU0MzRlZWMyMTFmZDc2ZGJlMzQ4OGE4ODc5YjgiLCJpYXQiOjE3NTg3MTA5NTYuOTA4Mzc2LCJuYmYiOjE3NTg3MTA5NTYuOTA4Mzc3OSwiZXhwIjoxNzkwMjQ2OTU2Ljg1OTk2MDEsInN1YiI6IjI3NTM1NDQiLCJzY29wZXMiOlsiKiJdfQ.mkGPcYx4bhxh9J66F03K24HOMbZ7xevgPN2rgomIdPk1WuyNPI_Aa-vxXDJl1zie52sMk_nZD0SJY9VOSThM9GLr_FidEu3SPedhejUz3I0elnVNOYaNZclSBvWJUyZ8zzC12vwVIQonhuik6mVCRhLKFXHblT5gToprUCOPpJ4big8-TlmMZ0d7mYwlCennyUaxGNo5eG1CoVZdq-kTFgsf65kNJd4KCxjw_VJ0S3BVvs1cO0pnO7yEpDTjDVS8aKOxrMj85wkaYZaLzKwz8B18OMkrmBbVdlhD1aVdZsDKVzcHKmcGv4Yc8gcy9FSyMdJmkR1qXQL33Im1-HNSCl5BisXjG0B8wL6KdS3m7xplMmFi1xN_l4mOcmdvvlhXGt7CXPF7QHQ811C3mLmBEAoxkntGHtFeq8zRPhsfk8rKyP5cqDpa3Ak7clDI2Gs7ewH4sXxQbJfMPsR9KpaLsXbZ6RN0t3AxpwWCxU5mKqEC_u104khXfaAcdmdQUfkpGUXU4ryzFYS0eLZkimteyB0OchA9HD6ne79OWiiaJocZ5I8sX4GCCoqnAWu7oNg-lsBQ2izyeKjZWuqzlmwWVkRyPd5IZxul6YFySNXPKBXFRVoIu3jdajzmP-utb6zofq3fKPPX1mPJycoUuTAUg-wJOCQfJgFUMEwoG1Dhq4w";
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiOTkyMWUzZGMxYjhmZTI3YzU1YjM3YzI2ZDg1OWQxNDI0MWViZmJiNTU3NWFhN2U3ZTM0YzQ0ODczMTA4ZjFjZDlmOGQ1MTFhMThhZWI0MWYiLCJpYXQiOjE3NTkxMjA4OTguNzg4MzYxMSwibmJmIjoxNzU5MTIwODk4Ljc4ODM2MywiZXhwIjoxNzkwNjU2ODk4Ljc2MDg5NjksInN1YiI6IjI3NTM1MzYiLCJzY29wZXMiOlsiKiJdfQ.cNFV5lN0bg8t6jjue_JgnmQ3shHxISgDS3QM4FfgljAJklgIhc4ZMcomrFzXg886zEwC9lhbYbW7E3Dwhg8FbYnzMq2jfJX9ZG_X8o8X0cAn3pzO8YLa6hALED-wH9AE0M3LNcl7yu8ctmAdixWXNcljdqyaWQhh_VAC-QVBfKoMaX8yrRTjL86O60gT-y0h-Ea87a_bpdwRqd26D19EtMRG4jfMNr4FcpRyjqAsMGmLz6oPLU2u_xnYm_NrOE-nvpN1wxBxCrsXcVosM6H5bW3cdhviFkFtonj2v8FCzTC8eQdao2aUUbrlW4yEXwOnkDo0KnWdVrog8yzs5SIZiQyoId7o7lTcAsgWIX6bAe10i2WfGfgKWoLUOKQWRncgSdq4PhasodYB4LCeCbzyDnSGwpn-dxjmqRdjdTIywgEu3XbjVGD0OCQEjRY820-1HR3WwM-Fw-J3jra0carS_hov-5si1CZCaJA_xZd9vkCi0rv898PMGN6AzkBM2hWCfg1MxE-9lMFRZWkuL6qiknusWaxvbEQBcAa-Af2Fy_wELQ6Y5hQOtTD-HPBpZpXMtEiQMx8SQg6b0SGrgiKhV5A4VoRE7GSjNsol0HqsqP_Io09Couw9BRCWT1XfXyXCCCnCR_Ksvt8VEqc1cXD36CzxeZedM6ftIXpgmwJmIW4";

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
