import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveAsTemplate } from '@/services/importLCTemplateService';
import { ImportLCFormData } from '@/types/importLC';

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ImportLCFormData;
  userId: string;
}

const SaveTemplateDialog: React.FC<SaveTemplateDialogProps> = ({
  open,
  onOpenChange,
  formData,
  userId
}) => {
  const [templateId, setTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!templateId.trim() || !templateName.trim()) {
      toast({
        title: "Validation Error",
        description: "Template ID and Name are required",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    const result = await saveAsTemplate(
      userId,
      templateId.trim(),
      templateName.trim(),
      templateDescription.trim(),
      formData
    );

    setIsSaving(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
      // Reset form
      setTemplateId('');
      setTemplateName('');
      setTemplateDescription('');
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save template",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save as Template
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateId">Template ID *</Label>
            <Input
              id="templateId"
              placeholder="e.g., TMPL-ILC-001"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              placeholder="e.g., Standard Import LC"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="templateDescription">Description (Optional)</Label>
            <Textarea
              id="templateDescription"
              placeholder="Brief description of this template..."
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateDialog;
