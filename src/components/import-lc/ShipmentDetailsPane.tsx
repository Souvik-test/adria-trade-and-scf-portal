
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
              <SwiftTagLabel 
                tag={SWIFT_TAGS.descriptionOfGoods.tag}
                label={SWIFT_TAGS.descriptionOfGoods.label}
                required={SWIFT_TAGS.descriptionOfGoods.required}
              />
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
                <SwiftTagLabel 
                  tag={SWIFT_TAGS.portOfLoading.tag}
                  label={SWIFT_TAGS.portOfLoading.label}
                  required={SWIFT_TAGS.portOfLoading.required}
                />
                <Input
                  value={formData.portOfLoading}
                  onChange={(e) => updateField('portOfLoading', e.target.value)}
                  placeholder="Enter port of loading"
                />
              </div>

              {/* Port of Discharge */}
              <div>
                <SwiftTagLabel 
                  tag={SWIFT_TAGS.portOfDischarge.tag}
                  label={SWIFT_TAGS.portOfDischarge.label}
                  required={SWIFT_TAGS.portOfDischarge.required}
                />
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
                <SwiftTagLabel 
                  tag={SWIFT_TAGS.latestShipmentDate.tag}
                  label={SWIFT_TAGS.latestShipmentDate.label}
                  required={SWIFT_TAGS.latestShipmentDate.required}
                />
                <Input
                  type="date"
                  value={formData.latestShipmentDate}
                  onChange={(e) => updateField('latestShipmentDate', e.target.value)}
                />
              </div>

              {/* Presentation Period */}
              <div>
                <SwiftTagLabel
                  tag=":48:"
                  label="Presentation Period"
                />
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
