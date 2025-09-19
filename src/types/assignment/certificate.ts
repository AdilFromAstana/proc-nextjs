// types/certificate/index.ts

// Определяем структуру одного мета-поля сертификата
export interface CertificateMeta {
  field: string;
  value: string;
}

// Основной интерфейс для данных сертификата
export interface Certificate {
  id: number;
  owner_id: number;
  name: string;
  description: string | null; // Описание может быть null
  meta: CertificateMeta[]; // Массив мета-данных
  serial_number: string | null;
  serial_counter: number | null;
  image: string | null; // URL изображения может быть null
}

// Интерфейс для ответа API, содержащего один сертификат
export interface CertificateDetailResponse {
  status: string; // "success"
  status_code: string; // "0000"
  entity: Certificate; // Сам объект сертификата
}

// Если API может возвращать список сертификатов, добавим и его
// export interface CertificateListResponse {
//   status: string;
//   status_code: string;
//   entities: {
//     data: Certificate[];
//     // ... другие поля пагинации, если есть (total, per_page, current_page и т.д.)
//   };
// }
