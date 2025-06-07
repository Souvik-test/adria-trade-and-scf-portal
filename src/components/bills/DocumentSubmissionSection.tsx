
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { Document } from './types';

interface DocumentSubmissionSectionProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  remarks: string;
  setRemarks: (value: string) => void;
  declaration: boolean;
  setDeclaration: (value: boolean) => void;
}

const DocumentSubmissionSection: React.FC<DocumentSubmissionSectionProps> = ({
  documents,
  setDocuments,
  remarks,
  setRemarks,
  declaration,
  setDeclaration
}) => {
  const predefinedDocuments = [
    'Commercial Invoice',
    'Packing List', 
    'Bill of Lading',
    'Certificate of Origin',
    'Insurance Certificate',
    'Inspection Certificate'
  ];

  const [selectedDocuments, setSelectedDocuments] = React.useState<string[]>([]);
  const [customDocumentType, setCustomDocumentType] = React.useState('');

  const handleDocumentToggle = (docType: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docType) 
        ? prev.filter(d => d !== docType)
        : [...prev, docType]
    );
  };

  const handleAddCustomDocument = () => {
    if (customDocumentType.trim()) {
      setSelectedDocuments(prev => [...prev, customDocumentType]);
      setCustomDocumentType('');
    }
  };

  return (
    <Card className="border-0 shadow-none bg-background">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-orange-400 mb-6">Document Submission Details</h2>
      </div>
      <CardContent className="p-0">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">
              Documents Submitted <span className="text-red-500">*</span> (SWIFT: :46A:)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {predefinedDocuments.map((docType) => (
                <label key={docType} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(docType)}
                    onChange={() => handleDocumentToggle(docType)}
                    className="w-4 h-4 text-orange-400 border-gray-300 rounded focus:ring-orange-400"
                  />
                  <span className="text-sm text-foreground">{docType}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">
              Custom Document Type
            </Label>
            <div className="flex gap-2">
              <Input
                value={customDocumentType}
                onChange={(e) => setCustomDocumentType(e.target.value)}
                placeholder="Enter custom document type"
                className="flex-1 h-12 border-gray-300 focus:border-orange-400"
              />
              <Button
                onClick={handleAddCustomDocument}
                className="h-12 px-6 bg-orange-400 hover:bg-orange-500 text-white"
              >
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">
              Upload Documents <span className="text-red-500">*</span> (SWIFT: :77A:)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Multiple uploads - With restrictions</p>
                <Button variant="outline" className="mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <p className="text-xs text-red-500">Select documents to enable upload</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="remarks" className="text-sm font-medium text-foreground">
              Remarks / Comments (SWIFT: :72:)
            </Label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional notes (max 200 characters)"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none bg-background focus:border-orange-400 focus:outline-none"
              rows={4}
              maxLength={200}
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="declaration"
              checked={declaration}
              onChange={(e) => setDeclaration(e.target.checked)}
              className="w-4 h-4 text-orange-400 border-gray-300 rounded focus:ring-orange-400 mt-0.5"
            />
            <Label htmlFor="declaration" className="text-sm text-foreground leading-relaxed">
              I declare that the information provided is accurate and I accept the terms and conditions. <span className="text-red-500">*</span>
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentSubmissionSection;
