import MediafilesPageClient from "@/components/Media/MediafilesPageClient";

export default async function MediafilesPage() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="mx-auto sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Медиафайлы</h1>
        <MediafilesPageClient />
      </div>
    </div>
  );
}
