// components/modals/ModalFooter.tsx
import BgdButton from "@/components/Chunks/BgdButton";
import React from "react";

interface ModalFooterProps {
  allowImport: boolean;
  t: (key: string) => string;
  onStartImport: () => void;
  onCancel: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  allowImport,
  t,
  onStartImport,
  onCancel,
}) => {
  return (
    <div className="flex justify-between items-center border-t border-gray-200">
      <div>
        <BgdButton
          color="green"
          size="medium"
          disabled={!allowImport}
          onClick={onStartImport}
        >
          {t("btn-start-import")}
        </BgdButton>
      </div>
      <div>
        <BgdButton color="red" size="medium" onClick={onCancel}>
          {t("btn-cancel")}
        </BgdButton>
      </div>
    </div>
  );
};

export default ModalFooter;
