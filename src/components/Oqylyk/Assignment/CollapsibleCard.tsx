// components/ui/collapsible-card.tsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode; // Принимаем иконку как ReactNode
  children: React.ReactNode; // Содержимое, которое будет сворачиваться
  defaultCollapsed?: boolean; // Начальное состояние (свернуто/развернуто)
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  description,
  icon,
  children,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <Card className="w-full p-0 gap-0">
      {/* Заголовок с кнопкой сворачивания */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Сворачиваемое содержимое */}
      {!isCollapsed && <div className="p-6 pt-4">{children}</div>}
    </Card>
  );
};

export default CollapsibleCard;
