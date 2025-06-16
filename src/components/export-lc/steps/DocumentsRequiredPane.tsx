
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";

const REQUIRED_DOCS = [
  "Copy of Original LC",
  "Transfer Request Letter"
];

const DocumentsRequiredPane = ({ form }: { form: any }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.updateField({ supportingDocuments: files });
  };

  const checkedDocs: Record<string, boolean> = form.form.requiredDocumentsChecked || {};

  const handleCheckDoc = (doc: string, checked: boolean) => {
    form.updateField({
      requiredDocumentsChecked: { ...checkedDocs, [doc]: checked }
    });
  };

  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-md p-8 max-w-none transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-corporate-blue">Required Documents</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="font-medium mb-4 block text-foreground">Required Documents</Label>
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
        </div>

        <div>
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

        <div>
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

export default DocumentsRequiredPane;
