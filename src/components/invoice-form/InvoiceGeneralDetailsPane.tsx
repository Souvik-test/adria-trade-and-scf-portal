
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceFormData } from '@/hooks/useInvoiceForm';
import { Search } from 'lucide-react';

interface InvoiceGeneralDetailsPaneProps {
  formData: InvoiceFormData;
  updateField: (field: keyof InvoiceFormData, value: any) => void;
  searchPurchaseOrder: (poNumber: string) => void;
}

const InvoiceGeneralDetailsPane: React.FC<InvoiceGeneralDetailsPaneProps> = ({
  formData,
  updateField,
  searchPurchaseOrder
}) => {
  const handlePOSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    searchPurchaseOrder(value);
  };

  return (
    <div className="space-y-6">
      {/* Purchase Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
              <div className="relative">
                <Input
                  id="purchaseOrderNumber"
                  value={formData.purchaseOrderNumber}
                  onChange={handlePOSearch}
                  placeholder="Search purchase order number"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="purchaseOrderCurrency">Purchase Order Currency</Label>
              <Input
                id="purchaseOrderCurrency"
                value={formData.purchaseOrderCurrency}
                placeholder="Auto-populated"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
            
            <div>
              <Label htmlFor="purchaseOrderAmount">Purchase Order Amount</Label>
              <Input
                id="purchaseOrderAmount"
                value={formData.purchaseOrderAmount || ''}
                placeholder="Auto-populated"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
            
            <div>
              <Label htmlFor="purchaseOrderDate">Purchase Order Date</Label>
              <Input
                id="purchaseOrderDate"
                type="date"
                value={formData.purchaseOrderDate}
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Information */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                placeholder="Enter invoice number"
              />
            </div>
            
            <div>
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          
          <div>
            <Label htmlFor="customerAddress">Customer Address</Label>
            <Textarea
              id="customerAddress"
              value={formData.customerAddress}
              onChange={(e) => updateField('customerAddress', e.target.value)}
              placeholder="Enter customer address"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="customerContact">Customer Contact</Label>
            <Input
              id="customerContact"
              value={formData.customerContact}
              onChange={(e) => updateField('customerContact', e.target.value)}
              placeholder="Enter contact details"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Textarea
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => updateField('paymentTerms', e.target.value)}
              placeholder="Enter payment terms"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGeneralDetailsPane;
