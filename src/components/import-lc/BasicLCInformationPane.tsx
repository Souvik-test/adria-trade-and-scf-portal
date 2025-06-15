
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImportLCFormData } from '@/types/importLC';
import POPISearchSection from './POPISearchSection';
import SwiftTagLabel from './SwiftTagLabel';

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
      <POPISearchSection formData={formData} updateField={updateField} />
      
      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            LC Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SwiftTagLabel tag=":40A:" label="Form of Documentary Credit" required />
              <Select 
                value={formData.formOfDocumentaryCredit} 
                onValueChange={(value) => updateField('formOfDocumentaryCredit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IRREVOCABLE">Irrevocable</SelectItem>
                  <SelectItem value="TRANSFERABLE">Transferable</SelectItem>
                  <SelectItem value="STANDBY">Stand-by</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <SwiftTagLabel tag=":20:" label="Corporate Reference" required />
              <Input
                value={formData.corporateReference}
                onChange={(e) => updateField('corporateReference', e.target.value)}
                placeholder="Enter corporate reference"
              />
            </div>

            <div>
              <SwiftTagLabel tag=":40E:" label="Applicable Rules" required />
              <Select 
                value={formData.applicableRules} 
                onValueChange={(value) => updateField('applicableRules', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select applicable rules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UCP Latest Version">UCP Latest Version</SelectItem>
                  <SelectItem value="UCP 600">UCP 600</SelectItem>
                  <SelectItem value="ISBP">ISBP</SelectItem>
                  <SelectItem value="eUCP">eUCP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <SwiftTagLabel tag=":40A:" label="LC Type" />
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
                  <SelectItem value="DEFERRED">Deferred Payment LC</SelectItem>
                  <SelectItem value="ACCEPTANCE">Acceptance LC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <SwiftTagLabel tag=":31C:" label="Issue Date" />
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => updateField('issueDate', e.target.value)}
              />
            </div>

            <div>
              <SwiftTagLabel tag=":31D:" label="Expiry Date" required />
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => updateField('expiryDate', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <SwiftTagLabel tag=":31D:" label="Place of Expiry" required />
              <Input
                value={formData.placeOfExpiry}
                onChange={(e) => updateField('placeOfExpiry', e.target.value)}
                placeholder="Enter place of expiry"
              />
            </div>
            {/* New Transferable Dropdown */}
            <div className="md:col-span-2">
              <Label className="block mb-1 font-medium text-foreground">Transferable</Label>
              <Select 
                value={formData.isTransferable ? "yes" : "no"}
                onValueChange={(value) => updateField('isTransferable', value === "yes")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Yes/No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicLCInformationPane;
