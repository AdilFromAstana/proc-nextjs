import MediafilesPageClient from "@/components/Media/MediafilesPageClient";
import { getTranslations } from "next-intl/server";

export default async function MediafilesPage() {
  const t = await getTranslations();
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="mx-auto sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          {t("page-media-index")}
        </h1>
        <MediafilesPageClient />
      </div>
    </div>
  );
}
