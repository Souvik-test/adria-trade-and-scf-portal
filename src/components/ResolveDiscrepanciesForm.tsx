
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Moon, Sun, Upload, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
          </DialogHeader>
          
          <div className="flex gap-6 p-6 overflow-y-auto">
            {/* Left Panel - Uploaded Documents */}
            <div className="w-1/3 space-y-4">
              <Card className="border border-gray-200 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {uploadedDocuments.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No documents uploaded yet
                    </p>
                  ) : (
                    uploadedDocuments.map((doc) => (
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
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 space-y-6">
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
                      <Input placeholder="Search LC Reference" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill Reference Number</Label>
                      <Input placeholder="Search Bill Reference" className="mt-1" />
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
                      <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
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
                    <RadioGroup className="mt-2">
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
                    <RadioGroup className="mt-2">
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
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolution Remarks</Label>
                    <Textarea 
                      className="mt-1" 
                      rows={4}
                      placeholder="Enter resolution remarks (max 500 characters)"
                      maxLength={500}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload Section */}
              <Card className="border border-gray-200 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                    Document Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Standard Documents */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Invoice</Label>
                        <div className="mt-1">
                          <input
                            type="file"
                            id="invoice-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'Invoice')}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('invoice-upload')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill of Lading/AWB</Label>
                        <div className="mt-1">
                          <input
                            type="file"
                            id="bl-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'Bill of Lading/AWB')}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('bl-upload')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Packing List</Label>
                        <div className="mt-1">
                          <input
                            type="file"
                            id="packing-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'Packing List')}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('packing-upload')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Custom Document Upload */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Document Name</Label>
                        <Input
                          value={customDocumentName}
                          onChange={(e) => setCustomDocumentName(e.target.value)}
                          placeholder="Enter document name"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Custom Document</Label>
                        <div className="mt-1">
                          <input
                            type="file"
                            id="custom-upload"
                            className="hidden"
                            onChange={handleCustomDocumentUpload}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('custom-upload')?.click()}
                            className="w-full"
                            disabled={!customDocumentName.trim()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Remarks (Exporter)</Label>
                    <Textarea 
                      className="mt-1" 
                      rows={3}
                      placeholder="Optional, for internal clarification notes (max 500 characters)"
                      maxLength={500}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1">
                  Discard
                </Button>
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button className="flex-1 bg-corporate-blue hover:bg-corporate-blue/90">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResolveDiscrepanciesForm;
