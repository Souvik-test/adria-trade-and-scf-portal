
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

const DocumentsPaneV2 = ({ form }: { form: any }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.updateField({ supportingDocuments: files });
  };

  return (
    <div className="w-full max-w-2xl p-8 bg-white border rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-corporate-blue rounded-full p-2 text-white">
          <Upload className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold">Supporting Documents</h2>
      </div>
      <div className="bg-blue-50 border-2 border-dashed border-blue-200 py-7 px-4 flex items-center justify-center flex-col mb-6 rounded-xl">
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
          className="bg-corporate-blue text-white px-6 py-2 rounded-md shadow hover:bg-corporate-blue/90 mb-2"
        >
          Choose Files
        </button>
        <div className="text-xs text-gray-500">Drag & drop supported documents here, or click to select</div>
      </div>

      <div className="mb-6">
        <Label className="block mb-1 font-medium">Required Documents</Label>
        <ul className="list-disc ml-7 text-sm">
          <li>Copy of Original LC <span className="inline-block bg-orange-200 text-orange-700 px-2 ml-2 rounded-full text-xs">Pending</span></li>
          <li>Transfer Request Letter <span className="inline-block bg-orange-200 text-orange-700 px-2 ml-2 rounded-full text-xs">Pending</span></li>
        </ul>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-xs text-gray-500">
        Ensure all required documents are uploaded as per the transfer guidelines.
      </div>

      <div className="mt-4">
        <Label className="block mb-1 font-medium">Uploaded Documents</Label>
        <ul className="list-disc ml-7 text-sm">
          {(form.form.supportingDocuments || []).length === 0
            ? <li>No files uploaded</li>
            : form.form.supportingDocuments.map((file: File, idx: number) => <li key={idx}>{file.name}</li>)
          }
        </ul>
      </div>
    </div>
  );
};

export default DocumentsPaneV2;
