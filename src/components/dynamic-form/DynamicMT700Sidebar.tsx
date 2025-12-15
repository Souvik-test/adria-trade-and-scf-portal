import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Maximize2, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { DynamicFormData } from '@/types/dynamicForm';
import { cn } from '@/lib/utils';

interface DynamicMT700SidebarProps {
  formData: DynamicFormData;
  productCode: string;
  eventCode: string;
  referenceField?: string;
}

// Mapping of field codes to SWIFT tags for MT 700
const SWIFT_TAG_MAPPING: Record<string, { tag: string; label: string }> = {
  corporate_reference: { tag: '20', label: 'Documentary Credit Number' },
  lc_reference: { tag: '20', label: 'Documentary Credit Number' },
  documentary_credit_number: { tag: '20', label: 'Documentary Credit Number' },
  issue_date: { tag: '31C', label: 'Date of Issue' },
  date_of_issue: { tag: '31C', label: 'Date of Issue' },
  expiry_date: { tag: '31D', label: 'Date and Place of Expiry' },
  place_of_expiry: { tag: '31D', label: 'Date and Place of Expiry' },
  form_of_documentary_credit: { tag: '40A', label: 'Form of Documentary Credit' },
  lc_type: { tag: '40A', label: 'Form of Documentary Credit' },
  applicable_rules: { tag: '40E', label: 'Applicable Rules' },
  availability: { tag: '41a', label: 'Available With/By' },
  available_with: { tag: '41a', label: 'Available With' },
  available_by: { tag: '42C', label: 'Drafts at' },
  drafts_at: { tag: '42C', label: 'Drafts at' },
  tenor: { tag: '42C', label: 'Drafts at' },
  drawee: { tag: '42D', label: 'Drawee' },
  partial_shipments: { tag: '43P', label: 'Partial Shipments' },
  partial_shipments_allowed: { tag: '43P', label: 'Partial Shipments' },
  transshipment: { tag: '43T', label: 'Transshipment' },
  transshipment_allowed: { tag: '43T', label: 'Transshipment' },
  port_of_loading: { tag: '44E', label: 'Port of Loading' },
  loading_port: { tag: '44E', label: 'Port of Loading' },
  port_of_discharge: { tag: '44F', label: 'Port of Discharge' },
  discharge_port: { tag: '44F', label: 'Port of Discharge' },
  latest_shipment_date: { tag: '44C', label: 'Latest Date of Shipment' },
  shipment_period: { tag: '44D', label: 'Shipment Period' },
  applicant_name: { tag: '50', label: 'Applicant' },
  applicant_address: { tag: '50', label: 'Applicant' },
  applicant: { tag: '50', label: 'Applicant' },
  beneficiary_name: { tag: '59', label: 'Beneficiary' },
  beneficiary_address: { tag: '59', label: 'Beneficiary' },
  beneficiary: { tag: '59', label: 'Beneficiary' },
  currency: { tag: '32B', label: 'Currency Code, Amount' },
  lc_amount: { tag: '32B', label: 'Currency Code, Amount' },
  amount: { tag: '32B', label: 'Currency Code, Amount' },
  lc_currency: { tag: '32B', label: 'Currency Code, Amount' },
  tolerance: { tag: '39A', label: 'Percentage Credit Amount Tolerance' },
  tolerance_percentage: { tag: '39A', label: 'Percentage Credit Amount Tolerance' },
  additional_amount: { tag: '39B', label: 'Maximum Credit Amount' },
  max_credit_amount: { tag: '39B', label: 'Maximum Credit Amount' },
  description_of_goods: { tag: '45A', label: 'Description of Goods' },
  goods_description: { tag: '45A', label: 'Description of Goods' },
  documents_required: { tag: '46A', label: 'Documents Required' },
  required_documents: { tag: '46A', label: 'Documents Required' },
  additional_conditions: { tag: '47A', label: 'Additional Conditions' },
  special_payment_conditions: { tag: '49G', label: 'Special Payment Conditions' },
  charges: { tag: '71B', label: 'Charges' },
  bank_charges: { tag: '71B', label: 'Charges' },
  presentation_period: { tag: '48', label: 'Period for Presentation' },
  confirmation_instructions: { tag: '49', label: 'Confirmation Instructions' },
  confirm_instructions: { tag: '49', label: 'Confirmation Instructions' },
  reimbursing_bank: { tag: '53a', label: 'Reimbursing Bank' },
  instructions_to_paying_bank: { tag: '78', label: 'Instructions to Paying/Accepting/Negotiating Bank' },
  advising_bank: { tag: '57a', label: 'Advise Through Bank' },
  advising_bank_name: { tag: '57a', label: 'Advise Through Bank' },
  advising_bank_swift_code: { tag: '57a', label: 'Advise Through Bank' },
  sender_to_receiver_info: { tag: '72Z', label: 'Sender to Receiver Information' },
  issuing_bank: { tag: '52a', label: 'Issuing Bank' },
  issuing_bank_name: { tag: '52a', label: 'Issuing Bank' },
  beneficiary_bank_name: { tag: '57a', label: 'Advise Through Bank' },
  beneficiary_bank_swift_code: { tag: '57a', label: 'Advise Through Bank' },
};

