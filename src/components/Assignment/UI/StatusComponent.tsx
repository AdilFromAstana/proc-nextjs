"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";

interface AssignmentStatusComponentProps {
  status: string | null;
  size?: "big" | "small";
  className?: string;
}

const statusColors = {
  process: "bg-blue-600",
  completed: "bg-green-600",
  remaining: "bg-yellow-600",
  suspended: "bg-gray-500",
};

const AssignmentStatusComponent: React.FC<AssignmentStatusComponentProps> = ({
  status,
  size = "big",
  className = "",
}) => {
  const { t } = useTranslation();

  if (!status) return null;

  const getStatusLabel = () => {
    return t(`label-assignment-${status}`);
  };

  const baseClasses =
    "text-white font-semibold rounded text-center inline-block";

  const sizeClasses =
    size === "small" ? "text-xs px-1.5 py-1" : "text-sm px-4 py-3";

  const statusClass =
    statusColors[status as keyof typeof statusColors] || "bg-gray-300";

  return (
    <div className={cn(baseClasses, sizeClasses, statusClass, className)}>
      {getStatusLabel()}
    </div>
  );
};

export default AssignmentStatusComponent;
