
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
    'Insurance Certificate',
    'Certificate of Origin',
    'Inspection Certificate',
    'Weight Certificate',
    'Beneficiary Certificate'
  ];

  const handleAddDocument = (docType: string, isCustom: boolean = false) => {
    const newDoc: Document = {
      id: Math.random().toString(36).substring(7),
      type: docType,
      documentNo: '',
      documentDate: null,
      file: null,
      isCustom
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const handleDocumentUpdate = (id: string, field: string, value: any) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const handleFileUpload = (id: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, file } : doc
    ));
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg text-primary">
          Section 5: Document Submission Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-4">
          <Label>Documents Submitted * (M) - Multi-select Checkbox</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {predefinedDocuments.map((docType) => (
              <button
                key={docType}
                onClick={() => handleAddDocument(docType)}
                className="p-3 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-accent transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {docType}
              </button>
            ))}
            <button
              onClick={() => handleAddDocument('Custom Document', true)}
              className="p-3 text-sm font-medium rounded-lg border border-dashed border-primary text-primary hover:bg-accent transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Custom Document
            </button>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="space-y-3">
            <Label>Supporting Docs Metadata (M) - Doc type, name, remarks</Label>
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4 border-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium">{doc.type}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`docNo-${doc.id}`}>Document No. * (M)</Label>
                      <Input
                        id={`docNo-${doc.id}`}
                        value={doc.documentNo}
                        onChange={(e) => handleDocumentUpdate(doc.id, 'documentNo', e.target.value)}
                        placeholder="Enter document number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`docDate-${doc.id}`}>Document Date (O)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !doc.documentDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {doc.documentDate ? format(doc.documentDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={doc.documentDate}
                            onSelect={(date) => handleDocumentUpdate(doc.id, 'documentDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`file-${doc.id}`}>Upload Documents (M) - File Upload</Label>
                      <Input
                        id={`file-${doc.id}`}
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(doc.id, e.target.files[0]);
                          }
                        }}
                        disabled={!doc.documentNo}
                        className={!doc.documentNo ? 'opacity-50 cursor-not-allowed' : ''}
                      />
                      {!doc.documentNo && (
                        <p className="text-xs text-muted-foreground">Enter document number first to enable upload</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks / Comments (O) - Optional notes</Label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional notes (max 200 characters)"
            className="w-full p-3 border border-border rounded-lg resize-none bg-background"
            rows={3}
            maxLength={200}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="declaration"
            checked={declaration}
            onChange={(e) => setDeclaration(e.target.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <Label htmlFor="declaration" className="text-sm">
            Declaration (M) - User must accept before submission. I declare that all information provided is accurate and complete.
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentSubmissionSection;
