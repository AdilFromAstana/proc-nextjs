import { CourseItem } from "@/mockData";

export function sortCourses(courses: CourseItem[], sortOrder: string) {
  return [...courses].sort((a, b) => {
    if (sortOrder === "name_asc") return a.title.localeCompare(b.title);
    if (sortOrder === "name_desc") return b.title.localeCompare(a.title);
    if (sortOrder === "date_newest") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sortOrder === "date_oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    return 0;
  });
}
