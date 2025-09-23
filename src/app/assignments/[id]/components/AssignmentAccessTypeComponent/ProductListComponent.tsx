// components/Oqylyq/ProductListComponent.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, CreditCard, Package } from "lucide-react";

interface ProductModel {
  id: number;
  name: string;
  image?: string;
  price?: number;
  currency?: string;
  quantity?: number;
  formatted_price?: string;
}

interface ProductListComponentProps {
  entity: ProductModel;
  onClick?: () => void;
}

const ProductListComponent: React.FC<ProductListComponentProps> = ({
  entity,
  onClick,
}) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {entity.image ? (
            <img
              src={entity.image}
              alt={entity.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="font-medium">{entity.name}</h3>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                <span>
                  {entity.formatted_price ||
                    `${entity.price} ${entity.currency}`}
                </span>
              </div>
              {entity.quantity !== undefined && (
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>Осталось: {entity.quantity}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end justify-between">
            <Button variant="outline" size="sm">
              Редактировать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductListComponent;
