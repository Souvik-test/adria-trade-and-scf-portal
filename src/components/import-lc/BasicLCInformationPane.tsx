
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ImportLCFormData } from '@/types/importLC';
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
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 pr-2">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic LC Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="corporateReference">Corporate Reference *</Label>
            <Input
              id="corporateReference"
              value={formData.corporateReference}
              onChange={(e) => updateField('corporateReference', e.target.value)}
              placeholder="Enter corporate reference"
            />
          </div>

          <div>
            <Label htmlFor="formOfDocumentaryCredit">Form of Documentary Credit *</Label>
            <Select
              value={formData.formOfDocumentaryCredit}
              onValueChange={(value) => updateField('formOfDocumentaryCredit', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IRREVOCABLE">Irrevocable</SelectItem>
                <SelectItem value="IRREVOCABLE CONFIRMED">Irrevocable Confirmed</SelectItem>
                <SelectItem value="IRREVOCABLE UNCONFIRMED">Irrevocable Unconfirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="applicableRules">Applicable Rules</Label>
            <Select
              value={formData.applicableRules}
              onValueChange={(value) => updateField('applicableRules', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UCP Latest Version">UCP Latest Version</SelectItem>
                <SelectItem value="UCP 600">UCP 600</SelectItem>
                <SelectItem value="ISP 98">ISP 98</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="lcType">LC Type</Label>
            <Select
              value={formData.lcType}
              onValueChange={(value) => updateField('lcType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select LC type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SIGHT">Sight LC</SelectItem>
                <SelectItem value="USANCE">Usance LC</SelectItem>
                <SelectItem value="TRANSFERABLE">Transferable LC</SelectItem>
                <SelectItem value="BACK_TO_BACK">Back to Back LC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={(e) => updateField('issueDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => updateField('expiryDate', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="placeOfExpiry">Place of Expiry</Label>
            <Input
              id="placeOfExpiry"
              value={formData.placeOfExpiry}
              onChange={(e) => updateField('placeOfExpiry', e.target.value)}
              placeholder="Enter place of expiry"
            />
          </div>

          <div>
            <Label htmlFor="confirmation">Confirmation</Label>
            <Select
              value={formData.confirmation}
              onValueChange={(value) => updateField('confirmation', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select confirmation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="UNCONFIRMED">Unconfirmed</SelectItem>
                <SelectItem value="MAY ADD">May Add</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <POPISearchSection
        formData={formData}
        updateField={updateField}
      />
    </div>
  );
};

export default BasicLCInformationPane;
