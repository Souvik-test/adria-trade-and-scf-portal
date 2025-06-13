
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

    return `
MT 700 - LETTER OF CREDIT ISSUANCE

:20: ${formData.corporateReference || 'N/A'}
:23: ${formData.formOfDocumentaryCredit || 'IRREVOCABLE'}
:31C: ${formData.issueDate || 'N/A'}
:31D: ${formData.expiryDate || 'N/A'} ${formData.placeOfExpiry || 'N/A'}
:32B: ${formData.currency || 'USD'} ${formData.lcAmount || 0}
:39A: ${formData.tolerance || 'NOT ALLOWED'}
:41A: ${formData.availableWith || 'ANY BANK'}
:42C: ${formData.availableBy || 'BY PAYMENT'}
:43P: ${formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:43T: ${formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:44A: ${formData.portOfLoading || 'N/A'}
:44E: ${formData.portOfDischarge || 'N/A'}
:44C: ${formData.latestShipmentDate || 'N/A'}
:45A: ${formData.descriptionOfGoods || 'N/A'}
:46A: ${formData.documentRequirements.length > 0 
  ? formData.documentRequirements.map(doc => 
      `${doc.name} - ${doc.original} Original(s), ${doc.copies} Copy/Copies`
    ).join('\n') 
  : formData.requiredDocuments.join('\n') || 'N/A'}
:47A: ${formData.additionalConditions || 'N/A'}
:48: ${formData.presentationPeriod || 'N/A'}
:50: ${applicantParty?.name || formData.applicantName || 'N/A'}
${applicantParty?.address || formData.applicantAddress || 'N/A'}
:57A: ${advisingBankParty?.swiftCode || formData.advisingBankSwiftCode || 'N/A'}
:59: ${beneficiaryParty?.name || formData.beneficiaryName || 'N/A'}
${beneficiaryParty?.address || formData.beneficiaryAddress || 'N/A'}
:78: ${formData.additionalConditions || 'N/A'}
:71B: ${formData.additionalAmount > 0 ? `ADDITIONAL AMOUNT: ${formData.currency} ${formData.additionalAmount}` : 'NONE'}
`;
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
