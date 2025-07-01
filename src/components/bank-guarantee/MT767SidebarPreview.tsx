
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, Eye, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OutwardBGFormData } from '@/types/outwardBankGuarantee';

interface MT767SidebarPreviewProps {
  formData: OutwardBGFormData;
  originalData: OutwardBGFormData;
  guaranteeReference: string;
}

const MT767SidebarPreview: React.FC<MT767SidebarPreviewProps> = ({ 
  formData, 
  originalData,
  guaranteeReference 
}) => {
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);

  const generateMT767Content = () => {
    const amendmentNumber = '01'; // In real app, this would be generated
    
    return `{1:F01BANKSGSGXXXX0000000000}
{2:I767RECIPSGSGXXXN}
{3:{113:0001}{108:${guaranteeReference}-AMD${amendmentNumber}}}
{4:
:20:${guaranteeReference}-AMD${amendmentNumber}
:21:${guaranteeReference}
:23:AMENDMENT
:30:${new Date().toISOString().slice(0, 10).replace(/-/g, '')}
:26E:${amendmentNumber}
${formData.guaranteeAmount !== originalData.guaranteeAmount ? `:32B:${formData.currency}${formData.guaranteeAmount || '0,00'}` : ''}
${formData.dateOfExpiry !== originalData.dateOfExpiry ? `:31D:${formData.dateOfExpiry || ''}${formData.placeOfExpiry || ''}` : ''}
${formData.beneficiaryName !== originalData.beneficiaryName ? `:59:${formData.beneficiaryName || ''}\n${formData.beneficiaryAddress || ''}` : ''}
${formData.guaranteeDetails !== originalData.guaranteeDetails ? `:45A:${formData.guaranteeDetails || ''}` : ''}
${formData.termsAndConditions !== originalData.termsAndConditions ? `:47A:${formData.termsAndConditions || ''}` : ''}
${formData.documentsRequired !== originalData.documentsRequired ? `:46A:${formData.documentsRequired || ''}` : ''}
:78:AMENDMENT TO BANK GUARANTEE
AMENDMENT DETAILS:
${getAmendmentChanges()}
-}`;
  };

  const getAmendmentChanges = () => {
    const changes = [];
    
    if (formData.guaranteeAmount !== originalData.guaranteeAmount) {
      changes.push(`GUARANTEE AMOUNT: ${originalData.currency} ${originalData.guaranteeAmount || '0'} TO ${formData.currency} ${formData.guaranteeAmount || '0'}`);
    }
    
    if (formData.dateOfExpiry !== originalData.dateOfExpiry) {
      changes.push(`EXPIRY DATE: ${originalData.dateOfExpiry || 'N/A'} TO ${formData.dateOfExpiry || 'N/A'}`);
    }
    
    if (formData.beneficiaryName !== originalData.beneficiaryName) {
      changes.push(`BENEFICIARY: CHANGED`);
    }
    
    if (formData.guaranteeDetails !== originalData.guaranteeDetails) {
      changes.push(`GUARANTEE DETAILS: AMENDED`);
    }
    
    if (formData.termsAndConditions !== originalData.termsAndConditions) {
      changes.push(`TERMS AND CONDITIONS: AMENDED`);
    }
    
    return changes.length > 0 ? changes.join('\n') : 'NO CHANGES DETECTED';
  };

  const downloadMT767 = () => {
    const content = generateMT767Content();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MT767-${guaranteeReference}-AMD.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-96 bg-gradient-to-br from-corporate-teal-50 to-corporate-blue-50 dark:from-corporate-teal-900/20 dark:to-corporate-blue-900/20 border-l border-corporate-teal-200 dark:border-corporate-teal-700 flex flex-col">
      <div className="p-4 border-b border-corporate-teal-200 dark:border-corporate-teal-700 bg-corporate-teal-600 dark:bg-corporate-teal-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Eye className="h-5 w-5" />
          MT 767 Preview
        </h3>
        <p className="text-corporate-teal-100 text-sm mt-1">Amendment preview</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-corporate-teal-200 dark:border-corporate-teal-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-corporate-teal-700 dark:text-corporate-teal-300">
              SWIFT MT 767 Amendment
            </CardTitle>
            <div className="text-xs text-corporate-teal-600 dark:text-corporate-teal-400">
              Reference: {guaranteeReference || 'Not selected'}
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
              {generateMT767Content()}
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
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-corporate-teal-700 dark:text-corporate-teal-300">
                MT 767 - Bank Guarantee Amendment
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-end mb-4">
              <Button 
                onClick={downloadMT767}
                className="bg-corporate-teal-600 hover:bg-corporate-teal-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download MT 767
              </Button>
            </div>
            <ScrollArea className="h-[60vh]">
              <pre className="text-sm font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-wrap break-words leading-relaxed">
                {generateMT767Content()}
              </pre>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={downloadMT767}
          className="w-full bg-corporate-teal-600 hover:bg-corporate-teal-700 text-white"
          disabled={!guaranteeReference}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Draft
        </Button>
      </div>
    </div>
  );
};

export default MT767SidebarPreview;
