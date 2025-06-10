
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { POPIFormData } from '@/hooks/usePOPIForm';

interface SummaryPaneProps {
  formData: POPIFormData;
  updateField: (field: keyof POPIFormData, value: any) => void;
}

const SummaryPane: React.FC<SummaryPaneProps> = ({
  formData,
  updateField
}) => {
  const [dragActive, setDragActive] = useState(false);
  const isPO = formData.instrumentType === 'purchase-order';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency || 'USD'
    }).format(amount);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      updateField('attachments', [...(formData.attachments || []), ...files]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      updateField('attachments', [...(formData.attachments || []), ...files]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Subtotal</Label>
                <div className="mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-md text-sm font-medium">
                  {formatCurrency(formData.subtotal)}
                </div>
              </div>

              <div>
                <Label htmlFor="shippingCost">Shipping Cost</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shippingCost}
                  onChange={(e) => updateField('shippingCost', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Total Tax</Label>
                <div className="mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-md text-sm font-medium">
                  {formatCurrency(formData.totalTax)}
                </div>
              </div>

              <div className="pt-2 border-t">
                <Label>Grand Total</Label>
                <div className="mt-1 px-3 py-2 bg-corporate-teal/10 border-2 border-corporate-teal rounded-md text-lg font-bold text-corporate-teal">
                  {formatCurrency(formData.grandTotal)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="bankDetails">
                  {isPO ? 'Vendor Bank Details' : 'Payment Instructions'}
                </Label>
                <textarea
                  id="bankDetails"
                  value={formData.bankDetails || ''}
                  onChange={(e) => updateField('bankDetails', e.target.value)}
                  placeholder={isPO ? 'Enter vendor bank account details...' : 'Enter payment instructions...'}
                  className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Enter any additional notes or terms..."
                  className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Supporting Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-corporate-teal bg-corporate-teal/5' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="border-corporate-teal text-corporate-teal hover:bg-corporate-teal/10"
            >
              Choose Files
            </Button>
          </div>

          {formData.attachments && formData.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                Uploaded Files ({formData.attachments.length})
              </h4>
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newAttachments = formData.attachments?.filter((_, i) => i !== index);
                        updateField('attachments', newAttachments);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryPane;
