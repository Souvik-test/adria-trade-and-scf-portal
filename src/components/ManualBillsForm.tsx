
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Upload, X, Edit2, Trash2, ArrowLeft, Maximize2, Minimize2, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface UploadedDocument {
  id: string;
  type: string;
  file: File;
  documentId: string;
  documentDate: Date | null;
}

interface ManualBillsFormProps {
  onBack: () => void;
  onClose: () => void;
}

const ManualBillsForm: React.FC<ManualBillsFormProps> = ({ onBack, onClose }) => {
  const [submissionType, setSubmissionType] = useState('');
  const [submissionDate, setSubmissionDate] = useState<Date | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState('');
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);

  const documentTypes = [
    'Commercial Invoice',
    'Packing List',
    'Bill of Lading',
    'Insurance Certificate',
    'Certificate of Origin',
    'Inspection Certificate',
    'Weight Certificate',
    'Beneficiary Certificate',
    'Transport Document',
    'Other Document'
  ];

  const submissionTypes = [
    'First Presentation',
    'Second Presentation',
    'Amendment Response',
    'Discrepancy Response'
  ];

  const handleDocumentTypeClick = (docType: string) => {
    setNewDocumentType(docType);
    setIsUploadDialogOpen(true);
  };

  const handleUploadDocument = () => {
    if (newDocumentType && newDocumentFile) {
      const newDocument: UploadedDocument = {
        id: Math.random().toString(36).substring(7),
        type: newDocumentType,
        file: newDocumentFile,
        documentId: Math.random().toString(36).substring(7),
        documentDate: new Date(),
      };
      setUploadedDocuments(prev => [...prev, newDocument]);
      setIsUploadDialogOpen(false);
      setNewDocumentType('');
      setNewDocumentFile(null);
    }
  };

  const removeDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleSubmit = () => {
    console.log('Submission Type:', submissionType);
    console.log('Submission Date:', submissionDate);
    console.log('Uploaded Documents:', uploadedDocuments);
    alert('Bills submitted successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Bills under Export LC Management
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Submission Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">
                Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="submissionType">Submission Type</Label>
                  <Select value={submissionType} onValueChange={setSubmissionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select submission type" />
                    </SelectTrigger>
                    <SelectContent>
                      {submissionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="submissionDate">Submission Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !submissionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {submissionDate ? format(submissionDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={submissionDate}
                        onSelect={setSubmissionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {documentTypes.map((docType) => {
                  const isUploaded = uploadedDocuments.some(doc => doc.type === docType);
                  return (
                    <button
                      key={docType}
                      onClick={() => handleDocumentTypeClick(docType)}
                      className={cn(
                        "p-3 text-sm font-medium rounded-lg border transition-all duration-200 flex items-center justify-center gap-2",
                        isUploaded
                          ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-corporate-peach-50 hover:border-corporate-peach-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      )}
                    >
                      {isUploaded ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {docType}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          {uploadedDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-corporate-peach-500" />
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-white">
                            {doc.type}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {doc.file.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="px-8"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-corporate-peach-500 hover:bg-corporate-peach-600 text-white px-8"
              disabled={!submissionType || !submissionDate || uploadedDocuments.length === 0}
            >
              Submit Bills
            </Button>
          </div>
        </div>

        {/* Upload Document Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload {newDocumentType}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="documentFile" className="text-right">
                  Document File
                </Label>
                <Input
                  type="file"
                  id="documentFile"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setNewDocumentFile(e.target.files[0]);
                    }
                  }}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleUploadDocument} disabled={!newDocumentFile}>
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManualBillsForm;
