
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ArrowLeft, Upload, FileText } from 'lucide-react';

interface ManualBillsFormProps {
  onClose: () => void;
  onBack: () => void;
}

const ManualBillsForm: React.FC<ManualBillsFormProps> = ({ onClose, onBack }) => {
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
    uploadedDocuments: [],
    remarks: '',
    declaration: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (action: string) => {
    console.log('Form submitted with action:', action, formData);
    // Handle form submission logic here
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
              className="text-corporate-blue hover:bg-corporate-blue/10"
              title="Document Upload"
            >
              <Upload className="w-5 h-5" />
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1: Submission Type and Export LC Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-corporate-blue">
                Section 1: Submission Type and Export LC Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="submissionType">Submission Type *</Label>
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
                <Label htmlFor="submissionReference">Submission Reference</Label>
                <Input
                  id="submissionReference"
                  value={formData.submissionReference}
                  onChange={(e) => handleInputChange('submissionReference', e.target.value)}
                  maxLength={16}
                  placeholder="Enter reference"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="submissionDate">Submission Date *</Label>
                <Input
                  id="submissionDate"
                  type="date"
                  value={formData.submissionDate}
                  onChange={(e) => handleInputChange('submissionDate', e.target.value)}
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lcReference">LC Reference Number *</Label>
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
                <Label htmlFor="corporateReference">Corporate Reference Number</Label>
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
                <Label htmlFor="applicantName">Applicant Name</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  readOnly
                  className="bg-gray-100"
                  placeholder="Auto-populated"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issuingBank">Issuing Bank</Label>
                <Input
                  id="issuingBank"
                  value={formData.issuingBank}
                  readOnly
                  className="bg-gray-100"
                  placeholder="Auto-populated"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lcCurrency">LC Currency</Label>
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
                <Label htmlFor="lcAmount">LC Amount</Label>
                <Input
                  id="lcAmount"
                  value={formData.lcAmount}
                  readOnly
                  className="bg-gray-100"
                  placeholder="Format: 99999999999.99"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lcIssueDate">LC Issue Date</Label>
                <Input
                  id="lcIssueDate"
                  type="date"
                  value={formData.lcIssueDate}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lcExpiryDate">LC Expiry Date & Place</Label>
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
                <Label htmlFor="drawingAmount">Drawing Amount *</Label>
                <Input
                  id="drawingAmount"
                  type="number"
                  value={formData.drawingAmount}
                  onChange={(e) => handleInputChange('drawingAmount', e.target.value)}
                  placeholder="Must be ≤ available balance"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="drawingCurrency">Drawing Currency</Label>
                <Input
                  id="drawingCurrency"
                  value={formData.drawingCurrency}
                  readOnly
                  className="bg-gray-100"
                  placeholder="Auto-fetched"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tenor">Tenor (Sight/Usance) *</Label>
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
                <Label htmlFor="tenorDays">Tenor Days (if Usance)</Label>
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
                <Label htmlFor="latestShipmentDate">Latest Shipment Date</Label>
                <Input
                  id="latestShipmentDate"
                  type="date"
                  value={formData.latestShipmentDate}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="actualShipmentDate">Actual Shipment Date *</Label>
                <Input
                  id="actualShipmentDate"
                  type="date"
                  value={formData.actualShipmentDate}
                  onChange={(e) => handleInputChange('actualShipmentDate', e.target.value)}
                  placeholder="Must ≤ Latest Shipment Date"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billOfLading">Bill of Lading / AWB No. *</Label>
                <Input
                  id="billOfLading"
                  value={formData.billOfLading}
                  onChange={(e) => handleInputChange('billOfLading', e.target.value)}
                  maxLength={35}
                  placeholder="Mandatory document ref"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shippingLine">Shipping Line / Airline Name</Label>
                <Input
                  id="shippingLine"
                  value={formData.shippingLine}
                  onChange={(e) => handleInputChange('shippingLine', e.target.value)}
                  maxLength={35}
                  placeholder="Optional"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portOfLoading">Port of Loading *</Label>
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
                <Label htmlFor="portOfDischarge">Port of Discharge *</Label>
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
                <Label htmlFor="placeOfDelivery">Place of Delivery</Label>
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Documents Submitted *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'Commercial Invoice',
                    'Packing List',
                    'Bill of Lading',
                    'Certificate of Origin',
                    'Insurance Certificate',
                    'Inspection Certificate'
                  ].map((doc) => (
                    <div key={doc} className="flex items-center space-x-2">
                      <Checkbox
                        id={doc}
                        checked={formData.documentsSubmitted.includes(doc)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('documentsSubmitted', [...formData.documentsSubmitted, doc]);
                          } else {
                            handleInputChange('documentsSubmitted', formData.documentsSubmitted.filter(d => d !== doc));
                          }
                        }}
                      />
                      <Label htmlFor={doc} className="text-sm">{doc}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uploadDocuments">Upload Documents *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Multiple uploads - With restrictions</p>
                  <Button variant="outline" className="mt-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks / Comments</Label>
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

          {/* Section 6: Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-corporate-blue">
                Section 6: Action Buttons
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualBillsForm;
