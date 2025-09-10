import { getBlocks, getComponents, getUIPrimitives } from "@/lib/registry";

import NewsComponent from "@/components/News/NewsComponent";
import { mockLessons, mockNews, mockTasks } from "@/mockData";
import TasksListComponent from "@/components/Tasks/TaskListComponent";
import LessonsListComponent from "@/components/Lessons/LessonsListComponent";

export default function Home() {
  return (
    <main className="container mt-4 p-5 md:mt-8 md:p-10">
      <NewsComponent news={mockNews} />
      <TasksListComponent tasks={mockTasks} />
      <LessonsListComponent lessons={mockLessons} />
    </main>
  );
}
