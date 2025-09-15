import { CourseItem } from "@/mockData";
import CourseCard from "../Media/CourseCard";
import CourseListItem from "./CourseListItem";

type Props = {
  courses: CourseItem[];
  viewMode: "grid" | "list";
};

export default function CourseList({ courses, viewMode }: Props) {
  if (courses.length === 0) {
    return <div className="text-center py-12">Нет доступных курсов</div>;
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mr-10">
      {courses.map((c) => (
        <CourseListItem key={c.id} course={c} viewMode="list"/>
      ))}
    </div>
  );
}
