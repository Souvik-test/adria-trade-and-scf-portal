
import React, { useRef } from "react";

const DocumentsPane = ({ form }: { form: any }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.updateField({ supportingDocuments: files });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Supporting Documents</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-1">Required Documents</label>
        <ul className="list-disc ml-7">
          <li>Copy of Original LC</li>
          <li>Transfer Request Letter</li>
        </ul>
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Upload Supporting Documents</label>
        <input
          type="file"
          ref={fileInput}
          multiple
          className="input input-bordered w-full"
          onChange={handleFilesChange}
        />
      </div>
    </div>
  );
};

export default DocumentsPane;
