// ~/hooks/useEnums.ts
import { enumService } from "@/api/enum/listApi";
import { EnumOption } from "@/types/enum";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export const useEnums = () => {
  const t = useTranslations();
  const [enums, setEnums] = useState<Record<string, EnumOption[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadEnums = async () => {
      try {
        setLoading(true);
        const enumsData = await enumService.getAllEnums();
        setEnums(enumsData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadEnums();
  }, []);

  const getEnum = (enumName: string): EnumOption[] => {
    return enums[enumName] || [];
  };

  const getEnumOptions = (
    enumName: string
  ): { raw: string; name: string }[] => {
    const enumData = getEnum(enumName);
    return enumData.map((item) => ({
      raw: item.raw,
      name: item.name,
    }));
  };

  const refreshEnums = async (): Promise<void> => {
    try {
      setLoading(true);
      enumService.clearCache();
      const enumsData = await enumService.getAllEnums(true);
      setEnums(enumsData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    enums,
    getEnum,
    getEnumOptions,
    loading,
    error,
    refreshEnums,
  };
};
