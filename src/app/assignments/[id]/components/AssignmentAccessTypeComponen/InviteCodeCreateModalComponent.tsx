// components/InviteCode/CreateModalComponent.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Copy, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Интерфейсы для типов данных
interface InviteCodeModel {
  id?: number;
  code?: string;
  expired_at?: string;
  limits?: number;
  is_revoked?: boolean;
  type?: string;
  recipients?: RecipientModel[];
}

interface RecipientModel {
  id?: number;
  name?: string;
  type: "email" | "phone";
  recipient?: string;
}

interface BaseModel {
  id?: number;
}

// Props интерфейсы
interface InviteCodeCreateModalComponentProps {
  id?: number;
  type?: string;
  entity?: InviteCodeModel;
  relation?: BaseModel;
  params?: Record<string, any>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (entity: InviteCodeModel) => void;
  onCancelled: () => void;
}

const InviteCodeCreateModalComponent: React.FC<
  InviteCodeCreateModalComponentProps
> = ({
  id = null,
  type = "register",
  entity: initialEntity = {
    code: "",
    expired_at: "",
    limits: undefined,
    is_revoked: false,
    type: type,
    recipients: [],
  },
  relation = null,
  params = { extended: true },
  open,
  onOpenChange,
  onSaved,
  onCancelled,
}) => {
  // State
  const [entity, setEntity] = useState<InviteCodeModel>(initialEntity);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  // Recipient types
  const recipientTypes = [
    { id: "email", label: "Email" },
    { id: "phone", label: "Телефон" },
  ];

  // Computed values
  const expiredAtDate = new Date().toISOString().split("T")[0];

  // Methods
  const generateInviteCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEntity({ ...entity, code });
  };

  const copyInviteCode = () => {
    if (entity.code) {
      navigator.clipboard.writeText(entity.code);
      toast({
        title: "Код скопирован",
        description: "Пригласительный код скопирован в буфер обмена",
      });
    }
  };

  const addRecipient = () => {
    const newRecipients = [
      ...(entity.recipients || []),
      { type: "email", recipient: "" } as RecipientModel,
    ];
    setEntity({ ...entity, recipients: newRecipients });
  };

  const removeRecipient = (index: number) => {
    const newRecipients = [...(entity.recipients || [])];
    newRecipients.splice(index, 1);
    setEntity({ ...entity, recipients: newRecipients });
  };

  const updateRecipient = (index: number, field: string, value: any) => {
    const newRecipients = [...(entity.recipients || [])];
    (newRecipients[index] as any)[field] = value;
    setEntity({ ...entity, recipients: newRecipients });
  };

  const fetchEntity = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await fetchInviteCode(id, params);
      // setEntity(response.data);

      // Mock data для демонстрации
      const mockEntity: InviteCodeModel = {
        id,
        code: "ABC123XYZ",
        expired_at: "2024-12-31T23:59:59Z",
        limits: 100,
        is_revoked: false,
        type: type,
        recipients: [
          {
            id: 1,
            name: "Иван Иванов",
            type: "email",
            recipient: "ivan@example.com",
          },
          {
            id: 2,
            name: "Мария Петрова",
            type: "phone",
            recipient: "+77001234567",
          },
        ],
      };

      setEntity(mockEntity);

      if (!mockEntity.code) {
        generateInviteCode();
      }
    } catch (error) {
      console.error("Error fetching invite code:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные пригласительного кода",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const save = async () => {
    setIsLoading(true);
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await saveInviteCode(entity, params);
      // setEntity(response.data);
      // onSaved(response.data);

      // Mock save для демонстрации
      const savedEntity = { ...entity, id: entity.id || Date.now() };
      setEntity(savedEntity);
      onSaved(savedEntity);

      toast({
        title: "Сохранено",
        description: "Пригласительный код успешно сохранен",
      });
    } catch (error: any) {
      console.error("Error saving invite code:", error);
      setErrors(error.response?.data?.errors || {});

      toast({
        title: "Ошибка",
        description: "Не удалось сохранить пригласительный код",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancel = () => {
    onCancelled();
  };

  // Effects
  useEffect(() => {
    if (id) {
      setEntity({ ...entity, id });
      fetchEntity();
    }
  }, [id]);

  useEffect(() => {
    if (entity && !entity.id) {
      setEntity({ ...entity, expired_at: expiredAtDate });
    }
  }, [expiredAtDate]);

  useEffect(() => {
    if (open && !entity.code) {
      generateInviteCode();
    }
  }, [open]);

  // Render
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {entity.id ? "Редактировать" : "Создать"} пригласительный код
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* INVITE CODE */}
          <div className="space-y-2">
            <Label htmlFor="invite-code">Код приглашения</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="invite-code"
                  value={entity.code || ""}
                  onChange={(e) =>
                    setEntity({ ...entity, code: e.target.value })
                  }
                  placeholder="Введите код приглашения"
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={generateInviteCode}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  {entity.code && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={copyInviteCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code[0]}</p>
            )}
            <p className="text-sm text-gray-500">
              Уникальный код, который пользователи будут использовать для
              доступа
            </p>
          </div>

          {/* EXPIRED AT */}
          <div className="space-y-2">
            <Label>Дата истечения</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="date"
                  value={entity.expired_at?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEntity({
                      ...entity,
                      expired_at: e.target.value
                        ? `${e.target.value}T00:00:00Z`
                        : "",
                    })
                  }
                  placeholder="Выберите дату"
                />
              </div>
              <div>
                <Input
                  type="time"
                  value={
                    entity.expired_at
                      ? entity.expired_at.split("T")[1]?.substring(0, 5) || ""
                      : ""
                  }
                  onChange={(e) => {
                    if (entity.expired_at) {
                      const datePart = entity.expired_at.split("T")[0];
                      setEntity({
                        ...entity,
                        expired_at: `${datePart}T${e.target.value}:00Z`,
                      });
                    }
                  }}
                  placeholder="Выберите время"
                />
              </div>
            </div>
            {errors.expired_at && (
              <p className="text-sm text-red-500">{errors.expired_at[0]}</p>
            )}
            <p className="text-sm text-gray-500">
              Дата и время, после которых код перестанет действовать
            </p>
          </div>

          {/* RECIPIENTS */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Получатели</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRecipient}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </div>

            {entity.recipients && entity.recipients.length > 0 && (
              <div className="space-y-3">
                {entity.recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 border rounded-lg"
                  >
                    <div className="md:col-span-3">
                      <Input
                        value={recipient.name || ""}
                        onChange={(e) =>
                          updateRecipient(index, "name", e.target.value)
                        }
                        placeholder="Имя получателя"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Select
                        value={recipient.type}
                        onValueChange={(value: "email" | "phone") =>
                          updateRecipient(index, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Тип" />
                        </SelectTrigger>
                        <SelectContent>
                          {recipientTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-5">
                      <Input
                        value={recipient.recipient || ""}
                        onChange={(e) =>
                          updateRecipient(index, "recipient", e.target.value)
                        }
                        placeholder={
                          recipient.type === "email"
                            ? "email@example.com"
                            : "+7 (700) 123-45-67"
                        }
                        type={recipient.type === "email" ? "email" : "tel"}
                      />
                    </div>
                    <div className="md:col-span-1 flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeRecipient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500">
              Список людей, которым будет отправлен пригласительный код
            </p>
          </div>

          {/* LIMITS USAGE */}
          <div className="space-y-2">
            <Label htmlFor="limits">Лимит использования</Label>
            <Input
              id="limits"
              type="number"
              value={entity.limits || ""}
              onChange={(e) =>
                setEntity({
                  ...entity,
                  limits: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="Введите лимит использования"
            />
            {errors.limits && (
              <p className="text-sm text-red-500">{errors.limits[0]}</p>
            )}
            <p className="text-sm text-gray-500">
              Максимальное количество использований кода (оставьте пустым для
              неограниченного)
            </p>
          </div>

          {/* IS REVOKED */}
          {entity.id && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="is-revoked">Отозвать код</Label>
                <Switch
                  id="is-revoked"
                  checked={entity.is_revoked || false}
                  onCheckedChange={(checked) =>
                    setEntity({ ...entity, is_revoked: checked })
                  }
                />
              </div>
              {errors.is_revoked && (
                <p className="text-sm text-red-500">{errors.is_revoked[0]}</p>
              )}
              <p className="text-sm text-gray-500">
                Отзыв кода запретит его дальнейшее использование
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-between pt-4">
            <Button
              ref={saveBtnRef}
              onClick={save}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
            <Button
              variant="outline"
              onClick={cancel}
              disabled={isLoading}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteCodeCreateModalComponent;
