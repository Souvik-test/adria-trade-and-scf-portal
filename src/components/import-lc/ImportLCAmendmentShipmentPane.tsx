
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';

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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AmendmentFieldWrapper
            fieldName="portOfLoading"
            label="Port of Loading"
            hasChanged={!!changes.portOfLoading}
            originalValue={originalData.portOfLoading}
          >
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
            <Input
              type="date"
              value={formData.latestShipmentDate}
              onChange={(e) => updateField('latestShipmentDate', e.target.value)}
            />
          </AmendmentFieldWrapper>

          <div className="md:col-span-2">
            <AmendmentFieldWrapper
              fieldName="descriptionOfGoods"
              label="Description of Goods"
              hasChanged={!!changes.descriptionOfGoods}
              originalValue={originalData.descriptionOfGoods}
            >
              <Textarea
                value={formData.descriptionOfGoods}
                onChange={(e) => updateField('descriptionOfGoods', e.target.value)}
                placeholder="Enter description of goods"
                rows={4}
              />
            </AmendmentFieldWrapper>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentShipmentPane;
