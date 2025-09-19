// api/certificate/fetchCertificate.ts
import { CertificateDetailResponse } from "@/types/assignment/certificate";
import axiosClient from "../axiosClient"; // Убедитесь, что путь правильный

/**
 * Получить детали сертификата по его ID
 * @param certificateId ID сертификата
 * @returns Promise с данными сертификата
 */
export const fetchCertificate = async (
  certificateId: number
): Promise<CertificateDetailResponse> => {
  // Поля, которые мы хотим запросить у API (если ваш фронтенд поддерживает X-Requested-Fields)
  // const fields = [
  //   'id', 'owner_id', 'name', 'description', 'meta', 'serial_number', 'serial_counter', 'image'
  // ];

  const response = await axiosClient.get<CertificateDetailResponse>(
    `/certificates/${certificateId}` // Путь к эндпоинту API
    // {
    // headers: { "X-Requested-Fields": fields.join(",") }, // Раскомментируйте, если используется
    // params: { /* дополнительные параметры запроса, если нужны */ }
    // }
  );
  return response.data;
};
