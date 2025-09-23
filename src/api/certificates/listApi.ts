import {
  CertificateItemResponse,
  CertificatesListResponse,
} from "@/types/certificates/certificates";
import axiosClient from "../axiosClient";

export const fetchCertificatesList =
  async (): Promise<CertificatesListResponse> => {
    const response = await axiosClient.get<CertificatesListResponse>(
      "/certificates"
    );

    return response.data;
  };

export const fetchCertificateById = async (
  id: number
): Promise<CertificateItemResponse> => {
  const response = await axiosClient.get<CertificateItemResponse>(
    `/certificates/${id}`
  );

  return response.data;
};
