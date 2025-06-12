
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

interface ShipmentDetailsPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ShipmentDetailsPane: React.FC<ShipmentDetailsPaneProps> = ({
  formData,
  updateField
}) => {
  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <div className="space-y-6 pr-4">
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description of Goods */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Description of Goods <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.descriptionOfGoods}
                onChange={(e) => updateField('descriptionOfGoods', e.target.value)}
                placeholder="Enter detailed description of goods"
                rows={4}
              />
              {formData.popiNumber && (
                <div className="text-xs text-blue-600 mt-1">
                  Auto-populated from {formData.popiType}: {formData.popiNumber}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Port of Loading */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Port of Loading
                </Label>
                <Input
                  value={formData.portOfLoading}
                  onChange={(e) => updateField('portOfLoading', e.target.value)}
                  placeholder="Enter port of loading"
                />
              </div>

              {/* Port of Discharge */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Port of Discharge
                </Label>
                <Input
                  value={formData.portOfDischarge}
                  onChange={(e) => updateField('portOfDischarge', e.target.value)}
                  placeholder="Enter port of discharge"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latest Shipment Date */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Latest Shipment Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.latestShipmentDate}
                  onChange={(e) => updateField('latestShipmentDate', e.target.value)}
                />
              </div>

              {/* Presentation Period */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Presentation Period
                </Label>
                <Input
                  value={formData.presentationPeriod}
                  onChange={(e) => updateField('presentationPeriod', e.target.value)}
                  placeholder="e.g., 21 days after shipment date"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default ShipmentDetailsPane;
