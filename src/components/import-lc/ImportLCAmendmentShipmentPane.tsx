
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';
import SwiftTagLabel from './SwiftTagLabel';

interface ImportLCAmendmentShipmentPaneProps {
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ImportLCAmendmentShipmentPane: React.FC<ImportLCAmendmentShipmentPaneProps> = ({
  formData,
  originalData,
  changes,
  updateField
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Shipment Details - Amendment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AmendmentFieldWrapper
            fieldName="descriptionOfGoods"
            label="Description of Goods"
            hasChanged={!!changes.descriptionOfGoods}
            originalValue={originalData.descriptionOfGoods}
          >
            <SwiftTagLabel tag=":45A:" label="Description of Goods" required />
            <Textarea
              value={formData.descriptionOfGoods}
              onChange={(e) => updateField('descriptionOfGoods', e.target.value)}
              placeholder="Enter description of goods"
              rows={4}
            />
          </AmendmentFieldWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AmendmentFieldWrapper
              fieldName="portOfLoading"
              label="Port of Loading"
              hasChanged={!!changes.portOfLoading}
              originalValue={originalData.portOfLoading}
            >
              <SwiftTagLabel tag=":44E:" label="Port of Loading" />
              <Input
                value={formData.portOfLoading}
                onChange={(e) => updateField('portOfLoading', e.target.value)}
                placeholder="Enter port of loading"
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="portOfDischarge"
              label="Port of Discharge"
              hasChanged={!!changes.portOfDischarge}
              originalValue={originalData.portOfDischarge}
            >
              <SwiftTagLabel tag=":44F:" label="Port of Discharge" />
              <Input
                value={formData.portOfDischarge}
                onChange={(e) => updateField('portOfDischarge', e.target.value)}
                placeholder="Enter port of discharge"
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="latestShipmentDate"
              label="Latest Shipment Date"
              hasChanged={!!changes.latestShipmentDate}
              originalValue={originalData.latestShipmentDate}
            >
              <SwiftTagLabel tag=":44C:" label="Latest Shipment Date" />
              <Input
                type="date"
                value={formData.latestShipmentDate}
                onChange={(e) => updateField('latestShipmentDate', e.target.value)}
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="presentationPeriod"
              label="Presentation Period"
              hasChanged={!!changes.presentationPeriod}
              originalValue={originalData.presentationPeriod}
            >
              <SwiftTagLabel tag=":48:" label="Presentation Period" />
              <Input
                value={formData.presentationPeriod}
                onChange={(e) => updateField('presentationPeriod', e.target.value)}
                placeholder="e.g., 21 days after shipment date"
              />
            </AmendmentFieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AmendmentFieldWrapper
              fieldName="partialShipmentsAllowed"
              label="Partial Shipments"
              hasChanged={!!changes.partialShipmentsAllowed}
              originalValue={originalData.partialShipmentsAllowed}
            >
              <SwiftTagLabel tag=":43P:" label="Partial Shipments" />
              <div className="flex items-center space-x-2">
                <Switch
                  id="partialShipments"
                  checked={formData.partialShipmentsAllowed}
                  onCheckedChange={(checked) => updateField('partialShipmentsAllowed', checked)}
                />
                <Label htmlFor="partialShipments">
                  {formData.partialShipmentsAllowed ? 'Allowed' : 'Not Allowed'}
                </Label>
              </div>
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="transshipmentAllowed"
              label="Transshipment"
              hasChanged={!!changes.transshipmentAllowed}
              originalValue={originalData.transshipmentAllowed}
            >
              <SwiftTagLabel tag=":43T:" label="Transshipment" />
              <div className="flex items-center space-x-2">
                <Switch
                  id="transshipment"
                  checked={formData.transshipmentAllowed}
                  onCheckedChange={(checked) => updateField('transshipmentAllowed', checked)}
                />
                <Label htmlFor="transshipment">
                  {formData.transshipmentAllowed ? 'Allowed' : 'Not Allowed'}
                </Label>
              </div>
            </AmendmentFieldWrapper>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentShipmentPane;
