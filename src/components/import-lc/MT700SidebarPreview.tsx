
import React, { useState } from 'react';
import { ImportLCFormData } from '@/types/importLC';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MT700SidebarPreviewProps {
  formData: ImportLCFormData;
}

const MT700SidebarPreview: React.FC<MT700SidebarPreviewProps> = ({ formData }) => {
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);

  const generateMT700Content = () => {
    const applicant = formData.parties.find(p => p.role === 'applicant');
    const beneficiary = formData.parties.find(p => p.role === 'beneficiary');
    
    return `{1:F01TESTBANKAXXX0000000000}
{2:I700RECEIVERXXXXN}
{3:{108:MT700-${formData.corporateReference}}}
{4:
:20:${formData.corporateReference}
:23:ISSUANCE
:31C:${formData.issueDate || 'YYMMDD'}
:40A:${formData.formOfDocumentaryCredit}
:20:${formData.corporateReference}
:31D:${formData.expiryDate || 'YYMMDD'}${formData.placeOfExpiry}
:50:${applicant?.name || formData.applicantName}
${applicant?.address || formData.applicantAddress}
:59:${beneficiary?.name || formData.beneficiaryName}
${beneficiary?.address || formData.beneficiaryAddress}
:32B:${formData.currency}${formData.lcAmount}
${formData.tolerance ? `:39A:${formData.tolerance}` : ''}
:41A:${formData.availableWith}
:42C:${formData.latestShipmentDate || 'YYMMDD'}
:43P:${formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:43T:${formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:44A:${formData.portOfLoading}
:44B:${formData.portOfDischarge}
:45A:${formData.descriptionOfGoods}
:46A:${formData.documentRequirements.map(doc => 
  `${doc.name} - ${doc.original} ORIGINAL${doc.original > 1 ? 'S' : ''}, ${doc.copies} COP${doc.copies === 1 ? 'Y' : 'IES'}`
).join('\n')}
:47A:${formData.additionalConditions}
:48:${formData.presentationPeriod}
:49:${formData.additionalConditions}
:78:${formData.additionalConditions}
-}`;
  };

  const downloadMT700 = () => {
    const content = `*** DRAFT - FOR REVIEW ONLY ***\n\n${generateMT700Content()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MT700-${formData.corporateReference || 'DRAFT'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-80 bg-gradient-to-br from-corporate-teal-50 to-corporate-blue-50 dark:from-corporate-teal-900/20 dark:to-corporate-blue-900/20 border-l border-corporate-teal-200 dark:border-corporate-teal-700 flex flex-col">
      <div className="p-4 border-b border-corporate-teal-200 dark:border-corporate-teal-700 bg-corporate-teal-600 dark:bg-corporate-teal-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Eye className="h-5 w-5" />
          MT 700 Preview
        </h3>
        <p className="text-corporate-teal-100 text-sm mt-1">Live preview of your LC message</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-corporate-teal-200 dark:border-corporate-teal-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-corporate-teal-700 dark:text-corporate-teal-300">
              SWIFT MT 700 Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
              {generateMT700Content()}
            </pre>
          </CardContent>
        </Card>
      </ScrollArea>

      <div className="p-4 border-t border-corporate-teal-200 dark:border-corporate-teal-700 bg-white/50 dark:bg-gray-800/50 space-y-2">
        <Dialog open={isFullPreviewOpen} onOpenChange={setIsFullPreviewOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-corporate-teal-300 text-corporate-teal-700 hover:bg-corporate-teal-50 dark:border-corporate-teal-600 dark:text-corporate-teal-300 dark:hover:bg-corporate-teal-900/20"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              View Full Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="relative max-w-4xl max-h-[80vh] overflow-hidden">
            {/* Draft watermark overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
              <span className="text-[120px] font-bold uppercase tracking-[0.25em] text-corporate-teal-600/25 dark:text-corporate-teal-300/30 -rotate-45 drop-shadow-lg">
                DRAFT
              </span>
            </div>
            <DialogHeader>
              <DialogTitle className="text-corporate-teal-700 dark:text-corporate-teal-300">
                MT 700 - Documentary Credit Issuance
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-end mb-4 relative z-10">
              <Button 
                onClick={downloadMT700}
                className="bg-corporate-blue hover:bg-corporate-blue/90 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download MT 700
              </Button>
            </div>
            <ScrollArea className="h-[60vh] relative z-10">
              <pre className="text-sm font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-wrap break-words leading-relaxed">
                {generateMT700Content()}
              </pre>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={downloadMT700}
          className="w-full bg-corporate-blue hover:bg-corporate-blue/90 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Draft
        </Button>
      </div>
    </div>
  );
};

export default MT700SidebarPreview;
