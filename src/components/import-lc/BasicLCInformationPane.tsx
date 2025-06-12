
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImportLCFormData } from '@/hooks/useImportLCForm';
import POPISearchSection from './POPISearchSection';

interface BasicLCInformationPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const BasicLCInformationPane: React.FC<BasicLCInformationPaneProps> = ({
  formData,
  updateField
}) => {
  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-600 dark:text-corporate-teal-400">
            Purchase Order / Proforma Invoice Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <POPISearchSection
            formData={formData}
            updateField={updateField}
          />
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-600 dark:text-corporate-teal-400">
            Basic LC Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Form of Documentary Credit <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.formOfDocumentaryCredit} onValueChange={(value) => updateField('formOfDocumentaryCredit', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Irrevocable">Irrevocable</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Unconfirmed">Unconfirmed</SelectItem>
                  <SelectItem value="Standby">Standby</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Corporate Reference <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.corporateReference}
                onChange={(e) => updateField('corporateReference', e.target.value)}
                placeholder="Enter corporate reference"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Applicable Rules
              </Label>
              <Select value={formData.applicableRules} onValueChange={(value) => updateField('applicableRules', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select rules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UCP Latest Version">UCP Latest Version</SelectItem>
                  <SelectItem value="UCP 600">UCP 600</SelectItem>
                  <SelectItem value="ISP98">ISP98</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                LC Type
              </Label>
              <Select value={formData.lcType} onValueChange={(value) => updateField('lcType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select LC type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="At Sight">At Sight</SelectItem>
                  <SelectItem value="Usance">Usance</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Issue Date
              </Label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => updateField('issueDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiry Date
              </Label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => updateField('expiryDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Place of Expiry
              </Label>
              <Input
                value={formData.placeOfExpiry}
                onChange={(e) => updateField('placeOfExpiry', e.target.value)}
                placeholder="Enter place of expiry"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicLCInformationPane;
