// components/Oqylyq/InviteCode/ListComponent.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Calendar, Users } from "lucide-react";

interface InviteCodeModel {
  id: number;
  code: string;
  expired_at?: string;
  limits?: number;
  used_count?: number;
  is_revoked?: boolean;
}

interface InviteCodeListComponentProps {
  entity: InviteCodeModel;
  onClick?: () => void;
}

const InviteCodeListComponent: React.FC<InviteCodeListComponentProps> = ({
  entity,
  onClick,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Без срока";
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const getStatus = () => {
    if (entity.is_revoked) return "Отозван";
    if (
      entity.limits &&
      entity.used_count &&
      entity.used_count >= entity.limits
    ) {
      return "Исчерпан";
    }
    return "Активен";
  };

  const getStatusColor = () => {
    if (entity.is_revoked) return "text-red-600";
    if (
      entity.limits &&
      entity.used_count &&
      entity.used_count >= entity.limits
    ) {
      return "text-yellow-600";
    }
    return "text-green-600";
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Код: {entity.code}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(entity.expired_at)}</span>
              </div>
              {entity.limits && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {entity.used_count || 0} / {entity.limits}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatus()}
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              Редактировать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCodeListComponent;
