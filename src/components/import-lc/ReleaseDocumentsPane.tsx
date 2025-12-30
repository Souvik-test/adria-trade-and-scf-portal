import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImportLCFormData } from '@/types/importLC';
import { FileText, Send, Eye, Download, CheckCircle, Building, Mail, Plus, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReleaseDocumentsPaneProps {
  formData: ImportLCFormData;
}

const ReleaseDocumentsPane: React.FC<ReleaseDocumentsPaneProps> = ({ formData }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [emails, setEmails] = useState<string[]>(['']);
  const [showAdvicePreview, setShowAdvicePreview] = useState(false);

  // Get bank names from formData
  const issuingBank = formData.issuingBank || 'Issuing Bank';
  const advisingBank = formData.beneficiaryBankName || 'Advising Bank';

  // Mock release documents - removed MT 730 as this is LC Issuance
  const releaseDocuments = [
    {
      id: '1',
      documentType: 'MT 700 - Issue of a Documentary Credit',
      senderBank: issuingBank,
      receiverBank: advisingBank,
      status: 'generated' as const,
      generatedAt: new Date().toISOString(),
      details: {
        messageType: 'MT 700',
        senderBIC: 'TESTBANKXXX',
        receiverBIC: 'ADVBANKXXX',
        reference: formData.corporateReference || 'LC-REF-001',
        amount: `${formData.currency || 'USD'} ${formData.lcAmount?.toLocaleString() || '0.00'}`,
        expiryDate: formData.expiryDate || '',
        applicant: formData.applicantName || '',
        beneficiary: formData.beneficiaryName || ''
      }
    },
    {
      id: '2',
      documentType: 'LC Advice to Beneficiary',
      senderBank: advisingBank,
      receiverBank: 'Beneficiary',
      status: 'generated' as const,
      generatedAt: new Date().toISOString(),
      details: {
        messageType: 'LC Advice',
        reference: formData.corporateReference || 'LC-REF-001',
        amount: `${formData.currency || 'USD'} ${formData.lcAmount?.toLocaleString() || '0.00'}`,
        beneficiaryName: formData.beneficiaryName || '',
        beneficiaryAddress: formData.beneficiaryAddress || ''
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            Generated
          </Badge>
        );
      case 'sent':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 gap-1">
            <Send className="h-3 w-3" />
            Sent
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const generatedCount = releaseDocuments.filter(d => d.status === 'generated' || d.status === 'sent').length;

  const selectedDocData = releaseDocuments.find(d => d.id === selectedDocument);

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails.length > 0 ? newEmails : ['']);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Release Documents & Advices</h3>
        <Badge variant="secondary" className="gap-1">
          <FileText className="h-3 w-3" />
          {generatedCount} of {releaseDocuments.length} Generated
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Send className="h-4 w-4" />
            Documents to be Released
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Generated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releaseDocuments.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  className={`cursor-pointer ${selectedDocument === doc.id ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                  onClick={() => setSelectedDocument(doc.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.documentType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {doc.senderBank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {doc.receiverBank}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(doc.generatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocument(doc.id);
                          setShowAdvicePreview(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document Details Panel - shows when a document is selected */}
      {selectedDocData && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {selectedDocData.documentType} - Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Document Details */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(selectedDocData.details).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm font-medium">{value || '-'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MT 700 Preview */}
            {selectedDocData.details.messageType === 'MT 700' && showAdvicePreview && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                  <span className="text-sm font-medium">Sample MT 700 Advice</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowAdvicePreview(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted/30 p-4 font-mono text-sm space-y-1 max-h-64 overflow-auto">
                  <p className="text-foreground font-semibold">--- SWIFT MT 700 MESSAGE ---</p>
                  <p className="text-muted-foreground">:20: {formData.corporateReference || 'LC2024-001234'}</p>
                  <p className="text-muted-foreground">:27: Sequence of Total: 1/1</p>
                  <p className="text-muted-foreground">:40A: Form of Documentary Credit: {formData.formOfDocumentaryCredit || 'IRREVOCABLE'}</p>
                  <p className="text-muted-foreground">:20: Documentary Credit Number: {formData.corporateReference || 'LC2024-001234'}</p>
                  <p className="text-muted-foreground">:31C: Date of Issue: {new Date().toISOString().split('T')[0].replace(/-/g, '')}</p>
                  <p className="text-muted-foreground">:31D: Date and Place of Expiry: {formData.expiryDate?.replace(/-/g, '') || '250630'} {formData.placeOfExpiry || 'NEW YORK'}</p>
                  <p className="text-muted-foreground">:50: Applicant:</p>
                  <p className="text-muted-foreground pl-4">{formData.applicantName || 'ABC TRADING COMPANY LTD'}</p>
                  <p className="text-muted-foreground pl-4">{formData.applicantAddress || '123 BUSINESS STREET, CITY'}</p>
                  <p className="text-muted-foreground">:59: Beneficiary:</p>
                  <p className="text-muted-foreground pl-4">{formData.beneficiaryName || 'XYZ EXPORTS INC'}</p>
                  <p className="text-muted-foreground pl-4">{formData.beneficiaryAddress || '456 EXPORT AVENUE, COUNTRY'}</p>
                  <p className="text-muted-foreground">:32B: Currency Code, Amount: {formData.currency || 'USD'}{(formData.lcAmount || 1000000).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <p className="text-muted-foreground">:39A: Percentage Credit Amount Tolerance: {formData.tolerance || '05/05'}</p>
                  <p className="text-muted-foreground">:41A: Available With... By...: {formData.availableWith || 'ANY BANK'} BY {formData.availableBy || 'NEGOTIATION'}</p>
                  <p className="text-muted-foreground">:42C: Drafts at...: SIGHT</p>
                  <p className="text-muted-foreground">:43P: Partial Shipments: {formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED'}</p>
                  <p className="text-muted-foreground">:43T: Transshipment: {formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED'}</p>
                  <p className="text-muted-foreground">:44A: Loading on Board: {formData.portOfLoading || 'ANY PORT'}</p>
                  <p className="text-muted-foreground">:44B: For Transportation to: {formData.portOfDischarge || 'ANY PORT'}</p>
                  <p className="text-muted-foreground">:44C: Latest Date of Shipment: {formData.latestShipmentDate?.replace(/-/g, '') || '250615'}</p>
                  <p className="text-muted-foreground">:45A: Description of Goods and/or Services:</p>
                  <p className="text-muted-foreground pl-4">{formData.descriptionOfGoods || 'GOODS AS PER PROFORMA INVOICE'}</p>
                  <p className="text-muted-foreground">:46A: Documents Required:</p>
                  <p className="text-muted-foreground pl-4">+ COMMERCIAL INVOICE IN 3 ORIGINALS</p>
                  <p className="text-muted-foreground pl-4">+ FULL SET OF CLEAN ON BOARD BILL OF LADING</p>
                  <p className="text-muted-foreground pl-4">+ PACKING LIST IN 2 COPIES</p>
                  <p className="text-muted-foreground">:48: Period for Presentation: {formData.presentationPeriod || '21'} DAYS AFTER SHIPMENT DATE</p>
                  <p className="text-muted-foreground">:49: Confirmation Instructions: WITHOUT</p>
                  <p className="text-muted-foreground">:78: Instructions to Paying/Accepting/Negotiating Bank:</p>
                  <p className="text-muted-foreground pl-4">DOCUMENTS TO BE SENT BY COURIER IN ONE LOT</p>
                  <p className="text-foreground font-semibold mt-2">--- END OF MESSAGE ---</p>
                </div>
              </div>
            )}

            {/* LC Advice Preview */}
            {selectedDocData.details.messageType === 'LC Advice' && showAdvicePreview && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                  <span className="text-sm font-medium">Sample LC Advice Letter</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowAdvicePreview(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted/30 p-4 text-sm space-y-3 max-h-64 overflow-auto">
                  <div className="text-right text-muted-foreground">
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <p>Ref: {formData.corporateReference || 'LC2024-001234'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">To:</p>
                    <p>{formData.beneficiaryName || 'XYZ EXPORTS INC'}</p>
                    <p className="text-muted-foreground">{formData.beneficiaryAddress || '456 Export Avenue, Country'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Subject: Advice of Documentary Credit</p>
                  </div>
                  <div className="space-y-2">
                    <p>Dear Sir/Madam,</p>
                    <p>We are pleased to advise that we have received instructions to advise the following Documentary Credit in your favor:</p>
                    <div className="bg-muted rounded p-3 space-y-1">
                      <p><span className="font-medium">Issuing Bank:</span> {formData.issuingBank || 'International Bank'}</p>
                      <p><span className="font-medium">LC Number:</span> {formData.corporateReference || 'LC2024-001234'}</p>
                      <p><span className="font-medium">Amount:</span> {formData.currency || 'USD'} {(formData.lcAmount || 1000000).toLocaleString()}</p>
                      <p><span className="font-medium">Applicant:</span> {formData.applicantName || 'ABC Trading Company'}</p>
                      <p><span className="font-medium">Expiry Date:</span> {formData.expiryDate || '2025-06-30'}</p>
                    </div>
                    <p>Please examine the attached MT 700 message carefully and contact us immediately if you find any discrepancies.</p>
                    <p className="mt-4">Yours faithfully,</p>
                    <p className="font-semibold">{formData.beneficiaryBankName || 'Advising Bank'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Routing Section */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Route to Customer Email(s)</Label>
              </div>
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="flex-1 max-w-md"
                    />
                    {emails.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEmail(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddEmail}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Email
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Documents will be sent to the specified email address(es) after approval.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Release Notes */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Send className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-700 dark:text-blue-400">
              Ready for Release
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-500">
              Upon submission, the MT 700 message will be generated and sent to the advising bank. 
              Click on a document row to view details and configure email routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseDocumentsPane;
