// components/Assignment/AssignmentHeader.tsx

import ProgressBar from "@/components/Oqylyk/Assignment/Student/ProgressBar";
import ActionsSection from "@/components/Oqylyk/Assignment/Student/Sections/ActionsSection";
import { Card } from "@/components/ui/card";
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
    <Card className="p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{assignment.name}</h1>
          <div className="text-sm text-gray-600 mb-4">Прогресс</div>
          <ProgressBar
            progress={assignment.progress.total}
            animate={!isCompletedStatus(assignment)}
          />
          <ActionsSection assignmentId={assignment.id} refreshing={false} />
        </div>
      </div>
    </Card>
  );
}
