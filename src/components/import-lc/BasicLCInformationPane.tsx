
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
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
  const [acceleratorType, setAcceleratorType] = useState<string>('');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [templateId, setTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleAcceleratorChange = (value: string) => {
    setAcceleratorType(value);
    if (value === 'template') {
      setTemplateDialogOpen(true);
    } else if (value === 'transaction') {
      setTransactionDialogOpen(true);
    }
  };

  const handleTemplateSearch = () => {
    // TODO: Implement template search logic
    console.log('Searching template:', { templateId, templateName });
    // Mock data population
    setTemplateDialogOpen(false);
  };

  const handleTransactionSearch = () => {
    // TODO: Implement transaction search logic
    console.log('Searching transaction:', { transactionId, dateFrom, dateTo });
    // Mock data population
    setTransactionDialogOpen(false);
  };

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 pr-2">
      {/* Data Entry Accelerators Section */}
      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Data Entry Accelerators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={acceleratorType} onValueChange={handleAcceleratorChange}>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="template" id="template" />
                <Label htmlFor="template" className="cursor-pointer">Use Template</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transaction" id="transaction" />
                <Label htmlFor="transaction" className="cursor-pointer">Copy Existing Transaction</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Template Search Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Search Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateId">Template ID</Label>
              <Input
                id="templateId"
                placeholder="Enter Template ID"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                placeholder="Enter Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTemplateSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Search Dialog */}
      <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Search Existing Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="Enter Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Issuance Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFrom" className="text-sm text-muted-foreground">From</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo" className="text-sm text-muted-foreground">To</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransactionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransactionSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <SelectItem value="IRREVOCABLE TRANSFERABLE">Irrevocable Transferable</SelectItem>
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
              <SwiftTagLabel tag=":52A:" label="Issuing Bank" />
              <Input
                value={formData.issuingBank || ''}
                onChange={(e) => updateField('issuingBank', e.target.value)}
                placeholder="Enter issuing bank name"
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

            <div>
              <SwiftTagLabel tag=":31D:" label="Place of Expiry" required />
              <Input
                value={formData.placeOfExpiry}
                onChange={(e) => updateField('placeOfExpiry', e.target.value)}
                placeholder="Enter place of expiry"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicLCInformationPane;
