import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Props интерфейсы
interface ConfirmModalProps {
  title?: string;
  description?: string;
  position?: "top" | "center" | "bottom";
  preventActions?: boolean;
  confirmButtonVisible?: boolean;
  discardButtonVisible?: boolean;
  confirmButtonText?: string;
  discardButtonText?: string;
  className?: string;
}

const ConfirmModalComponent: React.FC<ConfirmModalProps> = ({
  title = "Подтверждение", // TODO: заменить на $t('label-confirm-modal-title')
  description = "Вы уверены?", // TODO: заменить на $t('label-confirm-modal-description')
  position = "center", // shadcn/ui использует center по умолчанию
  preventActions = false,
  confirmButtonVisible = true,
  discardButtonVisible = true,
  confirmButtonText = "Да", // TODO: заменить на $t('btn-confirm')
  discardButtonText = "Нет", // TODO: заменить на $t('btn-no')
  className,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>(title);
  const [modalText, setModalText] = useState<string>(description);
  const [resolveCallback, setResolveCallback] = useState<
    ((value: boolean) => void) | null
  >(null);

  // Methods
  const open = (descriptionText: string | null = null): Promise<boolean> => {
    if (descriptionText) {
      setModalText(descriptionText);
    }

    return new Promise((resolve) => {
      setIsOpen(true);
      setResolveCallback(() => resolve);
    });
  };

  const close = (): Promise<void> => {
    return new Promise((resolve) => {
      setIsOpen(false);
      resolve();
    });
  };

  const confirm = () => {
    if (preventActions) {
      // TODO: реализовать emit событий
      console.log("confirmed");
      return;
    }

    close().then(() => {
      if (resolveCallback) {
        resolveCallback(true);
      }
    });
  };

  const cancel = () => {
    if (preventActions) {
      // TODO: реализовать emit событий
      console.log("declined");
      return;
    }

    close().then(() => {
      if (resolveCallback) {
        resolveCallback(false);
      }
    });
  };

  // Render
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        <DialogHeader>
          {modalTitle && <DialogTitle>{modalTitle}</DialogTitle>}
          {modalText && <DialogDescription>{modalText}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          {confirmButtonVisible && (
            <Button variant="default" onClick={confirm}>
              {confirmButtonText}
            </Button>
          )}

          {discardButtonVisible && (
            <DialogClose asChild>
              <Button variant="outline" onClick={cancel}>
                {discardButtonText}
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Экспортируем методы для внешнего использования
export interface ConfirmModalRef {
  open: (description?: string | null) => Promise<boolean>;
  close: () => Promise<void>;
}

export default ConfirmModalComponent;
