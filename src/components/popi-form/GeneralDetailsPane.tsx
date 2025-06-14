
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { POPIFormData } from '@/hooks/usePOPIForm';

interface GeneralDetailsPaneProps {
  formData: POPIFormData;
  updateField: (field: keyof POPIFormData, value: any) => void;
  initializeForm?: (type: 'purchase-order' | 'proforma-invoice') => void;
}

const GeneralDetailsPane: React.FC<GeneralDetailsPaneProps> = ({
  formData,
  updateField,
  initializeForm
}) => {
  const isPO = formData.instrumentType === 'purchase-order';

  // Handle main type change
  const handleInstrumentTypeChange = (value: 'purchase-order' | 'proforma-invoice') => {
    // Update the field and trigger init for the correct form prepopulation.
    updateField('instrumentType', value);
    if (initializeForm) {
      initializeForm(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* INSTRUMENT TYPE SELECTION CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-700 dark:text-corporate-teal-300">
            Select Document Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="instrumentType">Document Type *</Label>
            <Select
              value={formData.instrumentType}
              onValueChange={(value: any) =>
                handleInstrumentTypeChange(value as 'purchase-order' | 'proforma-invoice')
              }
            >
              <SelectTrigger className="mt-1" id="instrumentType">
                <SelectValue placeholder="Select Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase-order">Purchase Order</SelectItem>
                <SelectItem value="proforma-invoice">Pro-forma Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* INFO FORM CARDS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            {isPO ? 'Purchase Order Information' : 'Pro-forma Invoice Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={isPO ? "poNumber" : "piNumber"}>
                {isPO ? 'PO Number *' : 'PI Number *'}
              </Label>
              <Input
                id={isPO ? "poNumber" : "piNumber"}
                value={isPO ? formData.poNumber || '' : formData.piNumber || ''}
                onChange={(e) => updateField(isPO ? 'poNumber' : 'piNumber', e.target.value)}
                placeholder={isPO ? 'Auto-generated' : 'Auto-generated'}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor={isPO ? "poDate" : "piDate"}>
                {isPO ? 'PO Date *' : 'PI Date *'}
              </Label>
              <Input
                id={isPO ? "poDate" : "piDate"}
                type="date"
                value={isPO ? formData.poDate || '' : formData.piDate || ''}
                onChange={(e) => updateField(isPO ? 'poDate' : 'piDate', e.target.value)}
                className="mt-1"
              />
            </div>

            {!isPO && (
              <div>
                <Label htmlFor="validUntilDate">Valid Until Date *</Label>
                <Input
                  id="validUntilDate"
                  type="date"
                  value={formData.validUntilDate || ''}
                  onChange={(e) => updateField('validUntilDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {isPO ? (
              <div>
                <Label htmlFor="vendorSupplier">Vendor/Supplier *</Label>
                <Input
                  id="vendorSupplier"
                  value={formData.vendorSupplier || ''}
                  onChange={(e) => updateField('vendorSupplier', e.target.value)}
                  placeholder="Search vendor/supplier..."
                  className="mt-1"
                />
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="buyerName">Buyer Name *</Label>
                  <Input
                    id="buyerName"
                    value={formData.buyerName || ''}
                    onChange={(e) => updateField('buyerName', e.target.value)}
                    placeholder="Search buyer..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="buyerId">Buyer ID</Label>
                  <Input
                    id="buyerId"
                    value={formData.buyerId || ''}
                    onChange={(e) => updateField('buyerId', e.target.value)}
                    placeholder="Buyer identification number"
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {isPO && (
              <div>
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                <Input
                  id="expectedDeliveryDate"
                  type="date"
                  value={formData.expectedDeliveryDate || ''}
                  onChange={(e) => updateField('expectedDeliveryDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency || ''}
                onValueChange={(value) => updateField('currency', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentTerms">Payment Terms *</Label>
              <Select
                value={formData.paymentTerms || ''}
                onValueChange={(value) => updateField('paymentTerms', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net30">Net 30 days</SelectItem>
                  <SelectItem value="net60">Net 60 days</SelectItem>
                  <SelectItem value="advance">Advance Payment</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="lc">Letter of Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!isPO && (
              <div>
                <Label htmlFor="termsOfSale">Terms of Sale</Label>
                <Select
                  value={formData.termsOfSale || ''}
                  onValueChange={(value) => updateField('termsOfSale', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select terms of sale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fob">FOB - Free on Board</SelectItem>
                    <SelectItem value="cif">CIF - Cost, Insurance & Freight</SelectItem>
                    <SelectItem value="exw">EXW - Ex Works</SelectItem>
                    <SelectItem value="ddp">DDP - Delivered Duty Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shippingAddress">Shipping Address *</Label>
            <textarea
              id="shippingAddress"
              value={formData.shippingAddress || ''}
              onChange={(e) => updateField('shippingAddress', e.target.value)}
              placeholder="Enter complete shipping address"
              className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsShipping"
              checked={formData.sameAsShipping}
              onCheckedChange={(checked) => {
                updateField('sameAsShipping', checked);
                if (checked) {
                  updateField('billingAddress', formData.shippingAddress);
                }
              }}
            />
            <Label htmlFor="sameAsShipping">
              Billing address same as shipping address
            </Label>
          </div>

          <div>
            <Label htmlFor="billingAddress">Billing Address *</Label>
            <textarea
              id="billingAddress"
              value={formData.billingAddress || ''}
              onChange={(e) => updateField('billingAddress', e.target.value)}
              placeholder="Enter complete billing address"
              disabled={formData.sameAsShipping}
              className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralDetailsPane;

