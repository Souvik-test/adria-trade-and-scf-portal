
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Upload, X, ArrowLeft, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  type: string;
  documentNo: string;
  documentDate: Date | null;
  file: File | null;
  isCustom: boolean;
}

interface BillsFormProps {
  onBack: () => void;
  onClose: () => void;
}

const BillsForm: React.FC<BillsFormProps> = ({ onBack, onClose }) => {
  const [submissionType, setSubmissionType] = useState('');
  const [submissionReference, setSubmissionReference] = useState('');
  const [submissionDate, setSubmissionDate] = useState<Date | null>(null);
  const [lcReferenceNumber, setLcReferenceNumber] = useState('');
  const [corporateReference, setCorporateReference] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [issuingBank, setIssuingBank] = useState('');
  const [lcCurrency, setLcCurrency] = useState('');
  const [lcAmount, setLcAmount] = useState('');
  const [lcIssueDate, setLcIssueDate] = useState<Date | null>(null);
  const [lcExpiryDate, setLcExpiryDate] = useState<Date | null>(null);
  const [drawingAmount, setDrawingAmount] = useState('');
  const [drawingCurrency, setDrawingCurrency] = useState('');
  const [tenor, setTenor] = useState('');
  const [tenorDays, setTenorDays] = useState('');
  const [latestShipmentDate, setLatestShipmentDate] = useState<Date | null>(null);
  const [actualShipmentDate, setActualShipmentDate] = useState<Date | null>(null);
  const [billOfLading, setBillOfLading] = useState('');
  const [shippingLine, setShippingLine] = useState('');
  const [portOfLoading, setPortOfLoading] = useState('');
  const [portOfDischarge, setPortOfDischarge] = useState('');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [declaration, setDeclaration] = useState(false);

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

  const submissionTypes = ['Pre-Check', 'Final'];
  const tenorOptions = ['Sight', 'Usance'];

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

  const handleSubmit = () => {
    console.log('Bills submission data:', {
      submissionType,
      submissionReference,
      submissionDate,
      lcReferenceNumber,
      documents,
      declaration
    });
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
              Bills under Export LC – Field Specification (Pre-check Submission)
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
          {/* Section 1: Submission Type and Export LC Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-corporate-peach-600 dark:text-corporate-peach-400">
                Section 1: Submission Type and Export LC Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="submissionType">Submission Type *</Label>
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
                  <Label htmlFor="submissionReference">Submission Reference</Label>
                  <Input
                    id="submissionReference"
                    value={submissionReference}
                    onChange={(e) => setSubmissionReference(e.target.value)}
                    placeholder="Enter submission reference"
                    maxLength={16}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submissionDate">Submission Date *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="lcReference">LC Reference Number *</Label>
                  <Input
                    id="lcReference"
                    value={lcReferenceNumber}
                    onChange={(e) => setLcReferenceNumber(e.target.value)}
                    placeholder="Enter LC reference number"
                    maxLength={16}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corporateReference">Corporate Reference Number</Label>
                  <Input
                    id="corporateReference"
                    value={corporateReference}
                    onChange={(e) => setCorporateReference(e.target.value)}
                    placeholder="Enter corporate reference"
                    maxLength={16}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: LC & Applicant Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-corporate-peach-600 dark:text-corporate-peach-400">
                Section 2: LC & Applicant Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input
                    id="applicantName"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Auto-filled from LC"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuingBank">Issuing Bank</Label>
                  <Input
                    id="issuingBank"
                    value={issuingBank}
                    onChange={(e) => setIssuingBank(e.target.value)}
                    placeholder="Auto-filled from LC"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lcCurrency">LC Currency</Label>
                  <Input
                    id="lcCurrency"
                    value={lcCurrency}
                    onChange={(e) => setLcCurrency(e.target.value)}
                    placeholder="Auto-fetched"
                    maxLength={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lcAmount">LC Amount</Label>
                  <Input
                    id="lcAmount"
                    value={lcAmount}
                    onChange={(e) => setLcAmount(e.target.value)}
                    placeholder="Format: 99999999999.99"
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
                          !lcIssueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lcIssueDate ? format(lcIssueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={lcIssueDate}
                        onSelect={setLcIssueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lcExpiryDate">LC Expiry Date & Place</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !lcExpiryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lcExpiryDate ? format(lcExpiryDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={lcExpiryDate}
                        onSelect={setLcExpiryDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Drawing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-corporate-peach-600 dark:text-corporate-peach-400">
                Section 3: Drawing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="drawingAmount">Drawing Amount *</Label>
                  <Input
                    id="drawingAmount"
                    value={drawingAmount}
                    onChange={(e) => setDrawingAmount(e.target.value)}
                    placeholder="Must be ≤ available balance"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drawingCurrency">Drawing Currency</Label>
                  <Input
                    id="drawingCurrency"
                    value={drawingCurrency}
                    onChange={(e) => setDrawingCurrency(e.target.value)}
                    placeholder="Auto-fetched"
                    maxLength={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenor">Tenor (Sight/Usance) *</Label>
                  <Select value={tenor} onValueChange={setTenor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Based on LC terms" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenorOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenorDays">Tenor Days (if Usance)</Label>
                  <Input
                    id="tenorDays"
                    type="number"
                    value={tenorDays}
                    onChange={(e) => setTenorDays(e.target.value)}
                    placeholder="Required if Tenor = Usance"
                    disabled={tenor !== 'Usance'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Shipment & Transportation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-corporate-peach-600 dark:text-corporate-peach-400">
                Section 4: Shipment & Transportation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latestShipmentDate">Latest Shipment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !latestShipmentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {latestShipmentDate ? format(latestShipmentDate, "PPP") : "Non-editable"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={latestShipmentDate}
                        onSelect={setLatestShipmentDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualShipmentDate">Actual Shipment Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !actualShipmentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {actualShipmentDate ? format(actualShipmentDate, "PPP") : "Must ≤ Latest Shipment Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={actualShipmentDate}
                        onSelect={setActualShipmentDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billOfLading">Bill of Lading / AWB No. *</Label>
                  <Input
                    id="billOfLading"
                    value={billOfLading}
                    onChange={(e) => setBillOfLading(e.target.value)}
                    placeholder="Mandatory document ref"
                    maxLength={35}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingLine">Shipping Line / Airline Name</Label>
                  <Input
                    id="shippingLine"
                    value={shippingLine}
                    onChange={(e) => setShippingLine(e.target.value)}
                    placeholder="Optional"
                    maxLength={35}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portOfLoading">Port of Loading *</Label>
                  <Input
                    id="portOfLoading"
                    value={portOfLoading}
                    onChange={(e) => setPortOfLoading(e.target.value)}
                    placeholder="Use UN/LOCODE format"
                    maxLength={35}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portOfDischarge">Port of Discharge *</Label>
                  <Input
                    id="portOfDischarge"
                    value={portOfDischarge}
                    onChange={(e) => setPortOfDischarge(e.target.value)}
                    placeholder="Required"
                    maxLength={35}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placeOfDelivery">Place of Delivery</Label>
                  <Input
                    id="placeOfDelivery"
                    value={placeOfDelivery}
                    onChange={(e) => setPlaceOfDelivery(e.target.value)}
                    placeholder="Optional"
                    maxLength={35}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Document Submission Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-corporate-peach-600 dark:text-corporate-peach-400">
                Section 5: Document Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Documents Submitted *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {predefinedDocuments.map((docType) => (
                    <button
                      key={docType}
                      onClick={() => handleAddDocument(docType)}
                      className="p-3 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-corporate-peach-50 hover:border-corporate-peach-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {docType}
                    </button>
                  ))}
                  <button
                    onClick={() => handleAddDocument('Custom Document', true)}
                    className="p-3 text-sm font-medium rounded-lg border border-dashed border-corporate-peach-300 text-corporate-peach-600 hover:bg-corporate-peach-50 dark:border-corporate-peach-600 dark:text-corporate-peach-400 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Custom Document
                  </button>
                </div>
              </div>

              {/* Added Documents */}
              {documents.length > 0 && (
                <div className="space-y-3">
                  <Label>Added Documents</Label>
                  {documents.map((doc) => (
                    <Card key={doc.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-corporate-peach-500" />
                            <span className="font-medium">{doc.type}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(doc.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`docNo-${doc.id}`}>Document No. *</Label>
                            <Input
                              id={`docNo-${doc.id}`}
                              value={doc.documentNo}
                              onChange={(e) => handleDocumentUpdate(doc.id, 'documentNo', e.target.value)}
                              placeholder="Enter document number"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`docDate-${doc.id}`}>Document Date</Label>
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
                            <Label htmlFor={`file-${doc.id}`}>Upload Document</Label>
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
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks / Comments</Label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional notes (max 200 characters)"
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none"
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
                  className="w-4 h-4 text-corporate-peach-600 border-gray-300 rounded focus:ring-corporate-peach-500"
                />
                <Label htmlFor="declaration" className="text-sm">
                  I declare that all information provided is accurate and complete. User must accept before submission.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="px-8"
            >
              Save as Draft
            </Button>
            <Button
              variant="outline"
              className="px-8"
            >
              Save as Template
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-corporate-peach-500 hover:bg-corporate-peach-600 text-white px-8"
              disabled={!submissionType || !submissionDate || !lcReferenceNumber || !declaration || documents.length === 0}
            >
              Submit for Pre-check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsForm;
