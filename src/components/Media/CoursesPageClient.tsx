"use client";

import React, { useState } from "react";
import { CourseItem } from "@/mockData";
import { filterCourses } from "@/lib/courses/filters";
import { sortCourses } from "@/lib/courses/sorting";
import Toolbar from "../Media/Toolbar";
import CourseList from "../Media/CourseList";

type Props = {
  initialCourses: CourseItem[];
};

export default function CoursesPageClient({ initialCourses }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("name_asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = filterCourses(initialCourses, {
    searchQuery,
    statusFilter,
    typeFilter,
  });

  const sorted = sortCourses(filtered, sortOrder);

  return (
    <>
      <Toolbar
        viewMode={viewMode}
        onToggleView={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
      />

      <CourseList courses={sorted} viewMode={viewMode} />
    </>
  );
}
