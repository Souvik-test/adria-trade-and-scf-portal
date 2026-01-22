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

// Normalize field code for matching (handle double spaces, case variations)
const normalizeFieldCode = (code: string): string => {
  return (code || '')
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace any whitespace with underscore
    .replace(/_+/g, '_')  // Collapse multiple underscores
    .trim();
};

// Mapping of normalized field codes to SWIFT tags for MT 700
// Keys should be normalized versions of field codes
const SWIFT_TAG_MAPPING: Record<string, { tag: string; label: string }> = {
  // Tag 20 - Documentary Credit Number
  corporate_reference: { tag: '20', label: 'Documentary Credit Number' },
  lc_reference: { tag: '20', label: 'Documentary Credit Number' },
  lc_number: { tag: '20', label: 'Documentary Credit Number' },
  documentary_credit_number: { tag: '20', label: 'Documentary Credit Number' },
  
  // Tag 31C - Date of Issue
  issue_date: { tag: '31C', label: 'Date of Issue' },
  date_of_issue: { tag: '31C', label: 'Date of Issue' },
  
  // Tag 31D - Date and Place of Expiry
  expiry_date: { tag: '31D', label: 'Date and Place of Expiry' },
  place_of_expiry: { tag: '31D', label: 'Date and Place of Expiry' },
  
  // Tag 40A - Form of Documentary Credit
  form_of_documentary_credit: { tag: '40A', label: 'Form of Documentary Credit' },
  transferable_flag: { tag: '40A', label: 'Form of Documentary Credit' },
  
  // Tag 40E - Applicable Rules  
  applicable_rules: { tag: '40E', label: 'Applicable Rules' },
  
  // Tag 41D - Available With/By
  available_with: { tag: '41D', label: 'Available With' },
  availability_method: { tag: '41D', label: 'Available With...By' },
  
  // Tag 42C - Drafts at (Tenor)
  lc_type: { tag: '42C', label: 'Drafts at' },
  drafts_at: { tag: '42C', label: 'Drafts at' },
  tenor: { tag: '42C', label: 'Drafts at' },
  
  // Tag 42D - Drawee
  drawee: { tag: '42D', label: 'Drawee' },
  
  // Tag 43P - Partial Shipments
  partial_shipments: { tag: '43P', label: 'Partial Shipments' },
  partial_shipments_allowed: { tag: '43P', label: 'Partial Shipments' },
  partial_shipment_allowed: { tag: '43P', label: 'Partial Shipments' },
  
  // Tag 43T - Transshipment
  transshipment: { tag: '43T', label: 'Transshipment' },
  transshipment_allowed: { tag: '43T', label: 'Transshipment' },
  
  // Tag 44E - Port of Loading
  port_of_loading: { tag: '44E', label: 'Port of Loading/Airport of Departure' },
  loading_port: { tag: '44E', label: 'Port of Loading/Airport of Departure' },
  
  // Tag 44F - Port of Discharge
  port_of_discharge: { tag: '44F', label: 'Port of Discharge/Airport of Destination' },
  discharge_port: { tag: '44F', label: 'Port of Discharge/Airport of Destination' },
  
  // Tag 44C - Latest Date of Shipment
  latest_shipment_date: { tag: '44C', label: 'Latest Date of Shipment' },
  
  // Tag 44D - Shipment Period
  shipment_period: { tag: '44D', label: 'Shipment Period' },
  
  // Tag 50 - Applicant
  applicant_name: { tag: '50', label: 'Applicant' },
  applicant_address: { tag: '50', label: 'Applicant' },
  applicant: { tag: '50', label: 'Applicant' },
  
  // Tag 52a - Issuing Bank
  issuing_bank: { tag: '52a', label: 'Issuing Bank' },
  issuing_bank_name: { tag: '52a', label: 'Issuing Bank' },
  
  // Tag 57a - Advise Through Bank
  advising_bank: { tag: '57a', label: 'Advise Through Bank' },
  advising_bank_name: { tag: '57a', label: 'Advise Through Bank' },
  advising_bank_swift_code: { tag: '57a', label: 'Advise Through Bank' },
  beneficiary_bank_name: { tag: '57a', label: 'Advise Through Bank' },
  beneficiary_bank_swift_code: { tag: '57a', label: 'Advise Through Bank' },
  
  // Tag 59 - Beneficiary
  beneficiary_name: { tag: '59', label: 'Beneficiary' },
  beneficiary_address: { tag: '59', label: 'Beneficiary' },
  beneficiary: { tag: '59', label: 'Beneficiary' },
  
  // Tag 32B - Currency Code, Amount
  currency: { tag: '32B', label: 'Currency Code, Amount' },
  lc_amount: { tag: '32B', label: 'Currency Code, Amount' },
  amount: { tag: '32B', label: 'Currency Code, Amount' },
  lc_currency: { tag: '32B', label: 'Currency Code, Amount' },
  
  // Tag 39A - Percentage Credit Amount Tolerance
  tolerance: { tag: '39A', label: 'Percentage Credit Amount Tolerance' },
  tolerance_percentage: { tag: '39A', label: 'Percentage Credit Amount Tolerance' },
  positive_tolerance: { tag: '39A', label: 'Percentage Credit Amount Tolerance' },
  negative_tolerance: { tag: '39A', label: 'Percentage Credit Amount Tolerance' },
  
  // Tag 39B - Maximum Credit Amount
  additional_amount: { tag: '39B', label: 'Maximum Credit Amount' },
  max_credit_amount: { tag: '39B', label: 'Maximum Credit Amount' },
  
  // Tag 45A - Description of Goods
  description_of_goods: { tag: '45A', label: 'Description of Goods and/or Services' },
  goods_description: { tag: '45A', label: 'Description of Goods and/or Services' },
  
  // Tag 46A - Documents Required
  documents_required: { tag: '46A', label: 'Documents Required' },
  required_documents: { tag: '46A', label: 'Documents Required' },
  document_type: { tag: '46A', label: 'Documents Required' },
  
  // Tag 47A - Additional Conditions
  additional_conditions: { tag: '47A', label: 'Additional Conditions' },
  
  // Tag 48 - Period for Presentation
  presentation_period: { tag: '48', label: 'Period for Presentation' },
  presentation_period_days: { tag: '48', label: 'Period for Presentation' },
  
  // Tag 49 - Confirmation Instructions
  confirmation_instructions: { tag: '49', label: 'Confirmation Instructions' },
  confirm_instructions: { tag: '49', label: 'Confirmation Instructions' },
  
  // Tag 49G - Special Payment Conditions
  special_payment_conditions: { tag: '49G', label: 'Special Payment Conditions for Beneficiary' },
  
  // Tag 53a - Reimbursing Bank
  reimbursing_bank: { tag: '53a', label: 'Reimbursing Bank' },
  
  // Tag 71B - Charges
  charges: { tag: '71B', label: 'Charges' },
  bank_charges: { tag: '71B', label: 'Charges' },
  
  // Tag 78 - Instructions to Paying Bank
  instructions_to_paying_bank: { tag: '78', label: 'Instructions to Paying/Accepting/Negotiating Bank' },
  
  // Tag 72Z - Sender to Receiver Information
  sender_to_receiver_info: { tag: '72Z', label: 'Sender to Receiver Information' },
};

