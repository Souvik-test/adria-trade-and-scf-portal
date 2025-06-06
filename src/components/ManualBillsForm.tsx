
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ArrowLeft, Upload, FileText, Trash2, Edit2, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ManualBillsFormProps {
  onClose: () => void;
  onBack: () => void;
}

interface UploadedDocument {
  id: string;
  type: string;
  fileName: string;
  documentId: string;
  documentDate: string;
}

const ManualBillsForm: React.FC<ManualBillsFormProps> = ({ onClose, onBack }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [formData, setFormData] = useState({
    submissionType: 'pre-check',
    submissionReference: '',
    submissionDate: new Date().toISOString().split('T')[0],
    lcReference: '',
    corporateReference: '',
    applicantName: '',
    issuingBank: '',
    lcCurrency: '',
    lcAmount: '',
    lcIssueDate: '',
    lcExpiryDate: '',
    lcExpiryPlace: '',
    drawingAmount: '',
    drawingCurrency: '',
    tenor: '',
    tenorDays: '',
    latestShipmentDate: '',
    actualShipmentDate: '',
    billOfLading: '',
    shippingLine: '',
    portOfLoading: '',
    portOfDischarge: '',
    placeOfDelivery: '',
    documentsSubmitted: [],
    customDocumentType: '',
    uploadedDocuments: [],
    remarks: '',
    declaration: false
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [currentDocumentData, setCurrentDocumentData] = useState({
    documentId: '',
    documentDate: '',
    type: ''
  });
  const [editingDocument, setEditingDocument] = useState<string | null>(null);

  const predefinedDocuments = [
    'Commercial Invoice',
    'Packing List',
    'Bill of Lading',
    'Certificate of Origin',
    'Insurance Certificate',
    'Inspection Certificate'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentSubmittedChange = (doc: string, checked: boolean) => {
    if (checked) {
      handleInputChange('documentsSubmitted', [...formData.documentsSubmitted, doc]);
    } else {
      handleInputChange('documentsSubmitted', formData.documentsSubmitted.filter(d => d !== doc));
    }
  };

  const handleAddCustomDocument = () => {
    if (formData.customDocumentType.trim()) {
      handleInputChange('documentsSubmitted', [...formData.documentsSubmitted, formData.customDocumentType]);
      handleInputChange('customDocumentType', '');
    }
  };

  const isUploadEnabled = formData.documentsSubmitted.length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      setShowUploadDialog(true);
    }
  };

  const handleDocumentUpload = () => {
    if (selectedFiles && currentDocumentData.type && currentDocumentData.documentId && currentDocumentData.documentDate) {
      const newDoc: UploadedDocument = {
        id: Date.now().toString(),
        type: currentDocumentData.type,
        fileName: selectedFiles[0].name,
        documentId: currentDocumentData.documentId,
        documentDate: currentDocumentData.documentDate
      };
      
      setUploadedDocuments(prev => [...prev, newDoc]);
      setShowUploadDialog(false);
      setSelectedFiles(null);
      setCurrentDocumentData({ documentId: '', documentDate: '', type: '' });
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleEditDocument = (doc: UploadedDocument) => {
    setCurrentDocumentData({
      documentId: doc.documentId,
      documentDate: doc.documentDate,
      type: doc.type
    });
    setEditingDocument(doc.id);
    setShowDocumentDialog(true);
  };

  const handleUpdateDocument = () => {
    if (editingDocument) {
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === editingDocument 
            ? { ...doc, documentId: currentDocumentData.documentId, documentDate: currentDocumentData.documentDate }
            : doc
        )
      );
      setShowDocumentDialog(false);
      setEditingDocument(null);
      setCurrentDocumentData({ documentId: '', documentDate: '', type: '' });
    }
  };

  const handleSubmit = (action: string) => {
    console.log('Form submitted with action:', action, formData);
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard all changes?')) {
      onBack();
    }
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 bg-white dark:bg-gray-800 z-50 overflow-y-auto"
    : "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";

  const contentClass = isFullscreen
    ? "w-full h-full"
    : "bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-corporate-blue hover:bg-corporate-blue/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Bills under Export LC - Field Specification (Pre-check Submission)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-corporate-blue hover:bg-corporate-blue/10"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-corporate-blue hover:bg-corporate-blue/10"
              title="Document Upload"
            >
              <Upload className="w-5 h-5" />
            </Button>
            {!isFullscreen && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="flex">
          {/* Left panel for uploaded documents */}
          {uploadedDocuments.length > 0 && (
            <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Uploaded Documents</h3>
              <div className="space-y-3">
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800 dark:text-white">{doc.type}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{doc.fileName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">ID: {doc.documentId}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Date: {doc.documentDate}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDocument(doc)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 p-6 space-y-8">
            {/* Section 1: Submission Type and Export LC Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-corporate-blue">
                  Section 1: Submission Type and Export LC Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="submissionType">Submission Type * (SWIFT: :27:)</Label>
                  <Select value={formData.submissionType} onValueChange={(value) => handleInputChange('submissionType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-check">Pre-Check</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="submissionReference">Submission Reference (SWIFT: :20:)</Label>
                  <Input
                    id="submissionReference"
                    value={formData.submissionReference}
                    onChange={(e) => handleInputChange('submissionReference', e.target.value)}
                    maxLength={16}
                    placeholder="Enter reference"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="submissionDate">Submission Date * (SWIFT: :30:)</Label>
                  <Input
                    id="submissionDate"
                    type="date"
                    value={formData.submissionDate}
                    onChange={(e) => handleInputChange('submissionDate', e.target.value)}
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lcReference">LC Reference Number * (SWIFT: :21:)</Label>
                  <Select value={formData.lcReference} onValueChange={(value) => handleInputChange('lcReference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LC" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lc001">LC001 - Sample LC</SelectItem>
                      <SelectItem value="lc002">LC002 - Another LC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="corporateReference">Corporate Reference Number (SWIFT: :21R:)</Label>
                  <Input
                    id="corporateReference"
                    value={formData.corporateReference}
                    onChange={(e) => handleInputChange('corporateReference', e.target.value)}
                    maxLength={16}
                    placeholder="Internal use only"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 2: LC & Applicant Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-corporate-blue">
                  Section 2: LC & Applicant Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">Applicant Name (SWIFT: :50:)</Label>
                  <Input
                    id="applicantName"
                    value={formData.applicantName}
                    readOnly
                    className="bg-gray-100"
                    placeholder="Auto-populated"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="issuingBank">Issuing Bank (SWIFT: :51A:)</Label>
                  <Input
                    id="issuingBank"
                    value={formData.issuingBank}
                    readOnly
                    className="bg-gray-100"
                    placeholder="Auto-populated"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lcCurrency">LC Currency (SWIFT: :32B:)</Label>
                  <Input
                    id="lcCurrency"
                    value={formData.lcCurrency}
                    readOnly
                    className="bg-gray-100"
                    placeholder="Auto-fetched"
                    maxLength={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lcAmount">LC Amount (SWIFT: :32B:)</Label>
                  <Input
                    id="lcAmount"
                    value={formData.lcAmount}
                    readOnly
                    className="bg-gray-100"
                    placeholder="Format: 99999999999.99"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lcIssueDate">LC Issue Date (SWIFT: :31C:)</Label>
                  <Input
                    id="lcIssueDate"
                    type="date"
                    value={formData.lcIssueDate}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lcExpiryDate">LC Expiry Date & Place (SWIFT: :31D:)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={formData.lcExpiryDate}
                      readOnly
                      className="bg-gray-100 flex-1"
                    />
                    <Input
                      value={formData.lcExpiryPlace}
                      readOnly
                      className="bg-gray-100 flex-1"
                      placeholder="Place"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Drawing Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-corporate-blue">
                  Section 3: Drawing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="drawingAmount">Drawing Amount * (SWIFT: :32A:)</Label>
                  <Input
                    id="drawingAmount"
                    type="number"
                    value={formData.drawingAmount}
                    onChange={(e) => handleInputChange('drawingAmount', e.target.value)}
                    placeholder="Must be ≤ available balance"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="drawingCurrency">Drawing Currency (SWIFT: :32A:)</Label>
                  <Input
                    id="drawingCurrency"
                    value={formData.drawingCurrency}
                    readOnly
                    className="bg-gray-100"
                    placeholder="Auto-fetched"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tenor">Tenor (Sight/Usance) * (SWIFT: :31A:)</Label>
                  <Select value={formData.tenor} onValueChange={(value) => handleInputChange('tenor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Based on LC terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sight">Sight</SelectItem>
                      <SelectItem value="usance">Usance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tenorDays">Tenor Days (if Usance) (SWIFT: :31A:)</Label>
                  <Input
                    id="tenorDays"
                    type="number"
                    value={formData.tenorDays}
                    onChange={(e) => handleInputChange('tenorDays', e.target.value)}
                    placeholder="Required if Tenor = Usance"
                    disabled={formData.tenor !== 'usance'}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Shipment & Transportation Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-corporate-blue">
                  Section 4: Shipment & Transportation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latestShipmentDate">Latest Shipment Date (SWIFT: :44C:)</Label>
                  <Input
                    id="latestShipmentDate"
                    type="date"
                    value={formData.latestShipmentDate}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="actualShipmentDate">Actual Shipment Date * (SWIFT: :44C:)</Label>
                  <Input
                    id="actualShipmentDate"
                    type="date"
                    value={formData.actualShipmentDate}
                    onChange={(e) => handleInputChange('actualShipmentDate', e.target.value)}
                    placeholder="Must ≤ Latest Shipment Date"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billOfLading">Bill of Lading / AWB No. * (SWIFT: :20:)</Label>
                  <Input
                    id="billOfLading"
                    value={formData.billOfLading}
                    onChange={(e) => handleInputChange('billOfLading', e.target.value)}
                    maxLength={35}
                    placeholder="Mandatory document ref"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingLine">Shipping Line / Airline Name (SWIFT: :44F:)</Label>
                  <Input
                    id="shippingLine"
                    value={formData.shippingLine}
                    onChange={(e) => handleInputChange('shippingLine', e.target.value)}
                    maxLength={35}
                    placeholder="Optional"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portOfLoading">Port of Loading * (SWIFT: :44E:)</Label>
                  <Select value={formData.portOfLoading} onValueChange={(value) => handleInputChange('portOfLoading', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Use UN/LOCODE format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AEJEA">AEJEA - Jebel Ali</SelectItem>
                      <SelectItem value="AEDXB">AEDXB - Dubai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portOfDischarge">Port of Discharge * (SWIFT: :44F:)</Label>
                  <Select value={formData.portOfDischarge} onValueChange={(value) => handleInputChange('portOfDischarge', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Required" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USNYC">USNYC - New York</SelectItem>
                      <SelectItem value="USLAX">USLAX - Los Angeles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="placeOfDelivery">Place of Delivery (SWIFT: :44F:)</Label>
                  <Select value={formData.placeOfDelivery} onValueChange={(value) => handleInputChange('placeOfDelivery', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse1">Warehouse 1</SelectItem>
                      <SelectItem value="warehouse2">Warehouse 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Document Submission Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-corporate-blue">
                  Section 5: Document Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Documents Submitted * (SWIFT: :46A:)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {predefinedDocuments.map((doc) => (
                      <div key={doc} className="flex items-center space-x-2">
                        <Checkbox
                          id={doc}
                          checked={formData.documentsSubmitted.includes(doc)}
                          onCheckedChange={(checked) => handleDocumentSubmittedChange(doc, checked as boolean)}
                        />
                        <Label htmlFor={doc} className="text-sm">{doc}</Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom documents */}
                  {formData.documentsSubmitted.filter(doc => !predefinedDocuments.includes(doc)).map((doc) => (
                    <div key={doc} className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      <Checkbox
                        checked={true}
                        onCheckedChange={(checked) => handleDocumentSubmittedChange(doc, checked as boolean)}
                      />
                      <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">{doc} (Custom)</Label>
                    </div>
                  ))}
                </div>
                
                {/* Custom Document Type */}
                <div className="space-y-2">
                  <Label htmlFor="customDocumentType">Custom Document Type</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customDocumentType"
                      value={formData.customDocumentType}
                      onChange={(e) => handleInputChange('customDocumentType', e.target.value)}
                      placeholder="Enter custom document type"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAddCustomDocument}
                      disabled={!formData.customDocumentType.trim()}
                      className="bg-corporate-blue hover:bg-corporate-blue/90"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="uploadDocuments">Upload Documents * (SWIFT: :77A:)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Multiple uploads - With restrictions</p>
                    <div className="mt-4">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        disabled={!isUploadEnabled}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={!isUploadEnabled}
                        className={`mt-2 ${!isUploadEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                      {!isUploadEnabled && (
                        <p className="text-xs text-red-500 mt-2">Select documents to enable upload</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks / Comments (SWIFT: :72:)</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    maxLength={200}
                    placeholder="Optional notes (max 200 characters)"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="declaration"
                    checked={formData.declaration}
                    onCheckedChange={(checked) => handleInputChange('declaration', checked)}
                  />
                  <Label htmlFor="declaration" className="text-sm">
                    I declare that the information provided is accurate and I accept the terms and conditions. *
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 py-6">
              <Button 
                onClick={() => handleSubmit('precheck')}
                className="bg-corporate-blue hover:bg-corporate-blue/90"
                disabled={!formData.declaration}
              >
                Submit for Pre-check
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleSubmit('draft')}
              >
                Save as Draft
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleSubmit('template')}
              >
                Save as Template
              </Button>
              <Button 
                variant="outline"
                onClick={handleDiscard}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Discard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Upload Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={currentDocumentData.type} onValueChange={(value) => setCurrentDocumentData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {formData.documentsSubmitted.map((doc) => (
                    <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Document ID</Label>
              <Input
                value={currentDocumentData.documentId}
                onChange={(e) => setCurrentDocumentData(prev => ({ ...prev, documentId: e.target.value }))}
                placeholder="Enter document ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Document Date</Label>
              <Input
                type="date"
                value={currentDocumentData.documentDate}
                onChange={(e) => setCurrentDocumentData(prev => ({ ...prev, documentDate: e.target.value }))}
              />
            </div>
            
            {selectedFiles && (
              <div className="text-sm text-gray-600">
                Selected file: {selectedFiles[0].name}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDocumentUpload}
              disabled={!currentDocumentData.type || !currentDocumentData.documentId || !currentDocumentData.documentDate}
              className="bg-corporate-blue hover:bg-corporate-blue/90"
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Input
                value={currentDocumentData.type}
                readOnly
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Document ID</Label>
              <Input
                value={currentDocumentData.documentId}
                onChange={(e) => setCurrentDocumentData(prev => ({ ...prev, documentId: e.target.value }))}
                placeholder="Enter document ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Document Date</Label>
              <Input
                type="date"
                value={currentDocumentData.documentDate}
                onChange={(e) => setCurrentDocumentData(prev => ({ ...prev, documentDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateDocument}
              disabled={!currentDocumentData.documentId || !currentDocumentData.documentDate}
              className="bg-corporate-blue hover:bg-corporate-blue/90"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManualBillsForm;
