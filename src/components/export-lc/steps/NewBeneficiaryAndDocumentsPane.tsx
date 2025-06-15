
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";

const REQUIRED_DOCS = [
  "Copy of Original LC",
  "Transfer Request Letter"
];

const NewBeneficiaryAndDocumentsPane = ({ form }: { form: any }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.updateField({ supportingDocuments: files });
  };

  // Keep a checked state for each required doc in form.form for persistence if desired
  const checkedDocs: Record<string, boolean> = form.form.requiredDocumentsChecked || {};

  const handleCheckDoc = (doc: string, checked: boolean) => {
    form.updateField({
      requiredDocumentsChecked: { ...checkedDocs, [doc]: checked }
    });
  };

  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-md p-8 max-w-none transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-corporate-blue">New Beneficiary & Documents Required</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Beneficiary Info */}
        <div>
          <Label className="font-medium mb-1 block text-foreground">Beneficiary Name</Label>
          <Input
            value={form.form.newBeneficiary.name}
            onChange={e => form.updateNewBeneficiary({ name: e.target.value })}
          />
          <Label className="font-medium mb-1 mt-4 block text-foreground">Address</Label>
          <Textarea
            value={form.form.newBeneficiary.address}
            onChange={e => form.updateNewBeneficiary({ address: e.target.value })}
            className="min-h-[70px]"
          />
          <Label className="font-medium mb-1 mt-4 block text-foreground">Country</Label>
          <select className="block w-full border border-border rounded-md px-3 py-2 mt-1 bg-background text-foreground"
            value={form.form.newBeneficiary.country || ""}
            onChange={e => form.updateNewBeneficiary({ country: e.target.value })}>
            <option value="">Select Country</option>
            <option>India</option>
            <option>United States</option>
            <option>UAE</option>
          </select>
          <div className="mt-6 font-semibold text-foreground">Banking Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label className="font-medium text-foreground">Bank Name</Label>
              <Input
                value={form.form.newBeneficiary.bankName}
                onChange={e => form.updateNewBeneficiary({ bankName: e.target.value })}
              />
            </div>
            <div>
              <Label className="font-medium text-foreground">Bank Address</Label>
              <Textarea
                value={form.form.newBeneficiary.bankAddress}
                onChange={e => form.updateNewBeneficiary({ bankAddress: e.target.value })}
                className="min-h-[50px]"
              />
            </div>
            <div>
              <Label className="font-medium text-foreground">SWIFT Code</Label>
              <Input
                value={form.form.newBeneficiary.swiftCode}
                onChange={e => form.updateNewBeneficiary({ swiftCode: e.target.value })}
              />
            </div>
            <div>
              <Label className="font-medium text-foreground">Account Number</Label>
              <Input
                value={form.form.newBeneficiary.accountNumber}
                onChange={e => form.updateNewBeneficiary({ accountNumber: e.target.value })}
              />
            </div>
          </div>
        </div>
        {/* Documents Required */}
        <div className="flex flex-col h-full">
          <Label className="font-medium mb-2 block text-foreground">Required Documents</Label>
          <ul className="space-y-3 mb-6">
            {REQUIRED_DOCS.map((doc) => (
              <li key={doc} className="flex items-center gap-2">
                <Checkbox
                  checked={!!checkedDocs[doc]}
                  onCheckedChange={(checked: boolean) => handleCheckDoc(doc, checked)}
                  id={doc}
                />
                <label htmlFor={doc} className="text-foreground text-sm font-medium cursor-pointer">{doc}</label>
              </li>
            ))}
          </ul>
          <div className="mb-6">
            <Label className="block mb-1 font-medium text-foreground">Custom Document Upload</Label>
            <input
              type="file"
              ref={fileInput}
              multiple
              id="supporting-documents-upload"
              className="hidden"
              onChange={handleFilesChange}
            />
            <button
              onClick={() => fileInput.current?.click()}
              type="button"
              className="bg-corporate-blue text-white px-4 py-2 rounded-md shadow hover:bg-corporate-blue/90 mb-2 transition-colors"
            >
              <Upload className="inline mr-1 -mt-1" /> Choose Files
            </button>
            <div className="text-xs text-muted-foreground">Upload additional documents as needed.</div>
          </div>
          <Label className="block mb-1 font-medium text-foreground">Uploaded Documents</Label>
          <ul className="list-disc ml-6 text-sm mb-0 text-foreground">
            {(form.form.supportingDocuments || []).length === 0
              ? <li className="text-muted-foreground">No files uploaded</li>
              : form.form.supportingDocuments.map((file: File, idx: number) => <li key={idx}>{file.name}</li>)
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewBeneficiaryAndDocumentsPane;
