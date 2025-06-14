
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImportLCFormData, SWIFT_TAGS } from '@/types/importLC';
import SwiftTagLabel from './SwiftTagLabel';

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
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description of Goods <span className="text-red-500">*</span>
                </Label>
                <SwiftTagLabel 
                  tag={SWIFT_TAGS.descriptionOfGoods.tag}
                  label={SWIFT_TAGS.descriptionOfGoods.label}
                  required={SWIFT_TAGS.descriptionOfGoods.required}
                />
              </div>
              <Textarea
                value={formData.descriptionOfGoods}
                onChange={(e) => updateField('descriptionOfGoods', e.target.value)}
                placeholder="Enter detailed description of goods"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Port of Loading */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Port of Loading
                  </Label>
                  <SwiftTagLabel 
                    tag={SWIFT_TAGS.portOfLoading.tag}
                    label={SWIFT_TAGS.portOfLoading.label}
                    required={SWIFT_TAGS.portOfLoading.required}
                  />
                </div>
                <Input
                  value={formData.portOfLoading}
                  onChange={(e) => updateField('portOfLoading', e.target.value)}
                  placeholder="Enter port of loading"
                />
              </div>

              {/* Port of Discharge */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Port of Discharge
                  </Label>
                  <SwiftTagLabel 
                    tag={SWIFT_TAGS.portOfDischarge.tag}
                    label={SWIFT_TAGS.portOfDischarge.label}
                    required={SWIFT_TAGS.portOfDischarge.required}
                  />
                </div>
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
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Latest Shipment Date <span className="text-red-500">*</span>
                  </Label>
                  <SwiftTagLabel 
                    tag={SWIFT_TAGS.latestShipmentDate.tag}
                    label={SWIFT_TAGS.latestShipmentDate.label}
                    required={SWIFT_TAGS.latestShipmentDate.required}
                  />
                </div>
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
