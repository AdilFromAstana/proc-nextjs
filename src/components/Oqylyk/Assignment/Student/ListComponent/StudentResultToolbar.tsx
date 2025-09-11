"use client";
import {
  Attempt,
  Result,
  ReviewerResult,
  StudentResultToolbarProps,
} from "@/types";
import React from "react";

const StudentResultToolbar: React.FC<StudentResultToolbarProps> = ({
  student,
  assignment,
  isReviewer,
  viewer,
}) => {
  // Render student results
  const renderStudentResults = () => {
    if (student.attempts?.length > 0) {
      return (
        <div
          className={`assignment-student-result-toolbar assignment-student-attempt-list ${
            isReviewer ? "reviewer" : "owner"
          }`}
        >
          {student.attempts.models.map((attempt: Attempt) => (
            <div
              key={`student-attempt-${attempt.id}`}
              className={`assignment-result-list ${
                attempt.status === "active" ? "active" : ""
              }`}
            >
              {attempt.results.models.map((result: Result, index: number) => {
                const reviewerResult: ReviewerResult | Result = isReviewer
                  ? student.getReviewerResult(result)
                  : result;
                const resultClass: string = reviewerResult.getClassName();
                const hasPoints: boolean =
                  assignment.isPointSystemEnabled() &&
                  reviewerResult.points !== null;

                return (
                  <div
                    key={`square-result-${index}`}
                    className={`assignment-result-item ${resultClass} ${
                      hasPoints ? "info" : ""
                    }`}
                    style={{
                      width: "15px",
                      height: "15px",
                      minWidth: "2px",
                      margin: "3px 2px",
                      borderRadius: "2px",
                      backgroundColor: "#F0F0F0",
                      display: "inline-block",
                      verticalAlign: "top",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      );
    } else {
      // Without attempts
      return (
        <div
          className={`assignment-student-result-toolbar assignment-student-attempt-list ${
            isReviewer ? "reviewer" : "owner"
          }`}
        >
          <div className="assignment-result-list active">
            {student.results.models.map((result: Result, index: number) => {
              const reviewerResult: ReviewerResult | Result = isReviewer
                ? student.getReviewerResult(result)
                : result;
              const resultClass: string = reviewerResult.getClassName();
              const hasPoints: boolean =
                assignment.isPointSystemEnabled() &&
                reviewerResult.points !== null;

              return (
                <div
                  key={`square-result-${index}`}
                  className={`assignment-result-item ${resultClass} ${
                    hasPoints ? "info" : ""
                  }`}
                  style={{
                    width: "15px",
                    height: "15px",
                    minWidth: "2px",
                    margin: "3px 2px",
                    borderRadius: "2px",
                    backgroundColor: "#F0F0F0",
                    display: "inline-block",
                    verticalAlign: "top",
                  }}
                />
              );
            })}
          </div>
        </div>
      );
    }
  };

  // Render points
  const renderPoints = () => {
    if (assignment.isPointSystemEnabled()) {
      const attempt: Attempt | null = student.getActiveAttempt();
      const points: number = attempt ? attempt.points : student.points;
      const hasPoints: boolean = points > 0;

      return (
        <div className="assignment-student-result-toolbar">
          <div
            className={`assignment-points-wrap ${hasPoints ? "active" : ""}`}
            style={{
              color: "#EEE",
              width: "25px",
              height: "25px",
              lineHeight: "20px",
              borderRadius: "25px",
              border: "solid 3px #EEE",
              textAlign: "center",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            <div
              className="assignment-points-label"
              style={{
                color: "inherit",
                fontSize: "0.6rem",
                fontWeight: 700,
              }}
            >
              {points || 0}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="assignment-student-result-toolbar">
          <div
            className={`assignment-score-wrap score-${student.getScore()}`}
            style={{
              color: "#EEE",
              width: "25px",
              height: "25px",
              lineHeight: "20px",
              borderRadius: "25px",
              border: "solid 3px #EEE",
              textAlign: "center",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            <div
              className="assignment-score-label"
              style={{
                color: "inherit",
                fontSize: "0.6rem",
                fontWeight: 700,
              }}
            >
              {student.getScore() || 0}
            </div>
          </div>
        </div>
      );
    }
  };

  // Render credibility
  const renderCredibility = () => {
    if (assignment.isProctoringEnabled()) {
      let credibilityClass = "";
      let backgroundColor = "#EEE";

      if (student.credibility === -1) {
        credibilityClass = "credibility-empty";
        backgroundColor = "#EEE";
      } else if (student.credibility >= 0 && student.credibility <= 10) {
        credibilityClass = "credibility-5";
        backgroundColor = "#d14141";
      } else if (student.credibility > 10 && student.credibility <= 30) {
        credibilityClass = "credibility-4";
        backgroundColor = "#d17d41";
      } else if (student.credibility > 30 && student.credibility <= 60) {
        credibilityClass = "credibility-3";
        backgroundColor = "#ebcf34";
      } else if (student.credibility > 60 && student.credibility <= 70) {
        credibilityClass = "credibility-2";
        backgroundColor = "#e7f04a";
      } else if (student.credibility > 70) {
        credibilityClass = "credibility-1";
        backgroundColor = "#bfe05c";
      }

      return (
        <div className="assignment-student-result-toolbar">
          <div
            className={`assignment-credibility-wrap ${credibilityClass}`}
            style={{
              color: "#FFF",
              width: "25px",
              height: "25px",
              lineHeight: "27px",
              borderRadius: "25px",
              backgroundColor: backgroundColor,
              textAlign: "center",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            <div
              className="assignment-credibility-label"
              style={{
                color: "inherit",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              {student.credibility === -1 ? "?" : student.credibility}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center space-x-4">
      {renderStudentResults()}
      {renderPoints()}
      {renderCredibility()}
    </div>
  );
};

export default StudentResultToolbar;
