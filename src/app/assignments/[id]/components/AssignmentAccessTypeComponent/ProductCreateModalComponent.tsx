// components/Product/CreateModalComponent.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadImageComponent } from "@/components/Chunks/UploadImageComponent"; // TODO: Реализовать или заменить
import { useToast } from "@/hooks/use-toast";

// Интерфейсы для типов данных
interface BaseModel {
  id?: number;
  name?: string;
  getName?: () => string;
}

interface ProductModel {
  id?: number;
  image?: string;
  shipment_type?: string;
  payment_type?: string;
  name?: string;
  description?: string;
  currency_id?: number;
  price?: number;
  quantity?: number;
  type?: string;
  formatted_price?: string;
  created_at?: string;
  updated_at?: string;
}

interface CurrencyModel {
  id: number;
  name: string;
  currency: string;
  symbol: string;
}

interface ShipmentType {
  id: string;
  name: string;
  raw: string;
}

interface PaymentType {
  id: string;
  name: string;
  raw: string;
}

// Props интерфейсы
interface ProductCreateModalComponentProps {
  id?: number;
  type?: string;
  entity?: ProductModel;
  relation?: BaseModel;
  params?: Record<string, any>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (entity: ProductModel) => void;
  onCancelled: () => void;
}

const ProductCreateModalComponent: React.FC<
  ProductCreateModalComponentProps
