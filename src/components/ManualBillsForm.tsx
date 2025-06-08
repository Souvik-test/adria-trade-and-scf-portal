
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, Edit, Trash2, FileText, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ManualBillsFormProps {
  onClose: () => void;
  onBack: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

const ManualBillsForm: React.FC<ManualBillsFormProps> = ({ onClose, onBack }) => {
  const [currentPane, setCurrentPane] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  
  // Form state
  const [submissionType, setSubmissionType] = useState('');
  const [lcReference, setLcReference] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [drawingAmount, setDrawingAmount] = useState('');
  const [shipmentDetails, setShipmentDetails] = useState('');

  const defaultDocumentTypes = [
    'Commercial Invoice',
    'Packing List', 
    'Bill of Lading/AWB',
    'Certificate of Origin',
    'Insurance Certificate',
    'Inspection Certificate'
  ];

  const [documentTypes, setDocumentTypes] = useState(defaultDocumentTypes);

  const paneHeaders = [
    'Submission Type and Export LC Selection',
    'LC & Applicant Details',
    'Drawing Details',
    'Shipment & Transportation Details',
    'Document Submission Details'
  ];

  const handleNext = () => {
    if (currentPane < 4) {
      setCurrentPane(currentPane + 1);
    }
  };

  const handleGoBack = () => {
    if (currentPane > 0) {
      setCurrentPane(currentPane - 1);
    }
  };

  const handleDiscard = () => {
    onBack();
  };

  const handleSaveAsDraft = () => {
    console.log('Saved as draft');
    // Handle save as draft
  };

  const handleSubmit = () => {
    console.log('Form submitted');
    // Handle form submission
  };

  const handleLcSearch = () => {
    console.log('Searching LC Reference:', lcReference);
  };

  const handleDocumentSelect = (docType: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, docType]);
    } else {
      setSelectedDocuments(prev => prev.filter(doc => doc !== docType));
    }
  };

  const handleAddCustomDocumentType = () => {
    if (customDocumentName.trim() && !documentTypes.includes(customDocumentName.trim())) {
      const newDocType = customDocumentName.trim();
      setDocumentTypes(prev => [...prev, newDocType]);
      setSelectedDocuments(prev => [...prev, newDocType]);
      setCustomDocumentName('');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && selectedDocuments.length > 0) {
      Array.from(files).forEach((file, index) => {
        const newDocument: UploadedDocument = {
          id: `${Date.now()}-${index}`,
          name: file.name,
          reference: '',
          date: new Date().toISOString().split('T')[0],
          type: selectedDocuments[0],
          file: file
        };
        setUploadedDocuments(prev => [...prev, newDocument]);
      });
    }
    event.target.value = '';
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

  const renderSubmissionTypePane = () => (
    <Card className="border border-gray-200 dark:border-gray-600 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
          {paneHeaders[0]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Type</Label>
            <Select value={submissionType} onValueChange={setSubmissionType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select submission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Export LC Selection</Label>
            <div className="relative mt-1">
              <Input 
                placeholder="Search LC Reference" 
                className="pr-10" 
                value={lcReference}
                onChange={(e) => setLcReference(e.target.value)}
              />
              <button 
                onClick={handleLcSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1 transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLcApplicantDetailsPane = () => (
    <Card className="border border-gray-200 dark:border-gray-600 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
          {paneHeaders[1]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Reference Number</Label>
            <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" value={lcReference} />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Amount</Label>
            <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Expiry Date</Label>
            <Input type="date" readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Applicant Name</Label>
            <Input 
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="mt-1" 
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issuing Bank</Label>
            <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDrawingDetailsPane = () => (
    <Card className="border border-gray-200 dark:border-gray-600 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
          {paneHeaders[2]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Amount</Label>
            <Input 
              value={drawingAmount}
              onChange={(e) => setDrawingAmount(e.target.value)}
              placeholder="Enter drawing amount"
              className="mt-1" 
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Currency</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Date</Label>
            <Input type="date" className="mt-1" />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Details</Label>
          <Textarea 
            className="mt-1" 
            rows={4}
            placeholder="Enter drawing details"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderShipmentTransportationPane = () => (
    <Card className="border border-gray-200 dark:border-gray-600 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
          {paneHeaders[3]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipment Date</Label>
            <Input type="date" className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Port of Loading</Label>
            <Input placeholder="Enter port of loading" className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Port of Discharge</Label>
            <Input placeholder="Enter port of discharge" className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Transportation Mode</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select transportation mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sea">Sea</SelectItem>
                <SelectItem value="air">Air</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="multimodal">Multimodal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vessel/Flight Details</Label>
            <Input placeholder="Enter vessel/flight details" className="mt-1" />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipment Description</Label>
          <Textarea 
            value={shipmentDetails}
            onChange={(e) => setShipmentDetails(e.target.value)}
            className="mt-1" 
            rows={4}
            placeholder="Enter shipment description"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentSubmissionPane = () => (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            {paneHeaders[4]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Documents Submitted <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {documentTypes.map((docType) => (
                <div key={docType} className="flex items-center space-x-2">
                  <Checkbox
                    id={docType}
                    checked={selectedDocuments.includes(docType)}
                    onCheckedChange={(checked) => handleDocumentSelect(docType, checked as boolean)}
                  />
                  <Label htmlFor={docType} className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
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
                onClick={handleAddCustomDocumentType}
                disabled={!customDocumentName.trim()}
                className="bg-corporate-teal-100 hover:bg-corporate-teal-200 text-corporate-teal-700 border-corporate-teal-300 disabled:opacity-50"
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
                onChange={handleFileSelect}
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

      {uploadedDocuments.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-3 pr-4">
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-corporate-teal-500" />
                        <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDocument(editingDocument === doc.id ? null : doc.id)}
                          className="hover:bg-blue-100 text-blue-600"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDocumentDelete(doc.id)}
                          className="hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {editingDocument === doc.id && (
                      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div>
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Document ID</Label>
                          <Input
                            value={doc.reference}
                            onChange={(e) => handleDocumentEdit(doc.id, 'reference', e.target.value)}
                            className="h-8 text-xs"
                            placeholder="Enter document ID"
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
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCurrentPane = () => {
    switch (currentPane) {
      case 0:
        return renderSubmissionTypePane();
      case 1:
        return renderLcApplicantDetailsPane();
      case 2:
        return renderDrawingDetailsPane();
      case 3:
        return renderShipmentTransportationPane();
      case 4:
        return renderDocumentSubmissionPane();
      default:
        return renderSubmissionTypePane();
    }
  };

  const renderPaneButtons = () => {
    switch (currentPane) {
      case 0: // Submission Type
        return (
          <div className="flex justify-end items-center">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleDiscard}
                className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
              >
                Discard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveAsDraft}
                className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500"
              >
                Save as Draft
              </Button>
              <Button 
                onClick={handleNext}
                className="px-6 py-2 text-sm font-medium bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        );
      
      case 1: // LC & Applicant Details
      case 2: // Drawing Details  
      case 3: // Shipment & Transportation Details
        return (
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="px-6 py-2 text-sm font-medium border-gray-400 text-gray-600 hover:bg-gray-50"
            >
              Go Back
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleDiscard}
                className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
              >
                Discard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveAsDraft}
                className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500"
              >
                Save as Draft
              </Button>
              <Button 
                onClick={handleNext}
                className="px-6 py-2 text-sm font-medium bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        );
      
      case 4: // Document Submission Details
        return (
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="px-6 py-2 text-sm font-medium border-gray-400 text-gray-600 hover:bg-gray-50"
            >
              Go Back
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleDiscard}
                className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
              >
                Discard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveAsDraft}
                className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500"
              >
                Save as Draft
              </Button>
              <Button 
                onClick={handleSubmit}
                className="px-6 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`${isExpanded ? 'max-w-[100vw] max-h-[100vh] w-full h-full' : 'max-w-7xl max-h-[90vh]'} overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300`}>
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
                Export LC Bills - {paneHeaders[currentPane]}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col h-full p-6 overflow-hidden">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              {paneHeaders.map((header, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === currentPane 
                      ? 'bg-corporate-teal-500 text-white' 
                      : index < currentPane 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < paneHeaders.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      index < currentPane ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <ScrollArea className="flex-1">
            <div className="pr-4">
              {renderCurrentPane()}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
            {renderPaneButtons()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualBillsForm;
