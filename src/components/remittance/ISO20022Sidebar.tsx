import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Download, Eye, FileCode2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { OutwardRemittanceFormData, FICreditTransferFormData } from '@/types/internationalRemittance';
import { generatePACS008XML, generatePACS009XML, generatePACS009FromPACS008, downloadXML } from '@/utils/iso20022Generator';
import { cn } from '@/lib/utils';

interface ISO20022SidebarProps {
  pacs008Data?: OutwardRemittanceFormData;
  pacs009Data?: FICreditTransferFormData;
  transferType: 'customer' | 'fi';
  settlementMethod?: 'INDA' | 'COVE' | '';
  className?: string;
}

const ISO20022Sidebar: React.FC<ISO20022SidebarProps> = ({
  pacs008Data,
  pacs009Data,
  transferType,
  settlementMethod = '',
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pacs008' | 'pacs009'>('pacs008');

  const showPacs009 = settlementMethod === 'COVE' || transferType === 'fi';
  const isCustomerTransfer = transferType === 'customer';
  const isFITransfer = transferType === 'fi';

  // Generate XML content
  const pacs008XML = useMemo(() => {
    if (pacs008Data && isCustomerTransfer) {
      return generatePACS008XML(pacs008Data);
    }
    return '';
  }, [pacs008Data, isCustomerTransfer]);

  const pacs009XML = useMemo(() => {
    if (pacs009Data && isFITransfer) {
      return generatePACS009XML(pacs009Data);
    }
    if (pacs008Data && settlementMethod === 'COVE') {
      const generatedPacs009 = generatePACS009FromPACS008(pacs008Data);
      return generatePACS009XML(generatedPacs009);
    }
    return '';
  }, [pacs008Data, pacs009Data, isFITransfer, settlementMethod]);

  const handleDownload = (type: 'pacs008' | 'pacs009') => {
    const xml = type === 'pacs008' ? pacs008XML : pacs009XML;
    const filename = type === 'pacs008' 
      ? `PACS008_${pacs008Data?.paymentHeader.msgRef || 'draft'}.xml`
      : `PACS009_${pacs009Data?.settlementHeader.sttlmRef || pacs008Data?.paymentHeader.msgRef || 'draft'}.xml`;
    
    downloadXML(xml, filename);
    toast.success(`${type.toUpperCase()} XML downloaded`);
  };

  const handleCopy = async (type: 'pacs008' | 'pacs009') => {
    const xml = type === 'pacs008' ? pacs008XML : pacs009XML;
    await navigator.clipboard.writeText(xml);
    setCopiedTab(type);
    toast.success('XML copied to clipboard');
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const renderXMLPreview = (xml: string, maxLines: number = 30) => {
    const lines = xml.split('\n').slice(0, maxLines);
    return lines.join('\n') + (xml.split('\n').length > maxLines ? '\n...' : '');
  };

  // Collapsed state - narrow bar
  if (isCollapsed) {
    return (
      <div className={cn(
        "w-10 border-l bg-muted/30 flex flex-col items-center py-4 gap-2",
        className
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="h-8 w-8"
          title="Expand ISO 20022 Preview"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-2 mt-4">
          <FileCode2 className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground [writing-mode:vertical-lr] rotate-180">
            ISO 20022
          </span>
        </div>
      </div>
    );
  }

  // Expanded state - full sidebar
  return (
    <div className={cn(
      "w-80 border-l bg-muted/10 flex flex-col",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">ISO 20022 Preview</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs for PACS.008 and PACS.009 */}
      <Tabs 
        value={isFITransfer ? 'pacs009' : activeTab} 
        onValueChange={(v) => setActiveTab(v as 'pacs008' | 'pacs009')}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-3 mt-3 grid grid-cols-2">
          {isCustomerTransfer && (
            <TabsTrigger value="pacs008" className="text-xs">PACS.008</TabsTrigger>
          )}
          {(showPacs009 || isFITransfer) && (
            <TabsTrigger value="pacs009" className="text-xs">PACS.009</TabsTrigger>
          )}
          {isCustomerTransfer && !showPacs009 && (
            <TabsTrigger value="pacs009" disabled className="text-xs opacity-50">
              PACS.009
            </TabsTrigger>
          )}
        </TabsList>

        {/* PACS.008 Content */}
        {isCustomerTransfer && (
          <TabsContent value="pacs008" className="flex-1 flex flex-col m-0 p-3 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View Full
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>PACS.008 - Customer Credit Transfer</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh]">
                    <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-x-auto whitespace-pre">
                      {pacs008XML}
                    </pre>
                  </ScrollArea>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleCopy('pacs008')}>
                      {copiedTab === 'pacs008' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copiedTab === 'pacs008' ? 'Copied' : 'Copy'}
                    </Button>
                    <Button size="sm" onClick={() => handleDownload('pacs008')}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleDownload('pacs008')}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
            <ScrollArea className="flex-1 rounded-md border bg-muted/50">
              <pre className="text-[10px] font-mono p-2 whitespace-pre leading-relaxed">
                {renderXMLPreview(pacs008XML)}
              </pre>
            </ScrollArea>
            {settlementMethod === 'COVE' && (
              <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-600">
                COVE settlement: PACS.009 will be auto-generated
              </div>
            )}
          </TabsContent>
        )}

        {/* PACS.009 Content */}
        <TabsContent value="pacs009" className="flex-1 flex flex-col m-0 p-3 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View Full
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>PACS.009 - FI Credit Transfer</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-x-auto whitespace-pre">
                    {pacs009XML}
                  </pre>
                </ScrollArea>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleCopy('pacs009')}>
                    {copiedTab === 'pacs009' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copiedTab === 'pacs009' ? 'Copied' : 'Copy'}
                  </Button>
                  <Button size="sm" onClick={() => handleDownload('pacs009')}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => handleDownload('pacs009')}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="flex-1 rounded-md border bg-muted/50">
            <pre className="text-[10px] font-mono p-2 whitespace-pre leading-relaxed">
              {renderXMLPreview(pacs009XML)}
            </pre>
          </ScrollArea>
          {isCustomerTransfer && settlementMethod === 'COVE' && (
            <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-600">
              Auto-generated from PACS.008 (Cover Payment)
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ISO20022Sidebar;
