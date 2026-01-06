import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OutwardRemittanceFormData, COUNTRY_OPTIONS, CURRENCY_OPTIONS } from '@/types/internationalRemittance';
import { FileText, Download, Eye, Send, CheckCircle, Clock, Building2, User, CreditCard, Globe } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RemittanceReleaseDocumentsPaneProps {
  formData: OutwardRemittanceFormData;
  showPacs009: boolean;
  readOnly?: boolean;
}

const RemittanceReleaseDocumentsPane: React.FC<RemittanceReleaseDocumentsPaneProps> = ({ 
  formData, 
  showPacs009 = false,
  readOnly = false 
}) => {
  const [selectedDocument, setSelectedDocument] = useState<string>('debit-advice');

  const currency = formData.amountCharges.ccy || 'USD';
  const amount = typeof formData.amountCharges.instAmt === 'number' ? formData.amountCharges.instAmt : 0;
  
  const formatAmount = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amt);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCountryName = (code: string) => {
    return COUNTRY_OPTIONS.find(c => c.value === code)?.label || code;
  };

  const getCurrencyName = (code: string) => {
    return CURRENCY_OPTIONS.find(c => c.value === code)?.label || code;
  };

  // Document list
  const documents = [
    {
      id: 'debit-advice',
      type: 'Customer Debit Advice',
      sender: 'Bank Operations',
      receiver: formData.orderingCustomer.ordName || 'Ordering Customer',
      status: 'Ready',
      format: 'PDF',
    },
    {
      id: 'pacs008',
      type: 'pacs.008 - Customer Credit Transfer',
      sender: formData.routingSettlement.instgAgtBic || 'Instructing Agent',
      receiver: formData.routingSettlement.instdAgtBic || 'Instructed Agent',
      status: 'Ready',
      format: 'XML/ISO20022',
    },
    ...(showPacs009 ? [{
      id: 'pacs009',
      type: 'pacs.009 - Cover Payment',
      sender: formData.routingSettlement.instgAgtBic || 'Instructing Agent',
      receiver: formData.routingSettlement.instdAgtBic || 'Correspondent Bank',
      status: 'Ready',
      format: 'XML/ISO20022',
    }] : []),
  ];

  // Render Customer Debit Advice
  const renderDebitAdvice = () => (
    <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 space-y-6">
      {/* Bank Header */}
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold text-primary">GLOBAL TRADE BANK</h2>
        <p className="text-sm text-muted-foreground">International Banking Division</p>
        <p className="text-xs text-muted-foreground mt-1">123 Financial Street, Banking City, BC 12345</p>
      </div>

      {/* Document Title */}
      <div className="text-center">
        <h3 className="text-lg font-semibold uppercase tracking-wide">Customer Debit Advice</h3>
        <p className="text-sm text-muted-foreground">Outward International Remittance</p>
      </div>

      {/* Reference Details */}
      <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground">Transaction Reference</p>
          <p className="font-mono font-medium">{formData.paymentHeader.msgRef || 'MSG-XXXXXXXX'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">UETR</p>
          <p className="font-mono text-sm">{formData.paymentHeader.uetr || 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Value Date</p>
          <p className="font-medium">{formatDate(formData.paymentHeader.creDt)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Settlement Method</p>
          <p className="font-medium">{formData.paymentHeader.sttlmMtd === 'COVE' ? 'Cover Payment (COVE)' : 'Direct (INDA)'}</p>
        </div>
      </div>

      <Separator />

      {/* Ordering Customer */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Ordering Customer (Debtor)</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 pl-6">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="font-medium">{formData.orderingCustomer.ordName || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account Number</p>
            <p className="font-mono">{formData.orderingCustomer.ordAcct || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-sm">
              {[
                formData.orderingCustomer.ordAddr1,
                formData.orderingCustomer.ordAddr2,
                formData.orderingCustomer.ordCity,
                formData.orderingCustomer.ordState,
                formData.orderingCustomer.ordPostCode,
                getCountryName(formData.orderingCustomer.ordCountry)
              ].filter(Boolean).join(', ') || '-'}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Beneficiary */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Beneficiary (Creditor)</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 pl-6">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="font-medium">{formData.beneficiaryCustomer.benName || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account Number</p>
            <p className="font-mono">{formData.beneficiaryCustomer.benAcct || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bank BIC</p>
            <p className="font-mono">{formData.beneficiaryCustomer.benBic || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Country</p>
            <p>{getCountryName(formData.beneficiaryCustomer.benCountry)}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Amount Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Transaction Amount</h4>
        </div>
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Remittance Amount</p>
              <p className="text-2xl font-bold text-primary">{getCurrencyName(currency)}</p>
            </div>
            <p className="text-3xl font-bold">{formatAmount(amount)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pl-6">
          <div>
            <p className="text-xs text-muted-foreground">Charge Bearer</p>
            <p className="font-medium">
              {formData.amountCharges.chgBr === 'OUR' ? 'Sender Pays All (OUR)' :
               formData.amountCharges.chgBr === 'SHA' ? 'Shared (SHA)' :
               formData.amountCharges.chgBr === 'BEN' ? 'Beneficiary Pays (BEN)' : '-'}
            </p>
          </div>
          {formData.amountCharges.fxRate && (
            <div>
              <p className="text-xs text-muted-foreground">Exchange Rate</p>
              <p className="font-mono">{formData.amountCharges.fxRate}</p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Purpose & Remittance Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Additional Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 pl-6">
          <div>
            <p className="text-xs text-muted-foreground">Purpose Code</p>
            <p className="font-medium">{formData.regulatoryCompliance.purpCd || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Source of Funds</p>
            <p className="font-medium">{formData.regulatoryCompliance.srcFunds || '-'}</p>
          </div>
          {formData.remittanceInfo.rmtInfo && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Remittance Information</p>
              <p className="text-sm">{formData.remittanceInfo.rmtInfo}</p>
            </div>
          )}
          {formData.remittanceInfo.invRef && (
            <div>
              <p className="text-xs text-muted-foreground">Invoice Reference</p>
              <p className="font-mono">{formData.remittanceInfo.invRef}</p>
            </div>
          )}
        </div>
      </div>

      {/* SWIFT Message References */}
      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold text-sm">Embedded SWIFT Message References</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">pacs.008 Reference</p>
            <p className="font-mono text-sm">{formData.paymentHeader.msgRef || '-'}</p>
          </div>
          {showPacs009 && (
            <div>
              <p className="text-xs text-muted-foreground">pacs.009 Reference</p>
              <p className="font-mono text-sm">COV-{formData.paymentHeader.msgRef || 'XXXXXXXX'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>This is a system generated advice. For queries, please contact your relationship manager.</p>
        <p className="mt-1">Generated on: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );

  // Render pacs.008 Preview
  const renderPacs008Preview = () => (
    <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg overflow-auto">
      <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>${formData.paymentHeader.msgRef || 'MSG-XXXXXXXX'}</MsgId>
      <CreDtTm>${formData.paymentHeader.creDt || new Date().toISOString()}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>${formData.paymentHeader.sttlmMtd || 'INDA'}</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>${formData.paymentHeader.msgRef || 'MSG-XXXXXXXX'}</InstrId>
        <EndToEndId>${formData.paymentHeader.uetr || 'UETR-XXXXXXXX'}</EndToEndId>
        <UETR>${formData.paymentHeader.uetr || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}</UETR>
      </PmtId>
      <IntrBkSttlmAmt Ccy="${currency}">${formatAmount(amount)}</IntrBkSttlmAmt>
      <ChrgBr>${formData.amountCharges.chgBr || 'SHA'}</ChrgBr>
      <InstgAgt>
        <FinInstnId>
          <BICFI>${formData.routingSettlement.instgAgtBic || 'XXXXUSXX'}</BICFI>
        </FinInstnId>
      </InstgAgt>
      <InstdAgt>
        <FinInstnId>
          <BICFI>${formData.routingSettlement.instdAgtBic || 'XXXXGBXX'}</BICFI>
        </FinInstnId>
      </InstdAgt>
      <Dbtr>
        <Nm>${formData.orderingCustomer.ordName || 'Ordering Customer'}</Nm>
        <PstlAdr>
          <Ctry>${formData.orderingCustomer.ordCountry || 'US'}</Ctry>
        </PstlAdr>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <Othr>
            <Id>${formData.orderingCustomer.ordAcct || 'XXXXXXXXXXXX'}</Id>
          </Othr>
        </Id>
      </DbtrAcct>
      <Cdtr>
        <Nm>${formData.beneficiaryCustomer.benName || 'Beneficiary Customer'}</Nm>
        <PstlAdr>
          <Ctry>${formData.beneficiaryCustomer.benCountry || 'GB'}</Ctry>
        </PstlAdr>
      </Cdtr>
      <CdtrAcct>
        <Id>
          <Othr>
            <Id>${formData.beneficiaryCustomer.benAcct || 'XXXXXXXXXXXX'}</Id>
          </Othr>
        </Id>
      </CdtrAcct>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>${formData.beneficiaryCustomer.benBic || 'XXXXGBXX'}</BICFI>
        </FinInstnId>
      </CdtrAgt>
      <Purp>
        <Cd>${formData.regulatoryCompliance.purpCd || 'SALA'}</Cd>
      </Purp>
      <RmtInf>
        <Ustrd>${formData.remittanceInfo.rmtInfo || ''}</Ustrd>
      </RmtInf>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`}</pre>
    </div>
  );

  // Render pacs.009 Preview
  const renderPacs009Preview = () => (
    <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg overflow-auto">
      <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.009.001.08">
  <FICdtTrf>
    <GrpHdr>
      <MsgId>COV-${formData.paymentHeader.msgRef || 'MSG-XXXXXXXX'}</MsgId>
      <CreDtTm>${formData.paymentHeader.creDt || new Date().toISOString()}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>COVE</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>COV-${formData.paymentHeader.msgRef || 'MSG-XXXXXXXX'}</InstrId>
        <EndToEndId>${formData.paymentHeader.uetr || 'UETR-XXXXXXXX'}</EndToEndId>
        <UETR>${formData.paymentHeader.uetr || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}</UETR>
      </PmtId>
      <IntrBkSttlmAmt Ccy="${currency}">${formatAmount(amount)}</IntrBkSttlmAmt>
      <InstgAgt>
        <FinInstnId>
          <BICFI>${formData.routingSettlement.instgAgtBic || 'XXXXUSXX'}</BICFI>
        </FinInstnId>
      </InstgAgt>
      <InstdAgt>
        <FinInstnId>
          <BICFI>${formData.routingSettlement.instdAgtBic || 'XXXXGBXX'}</BICFI>
        </FinInstnId>
      </InstdAgt>
      <UndrlygCstmrCdtTrf>
        <OrgnlGrpInf>
          <OrgnlMsgId>${formData.paymentHeader.msgRef || 'MSG-XXXXXXXX'}</OrgnlMsgId>
          <OrgnlMsgNmId>pacs.008.001.08</OrgnlMsgNmId>
        </OrgnlGrpInf>
      </UndrlygCstmrCdtTrf>
    </CdtTrfTxInf>
  </FICdtTrf>
</Document>`}</pre>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Release Documents</h3>
          <p className="text-sm text-muted-foreground">
            Review and release documents for the remittance transaction
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <FileText className="h-3 w-3" />
          {documents.length} Document(s)
        </Badge>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents to Release
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  className={selectedDocument === doc.id ? 'bg-muted/50' : 'cursor-pointer hover:bg-muted/30'}
                  onClick={() => setSelectedDocument(doc.id)}
                >
                  <TableCell className="font-medium">{doc.type}</TableCell>
                  <TableCell className="font-mono text-sm">{doc.sender}</TableCell>
                  <TableCell className="font-mono text-sm">{doc.receiver}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {doc.format}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocument(doc.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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

      {/* Document Preview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Document Preview
            </CardTitle>
            <Tabs value={selectedDocument} onValueChange={setSelectedDocument}>
              <TabsList>
                <TabsTrigger value="debit-advice">Debit Advice</TabsTrigger>
                <TabsTrigger value="pacs008">pacs.008</TabsTrigger>
                {showPacs009 && <TabsTrigger value="pacs009">pacs.009</TabsTrigger>}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {selectedDocument === 'debit-advice' && renderDebitAdvice()}
            {selectedDocument === 'pacs008' && renderPacs008Preview()}
            {selectedDocument === 'pacs009' && showPacs009 && renderPacs009Preview()}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Email Notification */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Send className="h-4 w-4" />
            Customer Notification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Send Debit Advice to Customer</p>
              <p className="text-sm text-muted-foreground">
                Email will be sent to the ordering customer upon transaction release
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              Pending Release
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RemittanceReleaseDocumentsPane;
