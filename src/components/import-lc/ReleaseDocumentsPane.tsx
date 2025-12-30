import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImportLCFormData } from '@/types/importLC';
import { FileText, Send, Eye, Download, CheckCircle, Clock, Building } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ReleaseDocumentsPaneProps {
  formData: ImportLCFormData;
}

const ReleaseDocumentsPane: React.FC<ReleaseDocumentsPaneProps> = ({ formData }) => {
  // Get bank names from formData
  const issuingBank = formData.issuingBank || 'Issuing Bank';
  const advisingBank = formData.beneficiaryBankName || 'Advising Bank';

  // Mock release documents - in production, generated based on LC type and requirements
  const releaseDocuments = [
    {
      id: '1',
      documentType: 'MT 700 - Issue of a Documentary Credit',
      senderBank: issuingBank,
      receiverBank: advisingBank,
      status: 'generated' as const,
      generatedAt: new Date().toISOString()
    },
    {
      id: '2',
      documentType: 'MT 730 - Acknowledgement',
      senderBank: advisingBank,
      receiverBank: issuingBank,
      status: 'pending' as const,
      generatedAt: null
    },
    {
      id: '3',
      documentType: 'LC Advice to Beneficiary',
      senderBank: advisingBank,
      receiverBank: 'Beneficiary',
      status: 'pending' as const,
      generatedAt: null
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
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 gap-1">
            <Clock className="h-3 w-3" />
            Pending
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

  const generatedCount = releaseDocuments.filter(d => d.status === 'generated' || (d.status as string) === 'sent').length;

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
                <TableRow key={doc.id}>
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
                      {/* Preview button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={doc.status === 'pending'}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={doc.status === 'pending'}
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

      {/* MT 700 Preview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            MT 700 Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-1 max-h-60 overflow-auto">
            <p className="text-muted-foreground">:20: {formData.corporateReference || 'CORP-REF'}</p>
            <p className="text-muted-foreground">:40A: {formData.formOfDocumentaryCredit || 'IRREVOCABLE'}</p>
            <p className="text-muted-foreground">:31D: {formData.expiryDate || 'YYMMDD'} {formData.placeOfExpiry || 'PLACE'}</p>
            <p className="text-muted-foreground">:32B: {formData.currency || 'USD'}{formData.lcAmount?.toFixed(2) || '0.00'}</p>
            <p className="text-muted-foreground">:50: {formData.applicantName || 'APPLICANT NAME'}</p>
            <p className="text-muted-foreground">    {formData.applicantAddress || 'APPLICANT ADDRESS'}</p>
            <p className="text-muted-foreground">:59: {formData.beneficiaryName || 'BENEFICIARY NAME'}</p>
            <p className="text-muted-foreground">    {formData.beneficiaryAddress || 'BENEFICIARY ADDRESS'}</p>
            <p className="text-muted-foreground">:45A: {formData.descriptionOfGoods || 'GOODS DESCRIPTION'}</p>
            <p className="text-muted-foreground">:44E: {formData.portOfLoading || 'PORT OF LOADING'}</p>
            <p className="text-muted-foreground">:44F: {formData.portOfDischarge || 'PORT OF DISCHARGE'}</p>
            <p className="text-muted-foreground">:44C: {formData.latestShipmentDate || 'YYMMDD'}</p>
          </div>
        </CardContent>
      </Card>

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
              Additional documents will be released as per the LC terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseDocumentsPane;
