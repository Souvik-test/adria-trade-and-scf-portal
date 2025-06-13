
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { ImportLCFormData, DocumentRequirement } from '@/types/importLC';

interface DocumentRequirementsPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const DocumentRequirementsPane: React.FC<DocumentRequirementsPaneProps> = ({
  formData,
  updateField
}) => {
  const [newDocumentName, setNewDocumentName] = useState('');

  const standardDocuments = [
    'Commercial Invoice',
    'Packing List',
    'Bill of Lading',
    'Certificate of Origin',
    'Insurance Certificate',
    'Quality Certificate',
    'Inspection Certificate',
    'Weight Certificate',
    'Fumigation Certificate',
    'Health Certificate'
  ];

  const addDocument = (documentName?: string) => {
    const name = documentName || newDocumentName;
    if (!name.trim()) return;

    const newDoc: DocumentRequirement = {
      id: Date.now().toString(),
      name: name.trim(),
      original: 1,
      copies: 0
    };

    updateField('documentRequirements', [...formData.documentRequirements, newDoc]);
    setNewDocumentName('');
  };

  const removeDocument = (id: string) => {
    updateField('documentRequirements', 
      formData.documentRequirements.filter(doc => doc.id !== id)
    );
  };

  const updateDocument = (id: string, field: keyof DocumentRequirement, value: string | number) => {
    updateField('documentRequirements',
      formData.documentRequirements.map(doc => 
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    );
  };

  const formatDocumentDisplay = (doc: DocumentRequirement) => {
    const originalText = doc.original === 1 ? '1 Original' : `${doc.original} Originals`;
    const copyText = doc.copies === 0 ? '' : doc.copies === 1 ? ', 1 Copy' : `, ${doc.copies} Copies`;
    return `${doc.name} - ${originalText}${copyText}`;
  };

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 pr-2">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Document Requirements</h3>
        
        {/* Quick Add Standard Documents */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick Add Standard Documents
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {standardDocuments.map((doc) => (
              <Button
                key={doc}
                onClick={() => addDocument(doc)}
                variant="outline"
                size="sm"
                className="text-xs h-8 justify-start"
                disabled={formData.documentRequirements.some(d => d.name === doc)}
              >
                {doc}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Document Addition */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="customDocument">Add Custom Document</Label>
          <div className="flex gap-2">
            <Input
              id="customDocument"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              placeholder="Enter document name"
              onKeyPress={(e) => e.key === 'Enter' && addDocument()}
            />
            <Button onClick={() => addDocument()} disabled={!newDocumentName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Document Requirements List */}
        <div className="space-y-4">
          {formData.documentRequirements.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No documents added yet. Add documents using the buttons above.
              </p>
            </div>
          ) : (
            formData.documentRequirements.map((doc) => (
              <div key={doc.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">{doc.name}</Label>
                    <p className="text-xs text-gray-500 mt-1">{formatDocumentDisplay(doc)}</p>
                  </div>
                  <Button
                    onClick={() => removeDocument(doc.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`original-${doc.id}`} className="text-xs">Original(s)</Label>
                    <Input
                      id={`original-${doc.id}`}
                      type="number"
                      min="0"
                      value={doc.original}
                      onChange={(e) => updateDocument(doc.id, 'original', parseInt(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`copies-${doc.id}`} className="text-xs">Copy/Copies</Label>
                    <Input
                      id={`copies-${doc.id}`}
                      type="number"
                      min="0"
                      value={doc.copies}
                      onChange={(e) => updateDocument(doc.id, 'copies', parseInt(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="additionalConditions">Additional Conditions</Label>
        <Textarea
          id="additionalConditions"
          value={formData.additionalConditions}
          onChange={(e) => updateField('additionalConditions', e.target.value)}
          placeholder="Enter any additional conditions or special instructions"
          rows={4}
        />
      </div>
    </div>
  );
};

export default DocumentRequirementsPane;
