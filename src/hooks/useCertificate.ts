// hooks/useCertificate.ts
import { fetchCertificate } from "@/api/assignmentDetail/certificateApi";
import { CertificateDetailResponse } from "@/types/assignment/certificate";
import { useQuery } from "@tanstack/react-query";

/**
 * Хук для получения данных сертификата
 * @param certificateId ID сертификата
 * @returns Объект useQuery с данными сертификата
 */
export const useCertificate = (certificateId: number | null) => {
  return useQuery<CertificateDetailResponse>({
    queryKey: ["certificate", certificateId], // queryKey должен быть сериализуемым и уникальным для этого запроса
    queryFn: () => {
      if (!certificateId) {
        // Если ID не передан, отклоняем промис, чтобы useQuery перешел в состояние isError
        // или можно вернуть `Promise.reject(new Error("Certificate ID is required"))`
        // Но лучше отключить запрос, если ID нет (см. enabled)
        return Promise.reject(new Error("Certificate ID is required"));
      }
      return fetchCertificate(certificateId);
    },
    enabled: !!certificateId, // Запрос выполняется только если certificateId не null/undefined
    staleTime: 1000 * 60 * 5, // 5 минут, можно настроить по желанию
    // gcTime: 1000 * 60 * 30, // 30 минут (время, на которое данные остаются в кэше после неиспользования)
    retry: 1, // Количество попыток повтора при ошибке (по умолчанию 3)
  });
};
