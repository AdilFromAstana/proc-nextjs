// components/QuizHeaderActions.tsx
import React from "react";

interface HeaderAction {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
  className?: string;
}

interface QuizHeaderActionsProps {
  actions: HeaderAction[];
}

export const QuizHeaderAction: React.FC<{ action: HeaderAction }> = ({
  action,
}) => {
  const IconComponent = action.icon;

  return (
    <button
      className={`flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
        action.className || ""
      }`}
      onClick={action.onClick}
    >
      <IconComponent height={20} />
      <span>{action.label}</span>
    </button>
  );
};

export const QuizHeaderActions: React.FC<QuizHeaderActionsProps> = ({
  actions,
}) => {
  return (
    <div className="flex items-center space-x-4">
      {actions.map((action, index) => (
        <QuizHeaderAction key={index} action={action} />
      ))}
    </div>
  );
};