> = ({
  id = null,
  type = null,
  entity: initialEntity = {
    image: "",
    shipment_type: "",
    payment_type: "",
    name: "",
    description: "",
    currency_id: undefined,
    price: undefined,
    quantity: undefined,
    type: type,
  },
  relation = null,
  params = {},
  open,
  onOpenChange,
  onSaved,
  onCancelled,
}) => {
  // State
  const [entity, setEntity] = useState<ProductModel>(initialEntity);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<CurrencyModel | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyModel[]>([]);
  const [shipmentTypes, setShipmentTypes] = useState<ShipmentType[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const { toast } = useToast();
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  // Mock data - заменить на реальные API вызовы
  const mockCurrencies: CurrencyModel[] = [
    { id: 1, name: "Тенге", currency: "KZT", symbol: "₸" },
    { id: 2, name: "Доллар США", currency: "USD", symbol: "$" },
    { id: 3, name: "Евро", currency: "EUR", symbol: "€" },
  ];

  const mockShipmentTypes: ShipmentType[] = [
    { id: "cyfral", name: "Цифровой продукт", raw: "cyfral" },
    { id: "physical", name: "Физический продукт", raw: "physical" },
  ];

  const mockPaymentTypes: PaymentType[] = [
    { id: "one_time", name: "Единоразовая оплата", raw: "one_time" },
    { id: "subscription", name: "Подписка", raw: "subscription" },
  ];

  // Computed values
  const getHintForShipmentType = (type: string | undefined) => {
    switch (type) {
      case "cyfral":
        return "Цифровой продукт будет доступен сразу после оплаты";
      case "physical":
        return "Физический продукт будет доставлен по указанному адресу";
      default:
        return null;
    }
  };

  const getHintForPaymentType = (type: string | undefined) => {
    switch (type) {
      case "one_time":
        return "Пользователь оплачивает продукт один раз";
      case "subscription":
        return "Пользователь оплачивает подписку на регулярной основе";
      default:
        return null;
    }
  };

  // Methods
  const fetchCurrencies = async () => {
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await fetchCurrencies();
      setCurrencies(mockCurrencies);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const fetchShipmentTypes = async () => {
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await fetchShipmentTypes();
      setShipmentTypes(mockShipmentTypes);
    } catch (error) {
      console.error("Error fetching shipment types:", error);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await fetchPaymentTypes();
      setPaymentTypes(mockPaymentTypes);
    } catch (error) {
      console.error("Error fetching payment types:", error);
    }
  };

  const fetchProduct = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await fetchProduct(id, params);
      // setEntity(response.data);

      // Mock data для демонстрации
      const mockProduct: ProductModel = {
        id,
        image: "https://placehold.co/300x200/3b82f6/FFFFFF?text=Product",
        shipment_type: "cyfral",
        payment_type: "one_time",
        name: "Пример продукта",
        description: "Описание примера продукта",
        currency_id: 1,
        price: 999,
        quantity: 100,
        type: type,
      };

      setEntity(mockProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные продукта",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const save = async () => {
    setIsLoading(true);
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await saveProduct(entity, params);
      // setEntity(response.data);
      // onSaved(response.data);

      // Mock save для демонстрации
      const savedEntity = { ...entity, id: entity.id || Date.now() };
      setEntity(savedEntity);
      onSaved(savedEntity);

      toast({
        title: "Сохранено",
        description: "Продукт успешно сохранен",
      });
    } catch (error: any) {
      console.error("Error saving product:", error);
      setErrors(error.response?.data?.errors || {});

      toast({
        title: "Ошибка",
        description: "Не удалось сохранить продукт",
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
    fetchCurrencies();
    fetchShipmentTypes();
    fetchPaymentTypes();
  }, []);

  useEffect(() => {
    if (id) {
      setEntity({ ...entity, id });
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (entity && entity.id) {
      fetchProduct();
    }
  }, [entity]);

  useEffect(() => {
    if (relation && (relation.name || relation.getName)) {
      const name = relation.getName ? relation.getName() : relation.name;
      setEntity({ ...entity, name: name || "" });
    }
  }, [relation]);

  useEffect(() => {
    if (entity.currency_id) {
      const foundCurrency = currencies.find((c) => c.id === entity.currency_id);
      setCurrency(foundCurrency || null);
    }
  }, [entity.currency_id, currencies]);

  useEffect(() => {
    if (type && entity) {
      setEntity({ ...entity, type });
    }
  }, [type]);

  // Render
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {entity.id ? "Редактировать" : "Создать"} продукт
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* IMAGE */}
          <div className="space-y-2">
            <Label>Изображение продукта</Label>
            {/* TODO: Заменить на реальный UploadImageComponent */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {entity.image ? (
                <img
                  src={entity.image}
                  alt="Product"
                  className="mx-auto max-h-40 rounded-lg"
                />
              ) : (
                <div className="text-gray-500">
                  Загрузите изображение продукта
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  // TODO: Реализовать загрузку изображения
                  setEntity({
                    ...entity,
                    image:
                      "https://placehold.co/300x200/3b82f6/FFFFFF?text=Uploaded",
                  });
                }}
              >
                Выбрать изображение
              </Button>
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image[0]}</p>
            )}
          </div>

          {/* PRODUCT SHIPMENT TYPE */}
          {shipmentTypes.length > 0 && (
            <div className="space-y-2">
              <Label>Тип доставки</Label>
              <div className="flex flex-wrap gap-2">
                {shipmentTypes.map((type) => (
                  <Button
                    key={type.id}
                    type="button"
                    variant={
                      entity.shipment_type === type.raw ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setEntity({ ...entity, shipment_type: type.raw })
                    }
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
              {entity.shipment_type && (
                <p className="text-sm text-gray-500">
                  {getHintForShipmentType(entity.shipment_type)}
                </p>
              )}
              {errors.shipment_type && (
                <p className="text-sm text-red-500">
                  {errors.shipment_type[0]}
                </p>
              )}
            </div>
          )}

          {/* PRODUCT PAYMENT TYPE */}
          {paymentTypes.length > 0 && entity.shipment_type === "cyfral" && (
            <div className="space-y-2">
              <Label>Тип оплаты</Label>
              <div className="flex flex-wrap gap-2">
                {paymentTypes.map((type) => (
                  <Button
                    key={type.id}
                    type="button"
                    variant={
                      entity.payment_type === type.raw ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setEntity({ ...entity, payment_type: type.raw })
                    }
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
              {entity.payment_type && (
                <p className="text-sm text-gray-500">
                  {getHintForPaymentType(entity.payment_type)}
                </p>
              )}
              {errors.payment_type && (
                <p className="text-sm text-red-500">{errors.payment_type[0]}</p>
              )}
            </div>
          )}

          {/* PRODUCT NAME */}
          <div className="space-y-2">
            <Label htmlFor="product-name">Название продукта</Label>
            <Input
              id="product-name"
              value={entity.name || ""}
              onChange={(e) => setEntity({ ...entity, name: e.target.value })}
              placeholder="Введите название продукта"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name[0]}</p>
            )}
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="product-description">Описание продукта</Label>
            <Textarea
              id="product-description"
              value={entity.description || ""}
              onChange={(e) =>
                setEntity({ ...entity, description: e.target.value })
              }
              placeholder="Введите описание продукта"
              maxLength={191}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description[0]}</p>
            )}
          </div>

          {/* PRODUCT CURRENCY */}
          <div className="space-y-2">
            <Label>Валюта</Label>
            <Select
              value={entity.currency_id?.toString() || ""}
              onValueChange={(value) =>
                setEntity({ ...entity, currency_id: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id.toString()}>
                    {currency.name} ({currency.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currency_id && (
              <p className="text-sm text-red-500">{errors.currency_id[0]}</p>
            )}
          </div>

          {/* PRODUCT PRICE */}
          {currency && (
            <div className="space-y-2">
              <Label htmlFor="product-price">Цена</Label>
              <div className="relative">
                <Input
                  id="product-price"
                  type="number"
                  value={entity.price || ""}
                  onChange={(e) =>
                    setEntity({
                      ...entity,
                      price: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder={`Введите цену в ${currency.currency}`}
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  {currency.symbol}
                </div>
              </div>
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price[0]}</p>
              )}
            </div>
          )}

          {/* PRODUCT QUANTITY */}
          <div className="space-y-2">
            <Label htmlFor="product-quantity">Количество</Label>
            <Input
              id="product-quantity"
              type="number"
              value={entity.quantity || ""}
              onChange={(e) =>
                setEntity({
                  ...entity,
                  quantity: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="Введите количество доступных единиц"
              min="0"
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity[0]}</p>
            )}
          </div>

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

export default ProductCreateModalComponent;
