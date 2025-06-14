
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImportLCFormData } from "@/types/importLC";
import { Loader2, Upload, FilePlus } from "lucide-react";

interface Props {
  docKey: string; // Used for keying, but can be 'custom-X'
  label: string;
  lcId: string;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
  formData: ImportLCFormData;
  isCustom?: boolean; // Show as custom doc
}

const STORAGE_BUCKET = "lc-supporting-documents";

const ImportLCSupportingDocumentUpload: React.FC<Props> = ({
  docKey,
  label,
  lcId,
  updateField,
  formData,
  isCustom = false
}) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setSelectedFile(e.currentTarget.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const filename = `${lcId || "draft"}_${label.replace(/ /g, "_")}_${selectedFile.name}`;
      // Ensure bucket exists (error safe)
      let bucketRes = await supabase.storage.getBucket(STORAGE_BUCKET);
      if (!bucketRes.data) {
        await supabase.storage.createBucket(STORAGE_BUCKET, { public: false });
      }

      // Upload file
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, selectedFile, {
          upsert: true,
        });
      if (error) throw error;

      // Save in form state by replacing prior doc w/ same label
      updateField("supportingDocuments", [
        ...(Array.isArray(formData.supportingDocuments)
          ? formData.supportingDocuments.filter(
              (f: any) => !f.name.startsWith(label)
            )
          : []),
        { name: filename, url: data?.path },
      ]);
      setUploadedUrl(data?.path || null);

      toast({
        title: "Upload Success",
        description: `${label} uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description:
          error?.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className={`rounded-lg bg-gradient-to-br from-white to-corporate-teal-50 dark:from-gray-900 dark:to-corporate-teal-950 p-3 flex flex-col items-start gap-2 w-full border border-corporate-teal-100 shadow ${isCustom ? 'ring-2 ring-corporate-teal-300' : ''}`}>
      <div className="flex items-center gap-2 w-full">
        <FilePlus className={`w-4 h-4 ${isCustom ? 'text-corporate-teal-600' : 'text-corporate-teal-400'}`} />
        <span className={`text-xs font-semibold ${isCustom ? "text-corporate-teal-700" : "text-corporate-teal-600"} truncate`}>
          {label}
        </span>
      </div>
      <div className="flex gap-3 items-center w-full">
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="w-full text-xs"
          disabled={uploading}
        />
        <Button
          size="sm"
          variant="outline"
          className="px-3 border-corporate-teal-600 text-corporate-teal-800"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
        >
          {uploading ? (
            <Loader2 className="animate-spin w-4 h-4 mr-1" />
          ) : (
            <Upload className="w-4 h-4 mr-1" />
          )}
          Upload
        </Button>
      </div>
      {uploadedUrl && (
        <div className="text-xs text-green-700 mt-1 break-all">
          <span className="font-medium">Uploaded:</span> <span className="underline">{uploadedUrl}</span>
        </div>
      )}
    </div>
  );
};

export default ImportLCSupportingDocumentUpload;
