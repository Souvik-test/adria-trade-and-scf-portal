
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface MT760SidebarPreviewProps {
  formData: any;
  visible?: boolean;
}

const MT760SidebarPreview: React.FC<MT760SidebarPreviewProps> = ({ formData, visible = true }) => {
  if (!visible) return null;
  const generateMT760Preview = () => {
    return `{1:F01BANKSGSGXXXX0000000000}
{2:I760RECIPSGSGXXXN}
{3:{113:0001}{108:REF12345678}}
{4:
:20:${formData.referenceNumber || 'REF12345678'}
:23:ISSU
:31C:${formData.dateOfIssue || new Date().toISOString().split('T')[0].replace(/-/g, '')}
:31D:${formData.dateOfExpiry || ''}
:32B:${formData.currency || 'USD'}${formData.amount || '0,00'}
:50:${formData.applicantName || 'APPLICANT NAME'}
${formData.applicantAddress || 'APPLICANT ADDRESS'}
:59:${formData.beneficiaryName || 'BENEFICIARY NAME'}  
${formData.beneficiaryAddress || 'BENEFICIARY ADDRESS'}
:32B:${formData.currency || 'USD'}${formData.amount || '0,00'}
:39A:${formData.percentageCreditAmount || '100'}
:39B:${formData.maximumCreditAmount || formData.amount || '0,00'}
:39C:${formData.additionalAmounts || ''}
:41A:${formData.availableWith || 'ANY BANK'}
:41D:${formData.availableBy || ''}
:42C:${formData.draftAt || ''}
:42A:${formData.draweeBank || ''}
:42D:${formData.draweeDetails || ''}
:43P:${formData.partialShipments || 'ALLOWED'}
:43T:${formData.transhipment || 'ALLOWED'}
:44A:${formData.loadingPort || ''}
:44E:${formData.dischargePort || ''}
:44F:${formData.destination || ''}
:44B:${formData.transportationDetails || ''}
:45A:${formData.descriptionOfGoods || ''}
:46A:${formData.documentsRequired || ''}
:47A:${formData.additionalConditions || ''}
:71D:${formData.chargesDetails || 'ALL CHARGES OUTSIDE SINGAPORE FOR BENEFICIARY ACCOUNT'}
:48:${formData.periodForPresentation || ''}
:49:${formData.confirmationInstructions || ''}
:53A:${formData.senderCorrespondent || ''}
:78:${formData.instructionsToPayingBank || ''}
-}`;
  };

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <Card className="flex-1 rounded-none border-0">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>MT 760 Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {generateMT760Preview()}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MT760SidebarPreview;
