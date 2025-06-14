
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImportLCFormData } from "@/types/importLC";
import { Loader2, Upload } from "lucide-react";

interface Props {
  docKey: string;
  label: string;
  lcId: string;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
  formData: ImportLCFormData;
}

const STORAGE_BUCKET = "lc-supporting-documents";

const ImportLCSupportingDocumentUpload: React.FC<Props> = ({
  docKey,
  label,
  lcId,
  updateField,
  formData
}) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Helper to return the path in form state, if exists (in case of restore from draft)
  const getDefaultValue = (): string | undefined => {
    const found = Array.isArray(formData.supportingDocuments)
      ? formData.supportingDocuments.find(
          (f: any) => f && f.name && f.name.startsWith(label)
        )
      : undefined;
    return found ? found.name : undefined;
  };

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
      // Make bucket if not exists
      let bucketRes = await supabase.storage.getBucket(STORAGE_BUCKET);
      if (!bucketRes.data) {
        await supabase.storage.createBucket(STORAGE_BUCKET, { public: false });
      }

      // Upload the file
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, selectedFile, {
          upsert: true,
        });
      if (error) throw error;

      // Save file info in formData (you may want to persist to DB in real case)
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
    <div>
      <Label className="text-sm mb-1 block">{label}</Label>
      <div className="flex gap-2 items-center">
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="flex-1"
          disabled={uploading}
        />
        <Button
          size="sm"
          variant="outline"
          className="px-3"
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
          Uploaded: <span className="underline">{uploadedUrl}</span>
        </div>
      )}
    </div>
  );
};

export default ImportLCSupportingDocumentUpload;
