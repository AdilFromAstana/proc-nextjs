// components/Assignment/AssignmentHeader.tsx

import ProgressBar from "@/components/Oqylyk/Assignment/Student/ProgressBar";
import ActionsSection from "@/components/Oqylyk/Assignment/Student/Sections/ActionsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isCompletedStatus } from "@/utils/assignmentHelpers";

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
            <ProgressBar
              progress={assignment.progress.total}
              animate={!isCompletedStatus(assignment)}
            />
            <ActionsSection assignmentId={assignment.id} refreshing={false} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
