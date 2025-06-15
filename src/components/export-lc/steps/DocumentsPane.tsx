
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";

const DocumentsPane = ({ form }: { form: any }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.updateField({ supportingDocuments: files });
  };

  return (
    <div className="bg-card border rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">Supporting Documents</h2>
      <div className="mb-4">
        <Label className="block mb-1">Required Documents</Label>
        <ul className="list-disc ml-7 text-sm">
          <li>Copy of Original LC</li>
          <li>Transfer Request Letter</li>
        </ul>
      </div>
      <div>
        <Label className="block mb-1">Upload Supporting Documents</Label>
        <input
          type="file"
          ref={fileInput}
          multiple
          className="block w-full text-sm rounded border border-input file:px-3 file:py-2 file:border-0 file:bg-secondary file:text-foreground"
          onChange={handleFilesChange}
        />
      </div>
    </div>
  );
};

export default DocumentsPane;