// Fields to exclude from MT 700 preview (internal/system fields)
const EXCLUDED_FIELD_PATTERNS = [
  /^facility_/i,          // Limit check fields
  /^transaction_amount/i, // Internal transaction fields
  /^transaction_currency/i,
  /^fx_rate/i,
  /^exposure_/i,
  /^is_documentary/i,
  /^limit_/i,
  /^sanction_/i,
  /^accounting_/i,
  /^status$/i,
  /^created_/i,
  /^updated_/i,
  /^user_id$/i,
  /^id$/i,
];

const DynamicMT700Sidebar: React.FC<DynamicMT700SidebarProps> = ({
  formData,
  productCode,
  eventCode,
  referenceField = 'corporate_reference',
}) => {
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Find reference value with normalized matching
  const reference = useMemo(() => {
    const refVariants = [referenceField, 'lc_reference', 'corporate_reference', 'lc_number', 'LC  Number', 'Corporate  Reference'];
    for (const variant of refVariants) {
      const normalized = normalizeFieldCode(variant);
      for (const [key, value] of Object.entries(formData)) {
        if (normalizeFieldCode(key) === normalized && value) {
          return String(value);
        }
      }
    }
    return 'DRAFT';
  }, [formData, referenceField]);

  const generateMT700Content = useMemo(() => {
    const lines: string[] = [];
    
    // SWIFT MT 700 Message Structure
    lines.push(`{1:F01BANKXXXXAXXX0000000000}`);
    lines.push(`{2:I700RECEIVERXXXXN}`);
    lines.push(`{3:{108:MT700-${reference}}}`);
    lines.push(`{4:`);
    
    // Process form data and map to SWIFT tags
    const processedTags = new Map<string, { label: string; values: string[] }>();
    
    Object.entries(formData).forEach(([fieldCode, value]) => {
      if (!value || value === '' || value === null || value === undefined) return;
      
      // Normalize the field code for matching
      const normalizedCode = normalizeFieldCode(fieldCode);
      
      // Skip excluded fields
      if (EXCLUDED_FIELD_PATTERNS.some(pattern => pattern.test(normalizedCode))) {
        return;
      }
      
      const mapping = SWIFT_TAG_MAPPING[normalizedCode];
      if (mapping) {
        const existing = processedTags.get(mapping.tag) || { label: mapping.label, values: [] };
        existing.values.push(String(value));
        processedTags.set(mapping.tag, existing);
      }
      // Unmapped fields are intentionally not shown - MT 700 should only contain SWIFT-tagged fields
    });
    
    // Add mandatory tag :20 (Documentary Credit Number) if not present
    if (!processedTags.has('20')) {
      processedTags.set('20', { label: 'Documentary Credit Number', values: [reference] });
    }
    
    // SWIFT MT 700 tag order as per standard
    const tagOrder = [
      '20',   // Documentary Credit Number (M)
      '23',   // Reference to Pre-Advice
      '31C',  // Date of Issue (M)
      '31D',  // Date and Place of Expiry (M)
      '40A',  // Form of Documentary Credit (M)
      '40E',  // Applicable Rules (M)
      '41D',  // Available With...By (M)
      '42C',  // Drafts at
      '42D',  // Drawee
      '43P',  // Partial Shipments
      '43T',  // Transshipment
      '44A',  // Place of Taking in Charge
      '44E',  // Port of Loading
      '44F',  // Port of Discharge
      '44B',  // Place of Final Destination
      '44C',  // Latest Date of Shipment
      '44D',  // Shipment Period
      '50',   // Applicant (M)
      '52a',  // Issuing Bank
      '59',   // Beneficiary (M)
      '32B',  // Currency Code, Amount (M)
      '39A',  // Percentage Credit Amount Tolerance
      '39B',  // Maximum Credit Amount
      '45A',  // Description of Goods (M)
      '46A',  // Documents Required (M)
      '47A',  // Additional Conditions
      '48',   // Period for Presentation
      '49',   // Confirmation Instructions
      '49G',  // Special Payment Conditions
      '53a',  // Reimbursing Bank
      '57a',  // Advise Through Bank
      '71B',  // Charges
      '78',   // Instructions to Paying/Negotiating Bank
      '72Z',  // Sender to Receiver Information
    ];
    
    // Output tags in proper SWIFT order
    tagOrder.forEach(tag => {
      const data = processedTags.get(tag);
      if (data && data.values.length > 0) {
        // Combine values with line breaks for multi-value fields
        const combinedValue = data.values.join('\n');
        lines.push(`:${tag}:${combinedValue}`);
      }
    });
    
    // Close message block
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
      <div className="w-12 bg-gradient-to-br from-primary/5 to-secondary/10 dark:from-primary/10 dark:to-secondary/10 border-l border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="text-primary hover:bg-primary/10"
          title="Expand MT 700 Preview"
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
        <div className="mt-4 flex flex-col items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary writing-mode-vertical" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            MT 700
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-gradient-to-br from-muted/50 to-secondary/30 dark:from-muted/20 dark:to-secondary/20 border-l border-border flex flex-col transition-all duration-300",
      "w-80"
    )}>
      <div className="p-4 border-b border-border bg-primary dark:bg-primary">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
            <Eye className="h-5 w-5" />
            MT 700 Preview
          </h3>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="border-primary-foreground/60 text-primary-foreground/80 bg-primary-foreground/5 uppercase tracking-[0.15em]">
              Draft
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
              title="Collapse sidebar"
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-primary-foreground/70 text-sm mt-1">Live preview of your draft MT 700 message</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground">
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

      <div className="p-4 border-t border-border bg-card/50 space-y-2">
        <Dialog open={isFullPreviewOpen} onOpenChange={setIsFullPreviewOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              View Full Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-foreground">
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
