import axiosClient from "./axiosClient";

// Типы для медиафайлов
export interface MediaFile {
  id: number;
  owner_id: number;
  storage_id: number | null;
  parent_id: number | null;
  status: string;
  type: "folder" | "image" | "document" | "video" | "audio" | string;
  name: string;
  description: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  duration: number | null;
  path: string | null;
  src: string | null;
  preview_src: string | null;
  created_at: string;
  preview?: string;
  thumbs?: {
    big: string;
    medium: string;
    small: string;
    tiny: string;
    pixel: string;
  };
}

// Тип для параметров запроса
export interface FetchMediaParams {
  page?: number;
  type?: string;
  orderBy?: string;
  query?: string | null;
  status?: string | null;
  date?: string | null;
  parentId?: number | null;
  limit?: number;
}

// Тип для переименования
export interface RenameMediaParams {
  name: string;
}

// Тип ответа от API
export interface MediaApiResponse {
  status: string;
  status_code: string;
  entities: MediaFile[];
  meta?: {
    total_pages?: number;
    current_page?: number;
    total?: number;
    per_page?: number;
  };
}

export interface SingleMediaFileResponse {
  status: string;
  status_code: string;
  entity: MediaFile;
}

// Адаптированный тип для фронтенда
export interface MediaResponse {
  data: MediaFile[];
  meta: {
    total_pages: number;
    current_page: number;
    total: number;
    per_page: number;
  };
}

// Функция для получения списка медиафайлов
export const fetchMediaFiles = async (
  params: FetchMediaParams = {}
): Promise<MediaResponse> => {
  try {
    const response = await axiosClient.get<MediaApiResponse>("/media", {
      params: Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) =>
            value !== undefined && value !== null && value !== "all"
        )
      ),
    });

    // Адаптируем ответ под нужный формат
    return {
      data: response.data.entities,
      meta: {
        total_pages: response.data.meta?.total_pages || 1,
        current_page: response.data.meta?.current_page || 1,
        total: response.data.meta?.total || response.data.entities.length,
        per_page: response.data.meta?.per_page || 20,
      },
    };
  } catch (error) {
    console.error("Ошибка при получении медиафайлов:", error);
    throw error;
  }
};

// Исправленная функция для открытия папки
export const openFolderById = async (id: number): Promise<MediaResponse> => {
  try {
    const response = await axiosClient.get<MediaApiResponse>(
      `/media?parent_id=${id}` // Исправлен URL
    );
    // Возвращаем весь список файлов, а не только первый
    return {
      data: response.data.entities,
      meta: {
        total_pages: response.data.meta?.total_pages || 1,
        current_page: response.data.meta?.current_page || 1,
        total: response.data.meta?.total || response.data.entities.length,
        per_page: response.data.meta?.per_page || 20,
      },
    };
  } catch (error) {
    console.error(`Ошибка при получении содержимого папки с ID ${id}:`, error);
    throw error;
  }
};

// Функция для создания папки
export const createFolder = async (
  name: string,
  parentId: number | null = null
): Promise<MediaFile> => {
  try {
    // Формируем данные для отправки
    const requestData: any = {
      name,
      type: "folder",
    };

    // Добавляем parent_id только если он не null
    if (parentId !== null) {
      requestData.parent_id = parentId;
    }

    const response = await axiosClient.post<SingleMediaFileResponse>(
      "/media",
      requestData
    );

    console.log("Ответ после создания папки:", response.data.entity);
    return response.data.entity;
  } catch (error) {
    console.error("Ошибка при создании папки:", error);
    throw error;
  }
};

// Функция для загрузки файлов
export const uploadMediaFile = async (
  file: File,
  parentId: number | null = null
): Promise<MediaFile> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (parentId !== null) {
      formData.append("parent_id", parentId.toString());
    }

    const response = await axiosClient.post<SingleMediaFileResponse>(
      "/media",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.entity;
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error);
    throw error;
  }
};

// Функция для удаления медиафайла
export const deleteMediaFile = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(`/media/${id}`);
  } catch (error) {
    console.error(`Ошибка при удалении медиафайла с ID ${id}:`, error);
    throw error;
  }
};

// Функция для обновления медиафайла
export const updateMediaFile = async (
  id: number,
  data: Partial<MediaFile>
): Promise<MediaFile> => {
  try {
    const response = await axiosClient.put<MediaApiResponse>(
      `/media/${id}`,
      data
    );
    return response.data.entities[0];
  } catch (error) {
    console.error(`Ошибка при обновлении медиафайла с ID ${id}:`, error);
    throw error;
  }
};

// Функция для переименования медиафайла
export const renameMediaFile = async (
  id: number,
  newName: string
): Promise<MediaFile> => {
  try {
    const response = await axiosClient.put<SingleMediaFileResponse>(
      `/media/${id}`,
      {
        name: newName,
      }
    );

    return response.data.entity;
  } catch (error) {
    console.error(`Ошибка при переименовании медиафайла с ID ${id}:`, error);
    throw error;
  }
};
