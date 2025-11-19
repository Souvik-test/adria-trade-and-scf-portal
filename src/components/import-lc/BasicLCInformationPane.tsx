
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, FileText, Copy } from 'lucide-react';
import { ImportLCFormData } from '@/types/importLC';
import POPISearchSection from './POPISearchSection';
import SwiftTagLabel from './SwiftTagLabel';
import { useToast } from '@/hooks/use-toast';
import { searchTemplates, searchImportLCTransactions, ImportLCTemplate } from '@/services/importLCTemplateService';
import TemplateSearchResults from './TemplateSearchResults';
import TransactionSearchResults from './TransactionSearchResults';
import { supabase } from '@/integrations/supabase/client';

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
  const [selectedTemplateInfo, setSelectedTemplateInfo] = useState<{ id: string; name: string } | null>(null);
  const [selectedTransactionInfo, setSelectedTransactionInfo] = useState<{ id: string; date: string } | null>(null);
  const [searchResults, setSearchResults] = useState<ImportLCTemplate[]>([]);
  const [transactionResults, setTransactionResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Get user ID from custom_users table
  const getUserId = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    
    const { data: userData } = await supabase
      .from('custom_users')
      .select('id')
      .eq('user_id', data.user.id)
      .single();
    
    return userData?.id || null;
  };

  const handleAcceleratorChange = (value: string) => {
    setAcceleratorType(value);
    if (value === 'template') {
      setTemplateDialogOpen(true);
    } else if (value === 'transaction') {
      setTransactionDialogOpen(true);
    }
  };

  const handleTemplateSearch = async () => {
    const userId = await getUserId();
    if (!userId) {
      toast({ title: "Error", description: "User not authenticated", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    const result = await searchTemplates(userId, templateId, templateName);
    setIsSearching(false);

    if (result.success && result.data) {
      setSearchResults(result.data);
      if (result.data.length === 0) {
        toast({ title: "No Results", description: "No templates found matching your criteria" });
      }
    } else {
      toast({ title: "Error", description: result.error || "Failed to search templates", variant: "destructive" });
    }
  };

  const handleTransactionSearch = async () => {
    const userId = await getUserId();
    if (!userId) {
      toast({ title: "Error", description: "User not authenticated", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    const result = await searchImportLCTransactions(userId, transactionId, dateFrom, dateTo);
    setIsSearching(false);

    if (result.success && result.data) {
      setTransactionResults(result.data);
      if (result.data.length === 0) {
        toast({ title: "No Results", description: "No transactions found matching your criteria" });
      }
    } else {
      toast({ title: "Error", description: result.error || "Failed to search transactions", variant: "destructive" });
    }
  };

  const handleTemplateSelect = (template: ImportLCTemplate) => {
    const data = template.template_data;
    
    // Populate all fields from template
    Object.keys(data).forEach((key) => {
      updateField(key as keyof ImportLCFormData, data[key as keyof ImportLCFormData]);
    });

    setSelectedTemplateInfo({
      id: template.template_id,
      name: template.template_name
    });

    toast({ title: "Success", description: "Template loaded successfully" });
    setTemplateDialogOpen(false);
    setSearchResults([]);
  };

  const handleTransactionSelect = (transaction: any) => {
    // Map transaction fields to form fields
    const fieldMappings: { [key: string]: keyof ImportLCFormData } = {
      corporate_reference: 'corporateReference',
      form_of_documentary_credit: 'formOfDocumentaryCredit',
      applicable_rules: 'applicableRules',
      lc_type: 'lcType',
      issue_date: 'issueDate',
      expiry_date: 'expiryDate',
      place_of_expiry: 'placeOfExpiry',
      applicant_name: 'applicantName',
      applicant_address: 'applicantAddress',
      applicant_account_number: 'applicantAccountNumber',
      beneficiary_name: 'beneficiaryName',
      beneficiary_address: 'beneficiaryAddress',
      beneficiary_bank_name: 'beneficiaryBankName',
      beneficiary_bank_address: 'beneficiaryBankAddress',
      beneficiary_bank_swift_code: 'beneficiaryBankSwiftCode',
      advising_bank_swift_code: 'advisingBankSwiftCode',
      lc_amount: 'lcAmount',
      additional_amount: 'additionalAmount',
      currency: 'currency',
      tolerance: 'tolerance',
      available_with: 'availableWith',
      available_by: 'availableBy',
      description_of_goods: 'descriptionOfGoods',
      port_of_loading: 'portOfLoading',
      port_of_discharge: 'portOfDischarge',
      partial_shipments_allowed: 'partialShipmentsAllowed',
      transshipment_allowed: 'transshipmentAllowed',
      latest_shipment_date: 'latestShipmentDate',
      presentation_period: 'presentationPeriod',
      required_documents: 'requiredDocuments',
      additional_conditions: 'additionalConditions',
      is_transferable: 'isTransferable',
    };

    Object.entries(fieldMappings).forEach(([txnKey, formKey]) => {
      if (transaction[txnKey] !== undefined && transaction[txnKey] !== null) {
        updateField(formKey, transaction[txnKey]);
      }
    });

    setSelectedTransactionInfo({
      id: transaction.corporate_reference,
      date: transaction.issue_date || ''
    });

    toast({ title: "Success", description: "Transaction data copied successfully" });
    setTransactionDialogOpen(false);
    setTransactionResults([]);
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
        <CardContent className="space-y-4">
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

          {/* Display selected template/transaction info */}
          {selectedTemplateInfo && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Using Template: {selectedTemplateInfo.name}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Template ID: {selectedTemplateInfo.id}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTransactionInfo && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Copy className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">
                    Copied from Transaction: {selectedTransactionInfo.id}
                  </p>
                  {selectedTransactionInfo.date && (
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Issue Date: {new Date(selectedTransactionInfo.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
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
            <Button variant="outline" onClick={() => {
              setTemplateDialogOpen(false);
              setSearchResults([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleTemplateSearch} disabled={isSearching} className="gap-2">
              <Search className="w-4 h-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </DialogFooter>

          {/* Display search results */}
          {searchResults.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <TemplateSearchResults
                templates={searchResults}
                onSelect={handleTemplateSelect}
                isLoading={isSearching}
              />
            </div>
          )}
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
            <Button variant="outline" onClick={() => {
              setTransactionDialogOpen(false);
              setTransactionResults([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleTransactionSearch} disabled={isSearching} className="gap-2">
              <Search className="w-4 h-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </DialogFooter>

          {/* Display search results */}
          {transactionResults.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <TransactionSearchResults
                transactions={transactionResults}
                onSelect={handleTransactionSelect}
                isLoading={isSearching}
              />
            </div>
          )}
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
