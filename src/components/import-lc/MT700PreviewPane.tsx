
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Eye } from 'lucide-react';
import { ImportLCFormData } from '@/types/importLC';

interface MT700PreviewPaneProps {
  formData: ImportLCFormData;
}

const MT700PreviewPane: React.FC<MT700PreviewPaneProps> = ({ formData }) => {
  const generateMT700Content = () => {
    return `
SWIFT MT 700 - ISSUE OF A DOCUMENTARY CREDIT

{1:F01AAAABBCCAXXX0000000000}
{2:I700BBBBAACCAXXXN}
{3:{108:MT700}}
{4:
:27:1/1
:40A:IRREVOCABLE
:20:${formData.corporateReference}
:31C:${formData.issueDate}
:40E:${formData.formOfDocumentaryCredit}
:31D:${formData.expiryDate}${formData.placeOfExpiry}
:50:${formData.applicantName}
${formData.applicantAddress}
:59:${formData.beneficiaryName}
${formData.beneficiaryAddress}
:32B:${formData.currency}${formData.lcAmount}
:39A:${formData.tolerance || 'NOT EXCEEDING'}
:41A:${formData.availableWith || 'ANY BANK'}
:42C:${formData.latestShipmentDate}
:43P:${formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:43T:${formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:44A:${formData.portOfLoading}
:44B:${formData.portOfDischarge}
:45A:${formData.descriptionOfGoods}
:46A:${formData.requiredDocuments.join('\n')}
:47A:${formData.additionalConditions}
:71B:${formData.availableBy || 'PAYMENT'}
:48:${formData.presentationPeriod || '21 DAYS AFTER SHIPMENT DATE'}
:49:CONFIRMATION INSTRUCTIONS
-}`.trim();
  };

  const handlePreview = () => {
    const content = generateMT700Content();
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>MT 700 Preview - ${formData.corporateReference}</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                padding: 20px; 
                position: relative;
              }
              pre { white-space: pre-wrap; }
              .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 120px;
                font-weight: bold;
                color: rgba(255, 255, 255, 0.4);
                text-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                pointer-events: none;
                z-index: 1000;
                user-select: none;
              }
            </style>
          </head>
          <body>
            <div class="watermark">DRAFT</div>
            <h2>SWIFT MT 700 - Documentary Credit Preview</h2>
            <pre>${content}</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleDownload = () => {
    const content = generateMT700Content();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MT700_${formData.corporateReference}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmail = () => {
    const content = generateMT700Content();
    const subject = `Draft MT 700 - ${formData.corporateReference}`;
    const body = `Please find the draft MT 700 below:\n\n${content}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="space-y-6 max-h-[calc(75vh-200px)] overflow-y-auto pr-2">
      <Card className="border border-gray-200 dark:border-gray-600 relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-[120px] font-bold text-gray-900/30 dark:text-white/40 transform -rotate-45 select-none" style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}>
            DRAFT
          </div>
        </div>
        
        <CardHeader className="relative z-20">
          <CardTitle className="text-lg font-semibold text-corporate-teal-600 dark:text-corporate-teal-400">
            MT 700 Draft Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-20">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Review your draft MT 700 before final submission. You can view, download, or email the draft.
            </p>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Draft
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleEmail}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Draft
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Summary of LC Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Reference:</span> {formData.corporateReference}
              </div>
              <div>
                <span className="font-medium">Amount:</span> {formData.currency} {formData.lcAmount.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Beneficiary:</span> {formData.beneficiaryName}
              </div>
              <div>
                <span className="font-medium">Expiry:</span> {formData.expiryDate}
              </div>
              <div>
                <span className="font-medium">POPI:</span> {formData.popiType} - {formData.popiNumber}
              </div>
              <div>
                <span className="font-medium">LC Type:</span> {formData.formOfDocumentaryCredit}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MT700PreviewPane;
