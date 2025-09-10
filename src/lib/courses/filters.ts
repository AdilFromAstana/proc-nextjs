import { CourseItem } from "@/mockData";

export function filterCourses(
  courses: CourseItem[],
  {
    searchQuery,
    statusFilter,
    typeFilter,
  }: { searchQuery: string; statusFilter: string; typeFilter: string }
) {
  return courses.filter((course) => {
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && course.status !== statusFilter) {
      return false;
    }
    if (typeFilter !== "all" && course.type !== typeFilter) {
      return false;
    }
    return true;
  });
}
