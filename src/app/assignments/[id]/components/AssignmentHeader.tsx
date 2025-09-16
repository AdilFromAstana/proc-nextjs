// components/Assignment/AssignmentHeader.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignmentHeaderProps {
  assignment: any;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export default function AssignmentHeader({
  assignment,
  sortBy,
  onSortByChange,
}: AssignmentHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{assignment.name}</h1>
            <div className="text-sm text-gray-600 mb-4">
              Статус:{" "}
              <span className="font-medium capitalize">
                {assignment.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {assignment.progress && (
              <div className="min-w-[200px]">
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогресс</span>
                  <span>{assignment.progress.total}%</span>
                </div>
                <Progress
                  value={assignment.progress.total}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="mt-6">
          <label className="text-sm font-medium mb-2 block">
            Сортировка студентов
          </label>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите сортировку" />
            </SelectTrigger>
            <SelectContent>
              {[
                { id: "lastname", name: "По фамилии" },
                { id: "points", name: "По баллам" },
                { id: "credibility", name: "По надёжности" },
              ].map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
