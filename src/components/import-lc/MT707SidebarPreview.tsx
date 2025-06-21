
import React, { useState } from 'react';
import { ImportLCFormData } from '@/types/importLC';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MT707SidebarPreviewProps {
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
}

const MT707SidebarPreview: React.FC<MT707SidebarPreviewProps> = ({ 
  formData, 
  originalData, 
  changes 
}) => {
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);

  const generateMT707Content = () => {
    const amendmentNumber = '01'; // In real app, this would be generated
    
    return `{1:F01TESTBANKAXXX0000000000}
{2:I707RECEIVERXXXXN}
{3:{108:MT707-${formData.corporateReference}-AMD${amendmentNumber}}}
{4:
:20:${formData.corporateReference}-AMD${amendmentNumber}
:21:${originalData.corporateReference}
:23:AMENDMENT
:30:${new Date().toISOString().slice(0, 10).replace(/-/g, '')}
:26E:${amendmentNumber}
${changes.lcAmount ? `:32B:${formData.currency}${formData.lcAmount}` : ''}
${changes.expiryDate ? `:31D:${formData.expiryDate}${formData.placeOfExpiry}` : ''}
${changes.tolerance ? `:39A:${formData.tolerance}` : ''}
${changes.partialShipmentsAllowed ? `:43P:${formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED'}` : ''}
${changes.transshipmentAllowed ? `:43T:${formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED'}` : ''}
${changes.latestShipmentDate ? `:44C:${formData.latestShipmentDate}` : ''}
${changes.descriptionOfGoods ? `:45A:${formData.descriptionOfGoods}` : ''}
${Object.keys(changes).length > 0 ? `:78:AMENDMENT TO DOCUMENTARY CREDIT\nAMENDMENT DETAILS:\n${Object.keys(changes).map(key => `${key.toUpperCase()}: CHANGED`).join('\n')}` : ''}
-}`;
  };

  const downloadMT707 = () => {
    const content = generateMT707Content();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MT707-${formData.corporateReference}-AMD.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-80 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l border-amber-200 dark:border-amber-700 flex flex-col">
      <div className="p-4 border-b border-amber-200 dark:border-amber-700 bg-amber-600 dark:bg-amber-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Eye className="h-5 w-5" />
          MT 707 Preview
        </h3>
        <p className="text-amber-100 text-sm mt-1">Amendment preview</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200 dark:border-amber-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
              SWIFT MT 707 Amendment
            </CardTitle>
            <div className="text-xs text-amber-600 dark:text-amber-400">
              {Object.keys(changes).length} field{Object.keys(changes).length !== 1 ? 's' : ''} changed
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
              {generateMT707Content()}
            </pre>
          </CardContent>
        </Card>
      </ScrollArea>

      <div className="p-4 border-t border-amber-200 dark:border-amber-700 bg-white/50 dark:bg-gray-800/50 space-y-2">
        <Dialog open={isFullPreviewOpen} onOpenChange={setIsFullPreviewOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/20"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              View Full Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-amber-700 dark:text-amber-300">
                MT 707 - Documentary Credit Amendment
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-end mb-4">
              <Button 
                onClick={downloadMT707}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download MT 707
              </Button>
            </div>
            <ScrollArea className="h-[60vh]">
              <pre className="text-sm font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-wrap break-words leading-relaxed">
                {generateMT707Content()}
              </pre>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={downloadMT707}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Draft
        </Button>
      </div>
    </div>
  );
};

export default MT707SidebarPreview;
