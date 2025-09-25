import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, LockOpen } from "lucide-react";
import { AssignmentDetail } from "@/types/assignment/detail";
import InviteCodeCreateModalComponent from "./InviteCodeCreateModalComponent";
import ProductCreateModalComponent from "./ProductCreateModalComponent";
import InviteCodeListComponent from "./InviteCodeListComponent";
import ProductListComponent from "./ProductListComponent";
import { Button } from "@/components/ui/button";
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";

interface AccessTypeOption {
  id: string;
  name: string;
  raw: "free" | "private" | "prepaid";
}

interface AssignmentAccessTypeList {
  models: AccessTypeOption[];
  fetch: () => Promise<void>;
}

interface AssignmentAccessTypeComponentProps {
  assignment: AssignmentDetail;
  errors?: Record<string, string[]>;
  onAssignmentChange: (assignment: AssignmentDetail) => void;
}

const AssignmentAccessTypeComponent: React.FC<
  AssignmentAccessTypeComponentProps
> = ({ assignment, errors = {}, onAssignmentChange }) => {
  // State
  const [accessTypes, setAccessTypes] = useState<AssignmentAccessTypeList>({
    models: [],
    fetch: async () => {
      setAccessTypes({
        models: [
          { id: "free", name: "Открытый", raw: "free" },
          { id: "private", name: "Приватный", raw: "private" },
          { id: "prepaid", name: "По предоплате", raw: "prepaid" },
        ],
        fetch: async () => {},
      });
    },
  });

  const [inviteCodeModalOpen, setInviteCodeModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Новое состояние

  // Computed values
  const hintAvailability = (() => {
    switch (assignment.access_type) {
      case "free":
        return "Любой пользователь может пройти задание без ограничений";
      case "private":
        return "Доступ только по пригласительным кодам";
      case "prepaid":
        return "Доступ после оплаты";
      default:
        return null;
    }
  })();

  const showInviteCodeModal = () => {
    setInviteCodeModalOpen(true);
  };

  const showProductModal = () => {
    setProductModalOpen(true);
  };

  const onInviteCodeSaved = (invite: any) => {
    onAssignmentChange({
      ...assignment,
      invite_code_id: invite.id,
      invite_code: invite,
    });
    setInviteCodeModalOpen(false);
  };

  const onInviteCodeCancelled = () => {
    if (!assignment.invite_code_id) {
      onAssignmentChange({
        ...assignment,
        access_type: "free",
      });
    }
    setInviteCodeModalOpen(false);
  };

  const onProductSaved = (product: any) => {
    onAssignmentChange({
      ...assignment,
      product_id: product.id,
      product: product,
    });
    setProductModalOpen(false);
  };

  const onProductCancelled = () => {
    if (!assignment.product_id) {
      onAssignmentChange({
        ...assignment,
        access_type: "free",
      });
    }
    setProductModalOpen(false);
  };

  const handleAccessTypeChange = (value: "free" | "private" | "prepaid") => {
    const newAssignment = {
      ...assignment,
      access_type: value,
    };

    onAssignmentChange(newAssignment);

    // Автоматическое открытие модальных окон
    if (value === "private" && !assignment.invite_code_id) {
      setTimeout(() => showInviteCodeModal(), 0);
    }

    if (value === "prepaid" && !assignment.product_id) {
      setTimeout(() => showProductModal(), 0);
    }
  };

  // Effects
  useEffect(() => {
    accessTypes.fetch();
  }, []);

  return (
    <CollapsibleCard
      title="Тип доступа к заданию"
      description="Выберите способ доступа пользователей к заданию"
      icon={<LockOpen className="h-5 w-5 text-blue-600" />}
      defaultCollapsed={false} // Можно передать начальное состояние
    >
      {/* Всё содержимое, которое было внутри CardContent, теперь сюда */}

      {/* ACCESS TYPE */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Тип доступа</label>
        <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
          {accessTypes.models.map((option) => (
            <Button
              key={option.id}
              variant={
                assignment.access_type === option.raw ? "default" : "outline"
              }
              className="w-32 h-10 text-sm font-medium rounded-md transition-colors mx-1 first:ml-0 last:mr-0"
              onClick={() => handleAccessTypeChange(option.raw)}
            >
              {option.name}
            </Button>
          ))}
        </div>

        {hintAvailability && (
          <p className="text-sm text-gray-500 mt-1">{hintAvailability}</p>
        )}

        {errors.access_type && (
          <p className="text-sm text-red-500">{errors.access_type[0]}</p>
        )}
      </div>

      {/* INVITE CODE ITEM */}
      {assignment.access_type === "private" &&
        assignment.invite_code_id &&
        assignment.invite_code && (
          <div className="mt-4">
            <InviteCodeListComponent
              entity={assignment.invite_code}
              onClick={showInviteCodeModal}
            />
          </div>
        )}

      {/* PRODUCT ITEM */}
      {assignment.access_type === "prepaid" &&
        assignment.product_id &&
        assignment.product && (
          <div className="mt-4">
            <ProductListComponent
              entity={assignment.product}
              onClick={showProductModal}
            />
          </div>
        )}

      {/* Модальные окна */}
      <InviteCodeCreateModalComponent
        open={inviteCodeModalOpen}
        onOpenChange={setInviteCodeModalOpen}
        type="assignment"
        id={assignment.invite_code_id}
        relation={assignment}
        onCancelled={onInviteCodeCancelled}
        onSaved={onInviteCodeSaved}
      />

      <ProductCreateModalComponent
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        type="assignment"
        id={assignment.product_id}
        relation={assignment}
        onCancelled={onProductCancelled}
        onSaved={onProductSaved}
      />
    </CollapsibleCard>
  );
};

export default AssignmentAccessTypeComponent;
