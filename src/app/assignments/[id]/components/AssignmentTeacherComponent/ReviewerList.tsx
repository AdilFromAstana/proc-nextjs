// components/Assignment/TeacherReviewer/ReviewerList.tsx
import React from "react";
import { Teacher } from "@/types/assignment/teacher";
import ReviewerItem from "./ReviewerItem";

interface ReviewerListProps {
  reviewers: Teacher[];
  selectedReviewers: Teacher[];
  onReviewerSelect: (reviewer: Teacher) => void;
  getUserInitials: (teacher: Teacher) => string;
}

const ReviewerList: React.FC<ReviewerListProps> = React.memo(
  ({ reviewers, selectedReviewers, onReviewerSelect, getUserInitials }) => {
    if (reviewers.length === 0) return null;

    const selectedIds = new Set(selectedReviewers.map((r) => r.id));

    return (
      <div className="mt-4 space-y-2">
        {reviewers.map((reviewer) => (
          <ReviewerItem
            key={reviewer.id}
            reviewer={reviewer}
            isSelected={selectedIds.has(reviewer.id)}
            onSelect={onReviewerSelect}
            getUserInitials={getUserInitials}
          />
        ))}
      </div>
    );
  }
);

ReviewerList.displayName = "ReviewerList";
export default ReviewerList;
