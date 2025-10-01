// components/Assignment/TeacherReviewer/TeacherReviewerSection.tsx
import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";
import { Teacher } from "@/types/assignment/teacher";
import { AssignmentDetail } from "@/types/assignment/detail";
import TeacherListModalComponent from "./TeacherListModalComponent";
import SelectedTeacherDisplay from "./SelectedTeacherDisplay";
import ReviewerList from "./ReviewerList";
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";
import { useTranslations } from "next-intl";

interface AssignmentTeacherReviewerComponent {
  assignment: AssignmentDetail;
  isManager: boolean;
  onAssignmentChange: (assignment: AssignmentDetail) => void;
}

const AssignmentTeacherReviewerComponent: React.FC<AssignmentTeacherReviewerComponent> =
  React.memo(({ assignment, isManager, onAssignmentChange }) => {
    const t = useTranslations();

    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(
      assignment.owner || null
    );
    const [selectedReviewers, setSelectedReviewers] = useState<Teacher[]>([]);
    const [teacherModalOpen, setTeacherModalOpen] = useState(false);
    const [reviewerModalOpen, setReviewerModalOpen] = useState(false);

    // Memoized values
    const teacherExceptedEntities = useMemo(
      () => assignment.reviewers,
      [assignment.reviewers]
    );
    const reviewerExceptedEntities = useMemo(
      () => (selectedTeacher ? [selectedTeacher] : []),
      [selectedTeacher]
    );

    // Handlers (memoized)
    const showTeacherListModal = useCallback(() => {
      setTeacherModalOpen(true);
    }, []);

    const showReviewerListModal = useCallback(() => {
      setReviewerModalOpen(true);
    }, []);

    const onTeacherSelected = useCallback((user: Teacher) => {
      setSelectedTeacher(user);
      setTeacherModalOpen(false);
    }, []);

    const onReviewersSelected = useCallback(
      (users: Teacher | Teacher[]) => {
        const usersArray = Array.isArray(users) ? users : [users];
        const newReviewers = [...assignment.reviewers, ...usersArray];

        onAssignmentChange({
          ...assignment,
          reviewers: newReviewers,
        });

        setSelectedReviewers([]);
      },
      [assignment, onAssignmentChange]
    );

    const handleReviewerSelect = useCallback((reviewer: Teacher) => {
      setSelectedReviewers((prev) => {
        const isSelected = prev.some((r) => r.id === reviewer.id);
        if (isSelected) {
          return prev.filter((r) => r.id !== reviewer.id);
        } else {
          return [...prev, reviewer];
        }
      });
    }, []);

    const removeSelectedReviewers = useCallback(() => {
      if (selectedReviewers.length > 0) {
        const reviewersToRemove = new Set(selectedReviewers.map((r) => r.id));
        const newReviewers = assignment.reviewers.filter(
          (reviewer) => !reviewersToRemove.has(reviewer.id)
        );

        onAssignmentChange({
          ...assignment,
          reviewers: newReviewers,
        });

        setSelectedReviewers([]);
      }
    }, [assignment, selectedReviewers, onAssignmentChange]);

    // Функция для получения инициалов пользователя (memoized)
    const getUserInitials = useCallback((teacher: Teacher) => {
      return `${teacher.user?.firstname?.charAt(0) || ""}${
        teacher.user?.lastname?.charAt(0) || ""
      }`.toUpperCase();
    }, []);

    return (
      <CollapsibleCard
        title={t("label-assignment-teacher-title")}
        description={t("label-assignment-teacher-description")}
        icon={<User className="h-5 w-5 text-blue-600" />}
      >
        {/* SELECT TEACHER */}
        <div>
          <h4 className="text-sm font-medium mb-2">
            {t("label-assignment-teacher")}
          </h4>

          <Button
            onClick={showTeacherListModal}
            className="flex items-center justify-center"
          >
            <User className="w-4 h-4 mr-2" />
            {t("btn-assignment-select-teacher")}
          </Button>

          {/* SELECTED TEACHER */}
          <SelectedTeacherDisplay
            selectedTeacher={selectedTeacher}
            getUserInitials={getUserInitials}
          />
        </div>

        {/* SELECT REVIEWERS */}
        <div>
          <h4 className="text-sm font-medium mb-2">
            {t("label-assignment-reviewer-list")}
          </h4>

          <div className="flex flex-wrap gap-2 items-center">
            <Button
              onClick={showReviewerListModal}
              className="flex items-center justify-center"
            >
              <Users className="w-4 h-4 mr-2" />
              {t("btn-assignment-select-reviewers")}
            </Button>

            {assignment.reviewers.length > 0 &&
              selectedReviewers.length > 0 && (
                <Button
                  variant="outline"
                  onClick={removeSelectedReviewers}
                  className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
                >
                  Отменить выбор
                </Button>
              )}
          </div>

          {/* SELECTED REVIEWERS LIST */}
          <ReviewerList
            reviewers={assignment.reviewers}
            selectedReviewers={selectedReviewers}
            onReviewerSelect={handleReviewerSelect}
            getUserInitials={getUserInitials}
          />
        </div>

        {/* MODAL WINDOWS */}
        <TeacherListModalComponent
          open={teacherModalOpen}
          onOpenChange={setTeacherModalOpen}
          multiple={false}
          onSelect={onTeacherSelected}
          exceptedEntities={teacherExceptedEntities}
        />

        <TeacherListModalComponent
          open={reviewerModalOpen}
          onOpenChange={setReviewerModalOpen}
          multiple={true}
          onSelect={onReviewersSelected}
          exceptedEntities={reviewerExceptedEntities}
        />
      </CollapsibleCard>
    );
  });

AssignmentTeacherReviewerComponent.displayName =
  "AssignmentTeacherReviewerComponent";
export default AssignmentTeacherReviewerComponent;
