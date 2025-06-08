import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, Search, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import DocumentUploadPopup from './DocumentUploadPopup';

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
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  
  // Form state
  const [submissionType, setSubmissionType] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [submissionReference, setSubmissionReference] = useState('');
  const [lcReference, setLcReference] = useState('');
  const [corporateReference, setCorporateReference] = useState('CORP-REF-001');
  const [lcCurrency, setLcCurrency] = useState('USD');
  const [applicantName, setApplicantName] = useState('');
  const [drawingAmount, setDrawingAmount] = useState('');
  const [tenorType, setTenorType] = useState('');
  const [tenorDays, setTenorDays] = useState('');
  const [shipmentDetails, setShipmentDetails] = useState('');
  const [billOfLadingNo, setBillOfLadingNo] = useState('');

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
    'Submission Details',
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
  };

  const handleSubmit = () => {
    console.log('Form submitted');
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
      setShowDocumentPopup(true);
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

  const isDocumentUploadEnabled = (doc: UploadedDocument) => {
    return doc.reference.trim() !== '' && doc.date.trim() !== '';
  };

  const renderSubmissionDetailsPane = () => (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            {paneHeaders[0]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Type</Label>
              <Select value={submissionType} onValueChange={setSubmissionType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select submission type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="pre-check">Pre-Check</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Date</Label>
              <div className="relative mt-1">
                <Input 
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Reference</Label>
              <Input 
                placeholder="Enter submission reference" 
                className="mt-1" 
                value={submissionReference}
                onChange={(e) => setSubmissionReference(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );

  const renderLcApplicantDetailsPane = () => (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
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
              <div className="relative mt-1">
                <Input 
                  value={lcReference}
                  onChange={(e) => setLcReference(e.target.value)}
                  placeholder="Enter LC Reference"
                  className="pr-10"
                />
                <button 
                  onClick={handleLcSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1 transition-colors"
                >
                  <Search className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Corporate Reference Number</Label>
              <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" value={corporateReference} />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Currency</Label>
              <Select value={lcCurrency} onValueChange={setLcCurrency}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Amount</Label>
              <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Expiry Place</Label>
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
    </ScrollArea>
  );

  const renderDrawingDetailsPane = () => (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            {paneHeaders[2]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
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
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenor Type</Label>
              <Select value={tenorType} onValueChange={setTenorType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select tenor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sight">Sight</SelectItem>
                  <SelectItem value="usance">Usance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {tenorType === 'usance' && (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenor Days</Label>
                <Input 
                  value={tenorDays}
                  onChange={(e) => setTenorDays(e.target.value)}
                  placeholder="Enter tenor days"
                  className="mt-1" 
                />
              </div>
            </div>
          )}
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
    </ScrollArea>
  );

  const renderShipmentTransportationPane = () => (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
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
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill of Lading / AWB No.</Label>
              <Input 
                value={billOfLadingNo}
                onChange={(e) => setBillOfLadingNo(e.target.value)}
                placeholder="Enter bill of lading/AWB number" 
                className="mt-1" 
              />
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
    </ScrollArea>
  );

  const renderDocumentSubmissionPane = () => (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <div className="space-y-6 pr-4">
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

            {uploadedDocuments.length > 0 && (
              <div>
                <Button
                  onClick={() => setShowDocumentPopup(true)}
                  className="bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
                >
                  View Uploaded Documents ({uploadedDocuments.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );

  const renderCurrentPane = () => {
    switch (currentPane) {
      case 0:
        return renderSubmissionDetailsPane();
      case 1:
        return renderLcApplicantDetailsPane();
      case 2:
        return renderDrawingDetailsPane();
      case 3:
        return renderShipmentTransportationPane();
      case 4:
        return renderDocumentSubmissionPane();
      default:
        return renderSubmissionDetailsPane();
    }
  };

  const renderPaneButtons = () => {
    switch (currentPane) {
      case 0:
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
      
      case 1:
      case 2:
      case 3:
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
      
      case 4:
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
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
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
            <div className="flex-1 overflow-hidden">
              {renderCurrentPane()}
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
              {renderPaneButtons()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DocumentUploadPopup
        isOpen={showDocumentPopup}
        onClose={() => setShowDocumentPopup(false)}
        uploadedDocuments={uploadedDocuments}
        selectedDocuments={selectedDocuments}
        onDocumentEdit={handleDocumentEdit}
        onDocumentDelete={handleDocumentDelete}
      />
    </>
  );
};

export default ManualBillsForm;
