import CoursesPageClient from "@/components/Media/CoursesPageClient";
import { mockCourses } from "@/mockData";

export default async function MediaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Медиафайлы</h1>

        <CoursesPageClient initialCourses={mockCourses} />
      </div>
    </div>
  );
}
