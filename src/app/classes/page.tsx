"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Class } from "@/types/groups";

interface ClassFilters {
  orderBy: "asc" | "desc";
  page: number;
  type: "all" | "active" | "archived";
}

const router = useRouter();

export default async function ClassesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <div>ClassesPage</div>;
}
