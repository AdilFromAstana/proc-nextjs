import { EnumOption } from "@/types/enum";
import axiosClient from "../axiosClient";

export const getVariantQuestionType = async (): Promise<EnumOption[]> => {
  const response = await axiosClient.get<EnumOption[]>(
    "/enum/VariantQuestionType.json"
  );
  return response.data["VariantQuestionType"];
};

export const getGuardType = async (): Promise<EnumOption[]> => {
  const response = await axiosClient.get<EnumOption[]>("/enum/GuardType.json");
  return response.data["GuardType"];
};

export const getChatMessageActionType = async (): Promise<EnumOption[]> => {
  const response = await axiosClient.get<EnumOption[]>(
    "/enum/ChatMessageActionType.json"
  );
  return response.data["ChatMessageActionType"];
};

export const getDifficultLevelQuestionType = async (): Promise<
  EnumOption[]
> => {
  const response = await axiosClient.get<EnumOption[]>(
    "/enum/DifficultLevelQuestionType.json"
  );

  return response.data["DifficultLevelQuestionType"];
};

export const getQuestionType = async (): Promise<EnumOption[]> => {
  const response = await axiosClient.get<EnumOption[]>(
    "/enum/QuestionType.json"
  );
  return response.data["QuestionType"];
};
