// components/ModalsContainer.tsx
import React from "react";

interface ModalsContainerProps {
  viewer: string;
  assignment: any;
  student: any;
  currentContext: string;
  disabled: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onResultUpdated: (component: any, result: any) => void;
}

const ModalsContainer: React.FC<ModalsContainerProps> = ({
  viewer,
  assignment,
  student,
  currentContext,
  disabled,
  isOpen,
  onOpenChange,
  onResultUpdated,
}) => {
  return (
    <div>AttemptViewerModalComponent</div>
    // <AttemptViewerModalComponent
    //   viewer={viewer}
    //   assignment={assignment}
    //   student={student}
    //   disabled={disabled}
    //   isOpen={isOpen}
    //   onOpenChange={onOpenChange}
    //   onResultUpdated={onResultUpdated}
    // />
  );
};

export default ModalsContainer;