const DynamicMT700Sidebar: React.FC<DynamicMT700SidebarProps> = ({
  formData,
  productCode,
  eventCode,
  referenceField = 'corporate_reference',
}) => {
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const reference = formData[referenceField] || formData.lc_reference || formData.corporate_reference || 'DRAFT';

  const generateMT700Content = useMemo(() => {
    const lines: string[] = [];
    
    // Header blocks
    lines.push(`{1:F01BANKXXXXAXXX0000000000}`);
    lines.push(`{2:I700RECEIVERXXXXN}`);
    lines.push(`{3:{108:MT700-${reference}}}`);
    lines.push(`{4:`);
    
    // Process form data and map to SWIFT tags
    const processedTags = new Map<string, string[]>();
    const unmappedFields: { fieldCode: string; value: string }[] = [];
    
    Object.entries(formData).forEach(([fieldCode, value]) => {
      if (!value || value === '') return;
      
      const mapping = SWIFT_TAG_MAPPING[fieldCode.toLowerCase()];
      if (mapping) {
        const existing = processedTags.get(mapping.tag) || [];
        existing.push(String(value));
        processedTags.set(mapping.tag, existing);
      } else {
        // Track unmapped fields for display
        unmappedFields.push({ fieldCode, value: String(value) });
      }
    });
    
    // Add mandatory tag :20 (Documentary Credit Number)
    if (!processedTags.has('20')) {
      lines.push(`:20:${reference}`);
    }
    
    // Sort and output tags in order
    const tagOrder = ['20', '23', '31C', '31D', '40A', '40E', '41a', '42C', '42D', '43P', '43T', 
                      '44E', '44F', '44C', '44D', '50', '52a', '59', '32B', '39A', '39B', '45A', '46A', 
                      '47A', '48', '49', '49G', '53a', '57a', '71B', '78', '72Z'];
    
    tagOrder.forEach(tag => {
      const values = processedTags.get(tag);
      if (values && values.length > 0) {
        const combinedValue = values.join('\n');
        lines.push(`:${tag}:${combinedValue}`);
      }
    });
    
    // Add unmapped fields at the end with a comment-like format
    if (unmappedFields.length > 0) {
      lines.push('');
      lines.push('// Additional Form Data:');
      unmappedFields.forEach(({ fieldCode, value }) => {
        // Convert field_code to readable label
        const label = fieldCode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        lines.push(`// ${label}: ${value}`);
      });
    }
    
    // Close message
    lines.push(`-}`);
    
    return lines.join('\n');
  }, [formData, reference]);

  const downloadMT700 = () => {
    const content = `*** DRAFT - FOR REVIEW ONLY ***\n\n${generateMT700Content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MT700-${reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Collapsed state - show only toggle button
  if (isCollapsed) {
    return (
      <div className="w-12 bg-gradient-to-br from-corporate-teal-50 to-corporate-blue-50 dark:from-corporate-teal-900/20 dark:to-corporate-blue-900/20 border-l border-corporate-teal-200 dark:border-corporate-teal-700 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="text-corporate-teal-700 dark:text-corporate-teal-300 hover:bg-corporate-teal-100 dark:hover:bg-corporate-teal-800"
          title="Expand MT 700 Preview"
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
        <div className="mt-4 flex flex-col items-center gap-2">
          <Eye className="h-4 w-4 text-corporate-teal-600 dark:text-corporate-teal-400" />
          <span className="text-xs font-medium text-corporate-teal-600 dark:text-corporate-teal-400 writing-mode-vertical" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            MT 700
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-gradient-to-br from-corporate-teal-50 to-corporate-blue-50 dark:from-corporate-teal-900/20 dark:to-corporate-blue-900/20 border-l border-corporate-teal-200 dark:border-corporate-teal-700 flex flex-col transition-all duration-300",
      "w-80"
    )}>
      <div className="p-4 border-b border-corporate-teal-200 dark:border-corporate-teal-700 bg-corporate-teal-600 dark:bg-corporate-teal-800">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="h-5 w-5" />
            MT 700 Preview
          </h3>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="border-white/60 text-white/80 bg-white/5 uppercase tracking-[0.15em]">
              Draft
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8"
              title="Collapse sidebar"
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-corporate-teal-100 text-sm mt-1">Live preview of your draft MT 700 message</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-corporate-teal-200 dark:border-corporate-teal-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-corporate-teal-700 dark:text-corporate-teal-300">
              SWIFT MT 700 Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words leading-relaxed">
              {generateMT700Content}
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
          <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-corporate-teal-700 dark:text-corporate-teal-300">
                MT 700 - Documentary Credit Issuance (Draft)
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Preview of your draft MT 700 message. This is for review purposes only.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-end mb-4">
              <Button onClick={downloadMT700}>
                <Download className="h-4 w-4 mr-2" />
                Download MT 700
              </Button>
            </div>
            
            <div className="relative flex-1 overflow-hidden">
              <div className="pointer-events-none absolute top-4 right-6 z-10">
                <span className="inline-flex items-center rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">
                  Draft
                </span>
              </div>
              
              <ScrollArea className="h-full w-full">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words leading-relaxed">
                      {generateMT700Content}
                    </pre>
                  </CardContent>
                </Card>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={downloadMT700} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download Draft
        </Button>
      </div>
    </div>
  );
};

export default DynamicMT700Sidebar;
