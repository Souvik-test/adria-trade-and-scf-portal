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
import { CalendarIcon, Upload, X, Edit2, Trash2, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
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
}

const ManualBillsForm: React.FC<ManualBillsFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    lcNumber: '',
    lcIssueDate: null,
    lcExpiryDate: null,
    applicantName: '',
    applicantAddress: '',
    applicantCountry: '',
    beneficiaryName: '',
    beneficiaryAddress: '',
    beneficiaryCountry: '',
    currency: '',
    amount: '',
    goodsDescription: '',
    shipmentDate: null,
    documentsRequired: '',
    additionalInstructions: '',
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<{ [key: string]: boolean }>({});
  const [customDocuments, setCustomDocuments] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState('');
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
  const [editDocumentId, setEditDocumentId] = useState<string | null>(null);
  const [editDocumentDate, setEditDocumentDate] = useState<Date | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDiscard = () => {
    // Reset all form data
    setFormData({
      lcNumber: '',
      lcIssueDate: null,
      lcExpiryDate: null,
      applicantName: '',
      applicantAddress: '',
      applicantCountry: '',
      beneficiaryName: '',
      beneficiaryAddress: '',
      beneficiaryCountry: '',
      currency: '',
      amount: '',
      goodsDescription: '',
      shipmentDate: null,
      documentsRequired: '',
      additionalInstructions: '',
    });
    setUploadedDocuments([]);
    setSelectedDocuments({});
    setCustomDocuments([]);
    onBack();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleOpenUploadDialog = () => {
    setIsUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
    setNewDocumentType('');
    setNewDocumentFile(null);
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDocumentType(e.target.value);
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewDocumentFile(e.target.files[0]);
    }
  };

  const handleUploadDocument = () => {
    if (newDocumentType && newDocumentFile) {
      const newDocument: UploadedDocument = {
        id: Math.random().toString(36).substring(7),
        type: newDocumentType,
        file: newDocumentFile,
        documentId: Math.random().toString(36).substring(7),
        documentDate: null,
      };
      setUploadedDocuments(prev => [...prev, newDocument]);
      handleCloseUploadDialog();
    } else {
      alert('Please select a document type and file.');
    }
  };

  const removeDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const editDocument = (id: string) => {
    const documentToEdit = uploadedDocuments.find(doc => doc.id === id);
    if (documentToEdit) {
      setEditDocumentId(id);
      setEditDocumentDate(documentToEdit.documentDate || null);
      setIsEditDialogOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditDocumentId(null);
    setEditDocumentDate(null);
  };

  const handleEditDateChange = (date: Date | undefined) => {
    setEditDocumentDate(date);
  };

  const handleSaveEdit = () => {
    if (editDocumentId) {
      setUploadedDocuments(prev =>
        prev.map(doc =>
          doc.id === editDocumentId ? { ...doc, documentDate: editDocumentDate } : doc
        )
      );
      handleCloseEditDialog();
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Uploaded Documents:', uploadedDocuments);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-50 overflow-auto" : "p-6"
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Bills under Export LC Management
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="text-gray-600 dark:text-gray-400"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Panel - Uploaded Documents */}
          <div className="w-80 shrink-0">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg text-corporate-peach-600 dark:text-corporate-peach-400">
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {uploadedDocuments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No documents uploaded yet</p>
                ) : (
                  uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                            {doc.type}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {doc.file.name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">ID:</span>
                          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
                            {doc.documentId}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editDocument(doc.id)}
                            className="p-1"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Date:</span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                            {doc.documentDate ? format(doc.documentDate, 'dd/MM/yyyy') : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <Button
                variant="secondary"
                className="w-full mt-2"
                onClick={handleOpenUploadDialog}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </Card>
          </div>

          {/* Main Form Content */}
          <div className="flex-1">
            <div className="space-y-8">
              {/* LC Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">
                    LC Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lcNumber">LC Number</Label>
                      <Input
                        type="text"
                        id="lcNumber"
                        name="lcNumber"
                        value={formData.lcNumber}
                        onChange={handleChange}
                        placeholder="Enter LC number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lcIssueDate">LC Issue Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.lcIssueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.lcIssueDate ? format(formData.lcIssueDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.lcIssueDate}
                            onSelect={(date) => handleDateChange('lcIssueDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lcExpiryDate">LC Expiry Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.lcExpiryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.lcExpiryDate ? format(formData.lcExpiryDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.lcExpiryDate}
                            onSelect={(date) => handleDateChange('lcExpiryDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applicant Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">
                    Applicant Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">Applicant Name</Label>
                    <Input
                      type="text"
                      id="applicantName"
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleChange}
                      placeholder="Enter applicant name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicantAddress">Applicant Address</Label>
                    <Textarea
                      id="applicantAddress"
                      name="applicantAddress"
                      value={formData.applicantAddress}
                      onChange={handleChange}
                      placeholder="Enter applicant address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicantCountry">Applicant Country</Label>
                    <Input
                      type="text"
                      id="applicantCountry"
                      name="applicantCountry"
                      value={formData.applicantCountry}
                      onChange={handleChange}
                      placeholder="Enter applicant country"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Beneficiary Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">
                    Beneficiary Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                    <Input
                      type="text"
                      id="beneficiaryName"
                      name="beneficiaryName"
                      value={formData.beneficiaryName}
                      onChange={handleChange}
                      placeholder="Enter beneficiary name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaryAddress">Beneficiary Address</Label>
                    <Textarea
                      id="beneficiaryAddress"
                      name="beneficiaryAddress"
                      value={formData.beneficiaryAddress}
                      onChange={handleChange}
                      placeholder="Enter beneficiary address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaryCountry">Beneficiary Country</Label>
                    <Input
                      type="text"
                      id="beneficiaryCountry"
                      name="beneficiaryCountry"
                      value={formData.beneficiaryCountry}
                      onChange={handleChange}
                      placeholder="Enter beneficiary country"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Credit Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">
                    Credit Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        type="text"
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        placeholder="Enter currency"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goodsDescription">Goods Description</Label>
                    <Textarea
                      id="goodsDescription"
                      name="goodsDescription"
                      value={formData.goodsDescription}
                      onChange={handleChange}
                      placeholder="Enter goods description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipmentDate">Shipment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.shipmentDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.shipmentDate ? format(formData.shipmentDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.shipmentDate}
                          onSelect={(date) => handleDateChange('shipmentDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">
                    Document Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="documentsRequired">Documents Required</Label>
                    <Textarea
                      id="documentsRequired"
                      name="documentsRequired"
                      value={formData.documentsRequired}
                      onChange={handleChange}
                      placeholder="Enter documents required"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalInstructions">Additional Instructions</Label>
                    <Textarea
                      id="additionalInstructions"
                      name="additionalInstructions"
                      value={formData.additionalInstructions}
                      onChange={handleChange}
                      placeholder="Enter additional instructions"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={handleDiscard}
                  className="px-8"
                >
                  Discard
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-corporate-peach-500 hover:bg-corporate-peach-600 text-white px-8"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentType" className="text-right">
                Document Type
              </Label>
              <Input
                type="text"
                id="documentType"
                value={newDocumentType}
                onChange={handleDocumentTypeChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentFile" className="text-right">
                Document File
              </Label>
              <Input
                type="file"
                id="documentFile"
                onChange={handleDocumentFileChange}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={handleCloseUploadDialog}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUploadDocument}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Document Date</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editDocumentDate" className="text-right">
                Document Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editDocumentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editDocumentDate ? format(editDocumentDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editDocumentDate}
                    onSelect={handleEditDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveEdit}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManualBillsForm;
