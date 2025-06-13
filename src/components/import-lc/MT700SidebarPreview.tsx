
import React, { useState } from 'react';
import { ImportLCFormData } from '@/hooks/useImportLCForm';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface MT700SidebarPreviewProps {
  formData: ImportLCFormData;
}

const MT700SidebarPreview: React.FC<MT700SidebarPreviewProps> = ({ formData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateMT700Content = () => {
    const applicantParty = formData.parties.find(p => p.role === 'applicant');
    const beneficiaryParty = formData.parties.find(p => p.role === 'beneficiary');
    const advisingBankParty = formData.parties.find(p => p.role === 'advising_bank');

    const swiftFields = [
      { tag: ':20:', label: 'Documentary Credit Number', value: formData.corporateReference || 'N/A' },
      { tag: ':23:', label: 'Type of Credit', value: formData.formOfDocumentaryCredit || 'IRREVOCABLE' },
      { tag: ':31C:', label: 'Date of Issue', value: formData.issueDate || 'N/A' },
      { tag: ':31D:', label: 'Date and Place of Expiry', value: `${formData.expiryDate || 'N/A'} ${formData.placeOfExpiry || 'N/A'}` },
      { tag: ':32B:', label: 'Currency Code and Amount', value: `${formData.currency || 'USD'} ${formData.lcAmount || 0}` },
      { tag: ':39A:', label: 'Percentage Credit Amount Tolerance', value: formData.tolerance || 'NOT ALLOWED' },
      { tag: ':41A:', label: 'Available With/By', value: formData.availableWith || 'ANY BANK' },
      { tag: ':42C:', label: 'Drafts At', value: formData.availableBy || 'BY PAYMENT' },
      { tag: ':43P:', label: 'Partial Shipments', value: formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED' },
      { tag: ':43T:', label: 'Transshipment', value: formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED' },
      { tag: ':44A:', label: 'Loading on Board/Dispatch/Taking in Charge At', value: formData.portOfLoading || 'N/A' },
      { tag: ':44E:', label: 'Port of Discharge', value: formData.portOfDischarge || 'N/A' },
      { tag: ':44C:', label: 'Latest Date of Shipment', value: formData.latestShipmentDate || 'N/A' },
      { tag: ':45A:', label: 'Description of Goods and/or Services', value: formData.descriptionOfGoods || 'N/A' },
      { tag: ':46A:', label: 'Documents Required', value: formData.documentRequirements.length > 0 
        ? formData.documentRequirements.map(doc => 
            `${doc.name} - ${doc.original} Original(s), ${doc.copies} Copy/Copies`
          ).join('\n') 
        : formData.requiredDocuments.join('\n') || 'N/A' },
      { tag: ':47A:', label: 'Additional Conditions', value: formData.additionalConditions || 'N/A' },
      { tag: ':48:', label: 'Period for Presentation', value: formData.presentationPeriod || 'N/A' },
      { tag: ':50:', label: 'Applicant', value: `${applicantParty?.name || formData.applicantName || 'N/A'}\n${applicantParty?.address || formData.applicantAddress || 'N/A'}` },
      { tag: ':57A:', label: 'Advising Bank', value: advisingBankParty?.swiftCode || formData.advisingBankSwiftCode || 'N/A' },
      { tag: ':59:', label: 'Beneficiary', value: `${beneficiaryParty?.name || formData.beneficiaryName || 'N/A'}\n${beneficiaryParty?.address || formData.beneficiaryAddress || 'N/A'}` },
      { tag: ':78:', label: 'Instructions to Paying/Accepting/Negotiating Bank', value: formData.additionalConditions || 'N/A' },
      { tag: ':71B:', label: 'Charges', value: formData.additionalAmount > 0 ? `ADDITIONAL AMOUNT: ${formData.currency} ${formData.additionalAmount}` : 'NONE' }
    ];

    return `MT 700 - LETTER OF CREDIT ISSUANCE

${swiftFields.map(field => 
  `${field.tag} ${field.label}
${field.value}

`).join('')}`;
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="writing-mode-vertical text-xs text-gray-500 dark:text-gray-400">
          MT 700 Preview
        </div>
      </div>
    );
  }

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              MT 700 Draft Preview
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              Close
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {generateMT700Content()}
            </pre>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          MT 700 Preview
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            title="Expand Preview"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {generateMT700Content()}
        </pre>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="w-full"
        >
          View Full Preview
        </Button>
      </div>
    </div>
  );
};

export default MT700SidebarPreview;
