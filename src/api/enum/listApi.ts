import { EnumOption, EnumsResponse } from "@/types/enum";
import axiosClient from "../axiosClient";

class EnumService {
  private cache: EnumsResponse["enumerations"] | null = null;
  private loading: boolean = false;
  private loadPromise: Promise<EnumsResponse["enumerations"]> | null = null;

  async getAllEnums(
    forceRefresh: boolean = false
  ): Promise<EnumsResponse["enumerations"]> {
    // Возвращаем кэш если есть и не форсируем обновление
    if (this.cache && !forceRefresh) {
      return this.cache;
    }

    // Возвращаем существующий промис если уже загружаем
    if (this.loading && this.loadPromise) {
      return this.loadPromise;
    }

    this.loading = true;
    this.loadPromise = this.fetchEnums();

    try {
      const enums = await this.loadPromise;
      this.cache = enums;
      return enums;
    } catch (error) {
      throw error;
    } finally {
      this.loading = false;
      this.loadPromise = null;
    }
  }

  async getEnum<T = EnumOption[]>(enumName: string): Promise<T> {
    const enums = await this.getAllEnums();
    return enums[enumName] as T;
  }

  private async fetchEnums(): Promise<EnumsResponse["enumerations"]> {
    try {
      const response = await axiosClient.get<EnumsResponse>("/enums.json");

      if (response.data.status !== "success") {
        throw new Error("Failed to fetch enums");
      }

      return response.data.enumerations;
    } catch (error) {
      console.error("Error fetching enums:", error);
      throw error;
    }
  }

  // Очистка кэша
  clearCache(): void {
    this.cache = null;
  }
}

export const enumService = new EnumService();
