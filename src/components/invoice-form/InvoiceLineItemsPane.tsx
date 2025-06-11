
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceFormData } from '@/hooks/useInvoiceForm';

interface InvoiceLineItemsPaneProps {
  formData: InvoiceFormData;
  addLineItem: () => void;
  updateLineItem: (id: string, updates: Partial<InvoiceFormData['lineItems'][0]>) => void;
  removeLineItem: (id: string) => void;
}

const InvoiceLineItemsPane: React.FC<InvoiceLineItemsPaneProps> = ({
  formData,
  addLineItem,
  updateLineItem,
  removeLineItem
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button
            onClick={addLineItem}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            Add Line Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.lineItems.map((item, index) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Line Item {index + 1}</h4>
                {formData.lineItems.length > 1 && (
                  <Button
                    onClick={() => removeLineItem(item.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor={`description-${item.id}`}>Description</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                    placeholder="Enter item description"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="0"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`unitPrice-${item.id}`}>Unit Price</Label>
                  <Input
                    id={`unitPrice-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`taxRate-${item.id}`}>Tax Rate (%)</Label>
                  <Input
                    id={`taxRate-${item.id}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={item.taxRate}
                    onChange={(e) => updateLineItem(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label>Line Total</Label>
                  <Input
                    value={item.lineTotal.toFixed(2)}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceLineItemsPane;
