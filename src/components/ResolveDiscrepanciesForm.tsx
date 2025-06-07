
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Moon, Sun, Upload, Edit, Trash2, FileText, Calendar, MoveUpRight, MoveDownLeft, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResolveDiscrepanciesFormProps {
  onClose: () => void;
  onBack: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
}

const ResolveDiscrepanciesForm: React.FC<ResolveDiscrepanciesFormProps> = ({ onClose, onBack }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Form state
  const [resolutionStatus, setResolutionStatus] = useState<string>('');
  const [documentReuploadRequired, setDocumentReuploadRequired] = useState<string>('');
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const documentTypes = [
    'Commercial Invoice',
    'Packing List', 
    'Bill of Lading/AWB',
    'Certificate of Origin',
    'Insurance Certificate',
    'Inspection Certificate'
  ];

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleDocumentSelect = (docType: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, docType]);
    } else {
      setSelectedDocuments(prev => prev.filter(doc => doc !== docType));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument: UploadedDocument = {
        id: Date.now().toString(),
        name: file.name,
        reference: '',
        date: new Date().toISOString().split('T')[0],
        type: docType
      };
      setUploadedDocuments([...uploadedDocuments, newDocument]);
    }
  };

  const handleCustomDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (customDocumentName.trim()) {
      handleFileUpload(event, customDocumentName);
      setCustomDocumentName('');
    }
  };

  const handleDocumentEdit = (id: string, field: string, value: string) => {
    setUploadedDocuments(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    );
  };

  const handleDocumentDelete = (id: string) => {
    setUploadedDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (resolutionStatus === 'resolved' && !resolutionRemarks.trim()) {
      errors.push('Resolution remarks are required when status is resolved');
    }

    if (documentReuploadRequired === 'yes' && uploadedDocuments.length === 0) {
      errors.push('At least one document must be uploaded when document re-upload is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted successfully');
      // Handle form submission
    }
  };

  const handleDiscard = () => {
    onBack();
  };

  const handleSaveAsDraft = () => {
    console.log('Saved as draft');
    // Handle save as draft
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className={`${isExpanded ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-7xl max-h-[90vh]'} overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300`}>
          <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Resolve Discrepancies
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2"
                >
                  {isExpanded ? <MoveDownLeft className="w-4 h-4" /> : <MoveUpRight className="w-4 h-4" />}
                  {isExpanded ? 'Collapse' : 'Expand'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleDarkMode}
                  className="flex items-center gap-2"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {darkMode ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
            <div className="flex gap-6 p-6">
              {/* Left Panel - Uploaded Documents */}
              {uploadedDocuments.length > 0 && (
                <div className="w-1/3 space-y-4">
                  <Card className="border border-gray-200 dark:border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                        Uploaded Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {uploadedDocuments.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                {doc.name}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingDocument(editingDocument === doc.id ? null : doc.id)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDocumentDelete(doc.id)}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          
                          {editingDocument === doc.id && (
                            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <div>
                                <Label className="text-xs text-gray-600 dark:text-gray-400">Document Reference</Label>
                                <Input
                                  value={doc.reference}
                                  onChange={(e) => handleDocumentEdit(doc.id, 'reference', e.target.value)}
                                  className="h-8 text-xs"
                                  placeholder="Enter reference"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600 dark:text-gray-400">Document Date</Label>
                                <Input
                                  type="date"
                                  value={doc.date}
                                  onChange={(e) => handleDocumentEdit(doc.id, 'date', e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Type: {doc.type}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Right Panel - Form */}
              <div className={`${uploadedDocuments.length > 0 ? 'flex-1' : 'w-full'} space-y-6`}>
                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="text-red-800 dark:text-red-200 text-sm">
                      <p className="font-medium mb-2">Please fix the following errors:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Discrepancy Summary Section */}
                <Card className="border border-gray-200 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                      Discrepancy Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Reference Number</Label>
                        <div className="relative mt-1">
                          <Input placeholder="Search LC Reference" className="pr-10" />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill Reference Number</Label>
                        <div className="relative mt-1">
                          <Input placeholder="Search Bill Reference" className="pr-10" />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Corporate Reference Number</Label>
                        <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Buyer/Applicant Name</Label>
                        <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issuing Bank Name</Label>
                        <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discrepancy Notification Date</Label>
                        <Input type="date" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Discrepancy Details Section */}
                <Card className="border border-gray-200 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                      Discrepancy Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discrepancy Type</Label>
                        <Input placeholder="Enter discrepancy type" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Type</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="invoice">Invoice</SelectItem>
                            <SelectItem value="bl">Bill of Lading</SelectItem>
                            <SelectItem value="packing">Packing List</SelectItem>
                            <SelectItem value="inspection">Inspection Certificate</SelectItem>
                            <SelectItem value="awb">AWB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discrepancy Description</Label>
                      <Textarea 
                        className="mt-1" 
                        rows={4}
                        placeholder="Enter discrepancy description (max 500 characters)"
                        maxLength={500}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Resolution Details Section */}
                <Card className="border border-gray-200 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                      Resolution Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status of Resolution</Label>
                      <RadioGroup className="mt-2" value={resolutionStatus} onValueChange={setResolutionStatus}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="resolved" id="resolved" />
                          <Label htmlFor="resolved">Resolved</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not-resolved" id="not-resolved" />
                          <Label htmlFor="not-resolved">Not Resolved</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="in-progress" id="in-progress" />
                          <Label htmlFor="in-progress">In Progress</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Re-upload Required</Label>
                      <RadioGroup className="mt-2" value={documentReuploadRequired} onValueChange={setDocumentReuploadRequired}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="reupload-yes" />
                          <Label htmlFor="reupload-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="reupload-no" />
                          <Label htmlFor="reupload-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resolution Remarks {resolutionStatus === 'resolved' && <span className="text-red-500">*</span>}
                      </Label>
                      <Textarea 
                        className="mt-1" 
                        rows={4}
                        placeholder="Enter resolution remarks (max 500 characters)"
                        maxLength={500}
                        value={resolutionRemarks}
                        onChange={(e) => setResolutionRemarks(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Document Submission Details Section */}
                <Card className="border border-gray-200 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-orange-500 dark:text-orange-400">
                      Document Submission Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                        Documents Submitted <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        {documentTypes.map((docType) => (
                          <div key={docType} className="flex items-center space-x-2">
                            <Checkbox
                              id={docType}
                              checked={selectedDocuments.includes(docType)}
                              onCheckedChange={(checked) => handleDocumentSelect(docType, checked as boolean)}
                            />
                            <Label htmlFor={docType} className="text-sm text-gray-700 dark:text-gray-300">
                              {docType}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Document Type</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={customDocumentName}
                          onChange={(e) => setCustomDocumentName(e.target.value)}
                          placeholder="Enter custom document type"
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                        Upload Documents <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Multiple uploads - With restrictions
                        </div>
                        <input
                          type="file"
                          id="document-upload"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, selectedDocuments[0] || 'General Document')}
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          multiple
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('document-upload')?.click()}
                          className="mb-4"
                          disabled={selectedDocuments.length === 0}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                        <div className="text-sm text-red-500">
                          {selectedDocuments.length === 0 ? 'Select documents to enable upload' : ''}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleDiscard}
                      className="px-6 py-2 text-sm font-medium border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Discard
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSaveAsDraft}
                      className="px-6 py-2 text-sm font-medium border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                    >
                      Save as Draft
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      className="px-6 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResolveDiscrepanciesForm;
