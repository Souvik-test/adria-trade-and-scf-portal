
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Eye, ChevronRight, ChevronDown } from 'lucide-react';
import { ImportLCFormData } from '@/hooks/useImportLCForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MT700SidebarPreviewProps {
  formData: ImportLCFormData;
}

const MT700SidebarPreview: React.FC<MT700SidebarPreviewProps> = ({ formData }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const generateMT700Content = () => {
    return `
SWIFT MT 700 - ISSUE OF A DOCUMENTARY CREDIT

{1:F01AAAABBCCAXXX0000000000}
{2:I700BBBBAACCAXXXN}
{3:{108:MT700}}
{4:
:27:1/1
:40A:${formData.formOfDocumentaryCredit || 'IRREVOCABLE'}
:20:${formData.corporateReference || '[REFERENCE]'}
:31C:${formData.issueDate || '[ISSUE DATE]'}
:40E:${formData.applicableRules || '[APPLICABLE RULES]'}
:31D:${formData.expiryDate || '[EXPIRY]'}${formData.placeOfExpiry || '[PLACE]'}
:50:${formData.applicantName || '[APPLICANT NAME]'}
${formData.applicantAddress || '[APPLICANT ADDRESS]'}
:59:${formData.beneficiaryName || '[BENEFICIARY NAME]'}
${formData.beneficiaryAddress || '[BENEFICIARY ADDRESS]'}
:32B:${formData.currency || 'USD'}${formData.lcAmount || '[AMOUNT]'}
:39A:${formData.tolerance || 'NOT EXCEEDING'}
:41A:${formData.availableWith || 'ANY BANK'}
:42C:${formData.latestShipmentDate || '[SHIPMENT DATE]'}
:43P:${formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:43T:${formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:44A:${formData.portOfLoading || '[PORT OF LOADING]'}
:44B:${formData.portOfDischarge || '[PORT OF DISCHARGE]'}
:45A:${formData.descriptionOfGoods || '[GOODS DESCRIPTION]'}
:46A:${formData.requiredDocuments.join('\n') || '[DOCUMENTS]'}
:47A:${formData.additionalConditions || '[CONDITIONS]'}
:49:${formData.confirmation || 'CONFIRMATION INSTRUCTIONS'}
:71B:${formData.availableBy || 'PAYMENT'}
:48:${formData.presentationPeriod || '21 DAYS AFTER SHIPMENT DATE'}
-}`.trim();
  };

  const handlePreview = () => {
    const content = generateMT700Content();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    const content = generateMT700Content();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MT700_${formData.corporateReference || 'Draft'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmail = () => {
    const content = generateMT700Content();
    const subject = `Draft MT 700 - ${formData.corporateReference || 'Import LC Request'}`;
    const body = `Please find the draft MT 700 below:\n\n${content}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const getCompletionPercentage = () => {
    const fields = [
      formData.corporateReference,
      formData.formOfDocumentaryCredit,
      formData.applicantName,
      formData.beneficiaryName,
      formData.lcAmount > 0,
      formData.descriptionOfGoods
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-600 h-full overflow-y-auto">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <Card className="border-0 border-b border-gray-200 dark:border-gray-600 rounded-none">
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <CardTitle className="text-sm font-semibold text-corporate-teal-600 dark:text-corporate-teal-400">
                  MT 700 Draft Preview
                </CardTitle>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </CollapsibleTrigger>
            
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Completion</span>
                <span>{getCompletionPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-corporate-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="flex-1 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1 text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleEmail}
                  className="flex-1 text-xs"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
              </div>

              {/* Key Fields Summary */}
              <div className="space-y-2 text-xs">
                <div className="border rounded p-2 bg-gray-50 dark:bg-gray-700">
                  <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Key Fields</h4>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reference (20):</span>
                      <span className="font-mono text-xs">
                        {formData.corporateReference || '---'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount (32B):</span>
                      <span className="font-mono text-xs">
                        {formData.currency} {formData.lcAmount ? formData.lcAmount.toLocaleString() : '---'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Beneficiary (59):</span>
                      <span className="font-mono text-xs truncate max-w-24">
                        {formData.beneficiaryName || '---'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expiry (31D):</span>
                      <span className="font-mono text-xs">
                        {formData.expiryDate || '---'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Form (40A):</span>
                      <span className="font-mono text-xs truncate max-w-24">
                        {formData.formOfDocumentaryCredit || '---'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Confirmation (49):</span>
                      <span className="font-mono text-xs">
                        {formData.confirmation || '---'}
                      </span>
                    </div>
                    
                    {formData.popiNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">POPI:</span>
                        <span className="font-mono text-xs">
                          {formData.popiType} - {formData.popiNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default MT700SidebarPreview;
