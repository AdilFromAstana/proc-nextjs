// components/QuizHeaderActions.tsx
import React from "react";

interface HeaderAction {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: any;
  className?: string;
}

interface HeaderActionsProps {
  actions: HeaderAction[];
}

export const HeaderAction: React.FC<{ action: HeaderAction }> = ({
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

export const HeaderActions: React.FC<HeaderActionsProps> = ({ actions }) => {
  return (
    <div className="flex items-center space-x-4">
      {actions.map((action, index) => (
        <HeaderAction key={index} action={action} />
      ))}
    </div>
  );
};
