import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { ImportLCFormData, DocumentRequirement } from '@/types/importLC';
import SwiftTagLabel from './SwiftTagLabel';

interface DocumentRequirementsPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const DocumentRequirementsPane: React.FC<DocumentRequirementsPaneProps> = ({
  formData,
  updateField
}) => {
  const [newDoc, setNewDoc] = useState<DocumentRequirement>({
    name: '',
    original: 1,
    copies: 1
  });

  const addDocument = () => {
    if (newDoc.name.trim()) {
      const updatedDocs = [...formData.documentRequirements, newDoc];
      updateField('documentRequirements', updatedDocs);
      setNewDoc({ name: '', original: 1, copies: 1 });
    }
  };

  const removeDocument = (index: number) => {
    const updatedDocs = formData.documentRequirements.filter((_, i) => i !== index);
    updateField('documentRequirements', updatedDocs);
  };

  const updateDocument = (index: number, field: keyof DocumentRequirement, value: string | number) => {
    const updatedDocs = formData.documentRequirements.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    );
    updateField('documentRequirements', updatedDocs);
  };

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 pr-2">
      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Document Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <SwiftTagLabel tag=":46A:" label="Required Documents" required />
            
            {/* Existing Documents */}
            <div className="space-y-4 mb-4">
              {formData.documentRequirements.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">Document Name</Label>
                      <Input
                        value={doc.name}
                        onChange={(e) => updateDocument(index, 'name', e.target.value)}
                        placeholder="Document name"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Originals</Label>
                      <Input
                        type="number"
                        min="1"
                        value={doc.original}
                        onChange={(e) => updateDocument(index, 'original', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Copies</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={doc.copies}
                          onChange={(e) => updateDocument(index, 'copies', parseInt(e.target.value) || 0)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Document */}
            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">Document Name</Label>
                  <Input
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    placeholder="Enter document name"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Originals</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newDoc.original}
                    onChange={(e) => setNewDoc({ ...newDoc, original: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Copies</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={newDoc.copies}
                      onChange={(e) => setNewDoc({ ...newDoc, copies: parseInt(e.target.value) || 0 })}
                    />
                    <Button
                      onClick={addDocument}
                      className="bg-corporate-blue hover:bg-corporate-blue/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SwiftTagLabel tag=":48:" label="Presentation Period" />
            <Input
              value={formData.presentationPeriod}
              onChange={(e) => updateField('presentationPeriod', e.target.value)}
              placeholder="e.g., 21 days after shipment date"
            />
          </div>

          <div>
            <SwiftTagLabel tag=":47A:" label="Additional Conditions" />
            <Textarea
              value={formData.additionalConditions}
              onChange={(e) => updateField('additionalConditions', e.target.value)}
              placeholder="Enter any additional conditions for the LC"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentRequirementsPane;
