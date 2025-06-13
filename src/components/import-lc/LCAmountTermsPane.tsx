
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImportLCFormData } from '@/types/importLC';
import { SWIFT_TAGS } from '@/types/importLC';
import SwiftTagLabel from './SwiftTagLabel';

interface LCAmountTermsPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const LCAmountTermsPane: React.FC<LCAmountTermsPaneProps> = ({
  formData,
  updateField
}) => {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];
  const toleranceOptions = ['0%', '5%', '10%', '15%', '20%'];

  // Helper function to ensure boolean conversion
  const handleBooleanChange = (field: keyof ImportLCFormData, checked: boolean | "indeterminate") => {
    updateField(field, Boolean(checked));
  };

  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <div className="space-y-6 pr-4">
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
              LC Amount & Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LC Amount */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    LC Amount <span className="text-red-500">*</span>
                  </Label>
                  <SwiftTagLabel swiftInfo={SWIFT_TAGS.lcAmount} />
                </div>
                <Input
                  type="number"
                  value={formData.lcAmount || ''}
                  onChange={(e) => updateField('lcAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter LC amount"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Currency */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Currency <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tolerance */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Tolerance
                </Label>
                <Select value={formData.tolerance} onValueChange={(value) => updateField('tolerance', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    {toleranceOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Amount */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Additional Amount
                </Label>
                <Input
                  type="number"
                  value={formData.additionalAmount || ''}
                  onChange={(e) => updateField('additionalAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter additional amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Available With */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available With
                </Label>
                <SwiftTagLabel swiftInfo={SWIFT_TAGS.availableWith} />
              </div>
              <Input
                value={formData.availableWith}
                onChange={(e) => updateField('availableWith', e.target.value)}
                placeholder="Enter bank or institution"
              />
            </div>

            {/* Available By */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Available By
              </Label>
              <Select value={formData.availableBy} onValueChange={(value) => updateField('availableBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sight_payment">Sight Payment</SelectItem>
                  <SelectItem value="deferred_payment">Deferred Payment</SelectItem>
                  <SelectItem value="acceptance">Acceptance</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Shipment Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="partialShipments"
                  checked={formData.partialShipmentsAllowed}
                  onCheckedChange={(checked) => handleBooleanChange('partialShipmentsAllowed', checked)}
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="partialShipments" className="text-sm text-gray-700 dark:text-gray-300">
                    Partial Shipments Allowed
                  </Label>
                  <SwiftTagLabel swiftInfo={SWIFT_TAGS.partialShipmentsAllowed} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transshipment"
                  checked={formData.transshipmentAllowed}
                  onCheckedChange={(checked) => handleBooleanChange('transshipmentAllowed', checked)}
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="transshipment" className="text-sm text-gray-700 dark:text-gray-300">
                    Transshipment Allowed
                  </Label>
                  <SwiftTagLabel swiftInfo={SWIFT_TAGS.transshipmentAllowed} />
                </div>
              </div>
            </div>

            {formData.popiNumber && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> LC amount should not exceed PO/PI amount. Please verify the amount against your selected {formData.popiType}: {formData.popiNumber}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default LCAmountTermsPane;
