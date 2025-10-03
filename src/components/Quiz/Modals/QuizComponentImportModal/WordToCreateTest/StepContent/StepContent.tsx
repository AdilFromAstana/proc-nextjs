"use client";
import React, { forwardRef, ForwardedRef } from "react";
import { ParseError, Question } from "../WordToCreateTest";
import StepReview, { StepReviewHandle } from "../StepReview";
import StepUpload from "../StepUpload";
import SidebarErrors from "./SidebarErrors";

interface Props {
  step: number;
  file: File | null;
  questions: Question[];
  parseErrors: ParseError[];
  showErrorSidebar: boolean;
  onFileChange: (f: File) => void;
  onFileRemove: () => void;
  onEdit: (q: Question) => void;
  onDelete: (id: number) => void;
  onShowErrors: () => void;
  onClickError: (id: number) => void;
}

const StepContent = forwardRef(
  (
    {
      step,
      file,
      questions,
      parseErrors,
      showErrorSidebar,
      onFileChange,
      onFileRemove,
      onEdit,
      onDelete,
      onShowErrors,
      onClickError,
    }: Props,
    ref: ForwardedRef<StepReviewHandle>
  ) => {
    return (
      <div className="flex gap-2 p-6 flex-1 overflow-hidden">
        <div className="flex-1">
          {step === 1 && (
            <StepUpload
              file={file}
              onFileChange={onFileChange}
              onFileRemove={onFileRemove}
            />
          )}
          {step === 2 && (
            <StepReview
              ref={ref}
              parseErrors={parseErrors}
              questions={questions}
              onEdit={onEdit}
              onDelete={onDelete}
              onShowErrors={onShowErrors}
            />
          )}
        </div>

        {step === 2 && (
          <SidebarErrors
            show={showErrorSidebar}
            errors={parseErrors}
            onClickError={onClickError}
          />
        )}
      </div>
    );
  }
);

StepContent.displayName = "StepContent";
export default StepContent;
