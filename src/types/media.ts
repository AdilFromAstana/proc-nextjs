// Тип для превью изображений
export interface MediaThumbs {
  big: string;
  medium: string;
  small: string;
  tiny: string;
  pixel: string;
}

// Основной тип медиафайла
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
  thumbs?: MediaThumbs;
}

// Тип для ответа API
export interface MediaApiResponse {
  status: string;
  status_code: string;
  entities: MediaFile[];
}

// Тип для параметров запроса
export interface FetchMediaParams {
  page?: number;
  limit?: number;
  type?: "folder" | "image" | "document" | "video" | "audio" | "all";
  orderBy?: "created_at" | "name" | "file_size" | "type";
  orderDirection?: "asc" | "desc";
  query?: string;
  status?: string;
  parentId?: number | null;
  dateFrom?: string;
  dateTo?: string;
}

// Тип для мета-информации пагинации
export interface MediaMeta {
  total: number;
  current_page: number;
  total_pages: number;
  per_page: number;
}

// Типы для различных категорий файлов
export type FileType = MediaFile["type"];

export interface Folder extends MediaFile {
  type: "folder";
  file_name: null;
  file_size: null;
  mime_type: null;
  duration: null;
  path: null;
  src: null;
  preview_src: null;
  preview?: undefined;
  thumbs?: undefined;
}

export interface ImageFile extends MediaFile {
  type: "image";
  file_name: string;
  file_size: number;
  mime_type: string;
  src: string;
  preview?: string;
  thumbs?: MediaThumbs;
}

export interface DocumentFile extends MediaFile {
  type: "document";
  file_name: string;
  file_size: number;
  mime_type: string;
  src: string;
}

export interface VideoFile extends MediaFile {
  type: "video";
  file_name: string;
  file_size: number;
  mime_type: string;
  duration: number | null;
  src: string;
  preview?: string;
  thumbs?: MediaThumbs;
}

export interface AudioFile extends MediaFile {
  type: "audio";
  file_name: string;
  file_size: number;
  mime_type: string;
  duration: number | null;
  src: string;
}

// Вспомогательные типы
export interface MediaPreview {
  url: string;
  width: number;
  height: number;
}

export interface MediaUploadResponse {
  success: boolean;
  file?: MediaFile;
  error?: string;
}

// Тип для создания новой папки
export interface CreateFolderPayload {
  name: string;
  parent_id?: number | null;
  description?: string;
}

// Тип для загрузки файла
export interface UploadFilePayload {
  file: File;
  parent_id?: number | null;
  description?: string;
}
