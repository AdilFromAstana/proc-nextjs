import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

// Загружаем русские сообщения как fallback
const ruMessages = (await import("../../messages/ru.js")).default;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ru";

  let messages = (await import(`../../messages/${locale}.js`)).default;

  // Если локаль не русская, объединяем с русскими сообщениями
  if (locale !== "ru") {
    messages = {
      ...ruMessages, // Fallback на русский
      ...messages, // Переопределяем существующими переводами
    };
  }

  return {
    locale,
    messages,
  };
});
