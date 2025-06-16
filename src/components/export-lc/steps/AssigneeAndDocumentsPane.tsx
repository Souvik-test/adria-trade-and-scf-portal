
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const AssigneeAndDocumentsPane = ({ form }: { form: any }) => {
  const requiredDocuments = [
    "Assignment Notice",
    "Assignee's Bank Details",
    "Copy of LC",
    "Beneficiary's Identity Proof",
    "Assignee's Identity Proof",
    "Power of Attorney (if applicable)",
    "Board Resolution (for corporates)"
  ];

  const handleDocumentCheck = (docName: string, checked: boolean) => {
    const currentChecked = form.form.requiredDocumentsChecked || {};
    form.updateField({
      requiredDocumentsChecked: {
        ...currentChecked,
        [docName]: checked
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    form.updateField({
      supportingDocuments: [...form.form.supportingDocuments, ...files]
    });
  };

  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-md p-8 max-w-none transition-colors">
      {/* Assignee Information Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-corporate-blue mb-4">Assignee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="font-medium mb-1 block text-foreground">Assignee Name *</Label>
            <Input
              value={form.form.assignee.name}
              onChange={e => form.updateAssignee({ name: e.target.value })}
              placeholder="Enter assignee name"
              required
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Country</Label>
            <Input
              value={form.form.assignee.country}
              onChange={e => form.updateAssignee({ country: e.target.value })}
              placeholder="Enter country"
            />
          </div>
          <div className="col-span-full">
            <Label className="font-medium mb-1 block text-foreground">Assignee Address *</Label>
            <Textarea
              value={form.form.assignee.address}
              onChange={e => form.updateAssignee({ address: e.target.value })}
              placeholder="Enter complete address"
              rows={3}
              required
            />
          </div>
        </div>
      </div>

      {/* Banking Information Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-corporate-blue mb-4">Assignee Banking Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="font-medium mb-1 block text-foreground">Bank Name *</Label>
            <Input
              value={form.form.assignee.bankName}
              onChange={e => form.updateAssignee({ bankName: e.target.value })}
              placeholder="Enter bank name"
              required
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">SWIFT Code *</Label>
            <Input
              value={form.form.assignee.swiftCode}
              onChange={e => form.updateAssignee({ swiftCode: e.target.value })}
              placeholder="Enter SWIFT code"
              required
            />
          </div>
          <div className="col-span-full">
            <Label className="font-medium mb-1 block text-foreground">Bank Address</Label>
            <Textarea
              value={form.form.assignee.bankAddress}
              onChange={e => form.updateAssignee({ bankAddress: e.target.value })}
              placeholder="Enter bank address"
              rows={2}
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Account Number *</Label>
            <Input
              value={form.form.assignee.accountNumber}
              onChange={e => form.updateAssignee({ accountNumber: e.target.value })}
              placeholder="Enter account number"
              required
            />
          </div>
        </div>
      </div>

      {/* Required Documents Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-corporate-blue mb-4">Required Documents</h2>
        <div className="space-y-3">
          {requiredDocuments.map((doc) => (
            <div key={doc} className="flex items-center space-x-2">
              <Checkbox
                id={doc}
                checked={form.form.requiredDocumentsChecked?.[doc] || false}
                onCheckedChange={(checked) => handleDocumentCheck(doc, checked as boolean)}
              />
              <Label htmlFor={doc} className="text-sm text-foreground cursor-pointer">
                {doc}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Document Upload Section */}
      <div>
        <h2 className="text-lg font-semibold text-corporate-blue mb-4">Upload Supporting Documents</h2>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, DOCX, JPG, PNG up to 10MB each
            </p>
          </label>
        </div>
        
        {form.form.supportingDocuments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Uploaded Documents:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {form.form.supportingDocuments.map((file: File, index: number) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newDocs = form.form.supportingDocuments.filter((_: File, i: number) => i !== index);
                      form.updateField({ supportingDocuments: newDocs });
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssigneeAndDocumentsPane;
