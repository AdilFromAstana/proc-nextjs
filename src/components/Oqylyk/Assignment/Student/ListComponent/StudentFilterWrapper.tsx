import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface StudentFilterWrapperProps {
  fields: string[];
  params: Record<string, any>;
  page: number;
  sortBy: string;
  sortByOptions: { id: string; name: string }[];
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
}

const StudentFilterWrapper: React.FC<StudentFilterWrapperProps> = ({
  fields,
  params,
  page,
  sortBy,
  sortByOptions,
  onSortChange,
  onPageChange,
  children,
}) => {
  return (
    <div className="student-filter-wrapper w-full">
      {/* Toolbar */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Фильтр студентов</div>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировать по" />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default StudentFilterWrapper;
