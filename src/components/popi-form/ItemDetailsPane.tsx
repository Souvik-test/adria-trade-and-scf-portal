
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { POPIFormData } from '@/hooks/usePOPIForm';

interface ItemDetailsPaneProps {
  formData: POPIFormData;
  addItem: () => void;
  updateItem: (id: string, updates: Partial<POPIFormData['items'][0]>) => void;
  removeItem: (id: string) => void;
}

const ItemDetailsPane: React.FC<ItemDetailsPaneProps> = ({
  formData,
  addItem,
  updateItem,
  removeItem
}) => {
  const isPO = formData.instrumentType === 'purchase-order';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency || 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            {isPO ? 'Purchase Order Items' : 'Pro-forma Invoice Items'}
          </CardTitle>
          <Button
            onClick={addItem}
            className="bg-corporate-teal hover:bg-corporate-teal/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          {formData.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No items added yet. Click "Add Item" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      Item {index + 1}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <Label htmlFor={`description-${item.id}`}>
                        Description *
                      </Label>
                      <Input
                        id={`description-${item.id}`}
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="Enter item description"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`quantity-${item.id}`}>
                        Quantity *
                      </Label>
                      <Input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`unitPrice-${item.id}`}>
                        Unit Price *
                      </Label>
                      <Input
                        id={`unitPrice-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`discount-${item.id}`}>
                        Discount (%)
                      </Label>
                      <Input
                        id={`discount-${item.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`taxRate-${item.id}`}>
                        Tax Rate (%)
                      </Label>
                      <Input
                        id={`taxRate-${item.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.taxRate}
                        onChange={(e) => updateItem(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Line Total</Label>
                      <div className="mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-md text-sm font-medium">
                        {formatCurrency(item.lineTotal)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemDetailsPane;
