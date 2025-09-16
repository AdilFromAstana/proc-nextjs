// components/ResultsSection.tsx
import React from "react";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import QuizResultListComponent from "../QuizResultList";
import SectionWrapper from "../../UI/SectionWrapper";
import ResultChartComponent from "../../UI/ResultChartComponent";

interface ResultsSectionProps {
  assignment: any;
  student: any;
  isOwner: boolean;
  isReviewer: boolean;
  results: any[];
  components: any;
  resultsChart: any[];
  currentAttempt: any;
  disabled: boolean;
  onResultUpdated: (component: any, result: any) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  assignment,
  student,
  isOwner,
  isReviewer,
  results = [],
  components,
  resultsChart,
  currentAttempt,
  disabled,
  onResultUpdated,
}) => {
  const shouldShow =
    results.length > 0 &&
    (isOwner || isReviewer) &&
    (assignment.isLessonType?.() ||
      assignment.isQuizType?.() ||
      assignment.isWebinarType?.());

  return (
    <SectionWrapper
      icon={faTasks}
      iconColor="green"
      title="Результаты"
      hint="Подсказка по результатам"
      showSection={shouldShow}
    >
      {components.length <= 0 ? (
        <div className="empty-result-list text-gray-500 italic">
          Нет результатов
        </div>
      ) : (
        <div className="space-y-6 w-full m-0 p-0">
          <QuizResultListComponent />

          {resultsChart && resultsChart.length > 0 && (
            <div className="quiz-result-chart">
              <ResultChartComponent
                results={{
                  data: resultsChart,
                  length: resultsChart.length,
                  getPoints: () =>
                    resultsChart.reduce(
                      (sum: number, item: any) => sum + (item.points || 0),
                      0
                    ),
                  map: function (callback: (item: any) => void) {
                    this.data.forEach(callback);
                  },
                }}
                points={resultsChart.reduce(
                  (sum: number, item: any) => sum + (item.points || 0),
                  0
                )}
                showPoints={true}
              />
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  );
};

export default ResultsSection;
