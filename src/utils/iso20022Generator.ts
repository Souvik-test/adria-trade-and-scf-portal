// ISO 20022 XML Generator for PACS.008 and PACS.009

import { OutwardRemittanceFormData, FICreditTransferFormData } from '@/types/internationalRemittance';

/**
 * Generate ISO 20022 PACS.008 CustomerCreditTransferInitiation XML
 */
export const generatePACS008XML = (data: OutwardRemittanceFormData): string => {
  const { paymentHeader, orderingCustomer, beneficiaryCustomer, amountCharges, routingSettlement, regulatoryCompliance, remittanceInfo } = data;
  
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString();
    return new Date(dateStr).toISOString();
  };

  const formatAmount = (amt: number | ''): string => {
    if (amt === '' || amt === null || amt === undefined) return '0.00';
    return Number(amt).toFixed(2);
  };

  const escapeXml = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>${escapeXml(paymentHeader.msgRef)}</MsgId>
      <CreDtTm>${formatDate(paymentHeader.creDt)}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>${escapeXml(paymentHeader.sttlmMtd)}</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>${escapeXml(paymentHeader.msgRef)}</InstrId>
        <EndToEndId>${escapeXml(paymentHeader.msgRef)}</EndToEndId>
        <UETR>${escapeXml(paymentHeader.uetr)}</UETR>
      </PmtId>
      <IntrBkSttlmAmt Ccy="${escapeXml(amountCharges.ccy)}">${formatAmount(amountCharges.instAmt)}</IntrBkSttlmAmt>
      <IntrBkSttlmDt>${new Date().toISOString().split('T')[0]}</IntrBkSttlmDt>
      <ChrgBr>${escapeXml(amountCharges.chgBr)}</ChrgBr>
      <InstgAgt>
        <FinInstnId>
          <BICFI>${escapeXml(routingSettlement.instgAgtBic)}</BICFI>
        </FinInstnId>
      </InstgAgt>
      <InstdAgt>
        <FinInstnId>
          <BICFI>${escapeXml(routingSettlement.instdAgtBic)}</BICFI>
        </FinInstnId>
      </InstdAgt>${routingSettlement.intrmyBic ? `
      <IntrmyAgt1>
        <FinInstnId>
          <BICFI>${escapeXml(routingSettlement.intrmyBic)}</BICFI>
          ${routingSettlement.intrmyName ? `<Nm>${escapeXml(routingSettlement.intrmyName)}</Nm>` : ''}
        </FinInstnId>
      </IntrmyAgt1>` : ''}
      <Dbtr>
        <Nm>${escapeXml(orderingCustomer.ordName)}</Nm>
        <PstlAdr>
          <Ctry>${escapeXml(orderingCustomer.ordCountry)}</Ctry>
          ${orderingCustomer.ordState ? `<CtrySubDvsn>${escapeXml(orderingCustomer.ordState)}</CtrySubDvsn>` : ''}
          ${orderingCustomer.ordCity ? `<TwnNm>${escapeXml(orderingCustomer.ordCity)}</TwnNm>` : ''}
          ${orderingCustomer.ordPostCode ? `<PstCd>${escapeXml(orderingCustomer.ordPostCode)}</PstCd>` : ''}
          ${orderingCustomer.ordAddr1 ? `<StrtNm>${escapeXml(orderingCustomer.ordAddr1)}</StrtNm>` : ''}
          ${orderingCustomer.ordAddr2 ? `<BldgNb>${escapeXml(orderingCustomer.ordAddr2)}</BldgNb>` : ''}
        </PstlAdr>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <Othr>
            <Id>${escapeXml(orderingCustomer.ordAcct)}</Id>
          </Othr>
        </Id>
      </DbtrAcct>
      <Cdtr>
        <Nm>${escapeXml(beneficiaryCustomer.benName)}</Nm>
        <PstlAdr>
          <Ctry>${escapeXml(beneficiaryCustomer.benCountry)}</Ctry>
          ${beneficiaryCustomer.benState ? `<CtrySubDvsn>${escapeXml(beneficiaryCustomer.benState)}</CtrySubDvsn>` : ''}
          ${beneficiaryCustomer.benCity ? `<TwnNm>${escapeXml(beneficiaryCustomer.benCity)}</TwnNm>` : ''}
          ${beneficiaryCustomer.benPostCode ? `<PstCd>${escapeXml(beneficiaryCustomer.benPostCode)}</PstCd>` : ''}
          ${beneficiaryCustomer.benAddr1 ? `<StrtNm>${escapeXml(beneficiaryCustomer.benAddr1)}</StrtNm>` : ''}
          ${beneficiaryCustomer.benAddr2 ? `<BldgNb>${escapeXml(beneficiaryCustomer.benAddr2)}</BldgNb>` : ''}
        </PstlAdr>
      </Cdtr>
      <CdtrAcct>
        <Id>
          <Othr>
            <Id>${escapeXml(beneficiaryCustomer.benAcct)}</Id>
          </Othr>
        </Id>
      </CdtrAcct>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>${escapeXml(beneficiaryCustomer.benBic)}</BICFI>
        </FinInstnId>
      </CdtrAgt>
      <Purp>
        <Cd>${escapeXml(regulatoryCompliance.purpCd)}</Cd>
      </Purp>
      <RmtInf>
        ${remittanceInfo.rmtInfo ? `<Ustrd>${escapeXml(remittanceInfo.rmtInfo)}</Ustrd>` : ''}
        ${remittanceInfo.invRef ? `<Strd><RfrdDocInf><Nb>${escapeXml(remittanceInfo.invRef)}</Nb></RfrdDocInf></Strd>` : ''}
      </RmtInf>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`;

  return xml;
};

/**
 * Generate ISO 20022 PACS.009 FinancialInstitutionCreditTransfer XML
 */
export const generatePACS009XML = (data: FICreditTransferFormData): string => {
  const { settlementHeader, instructingAgent, instructedAgent, settlementAmount, coverLinkage, settlementInstructions } = data;
  
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString();
    return new Date(dateStr).toISOString();
  };

  const formatAmount = (amt: number | ''): string => {
    if (amt === '' || amt === null || amt === undefined) return '0.00';
    return Number(amt).toFixed(2);
  };

  const escapeXml = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.009.001.08"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <FICdtTrf>
    <GrpHdr>
      <MsgId>${escapeXml(settlementHeader.sttlmRef)}</MsgId>
      <CreDtTm>${formatDate(settlementHeader.creDt)}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>${escapeXml(settlementHeader.sttlmMtd)}</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>${escapeXml(settlementHeader.sttlmRef)}</InstrId>
        <EndToEndId>${escapeXml(coverLinkage.linkedPacs008Ref || settlementHeader.sttlmRef)}</EndToEndId>
        <UETR>${escapeXml(settlementHeader.uetr)}</UETR>
      </PmtId>
      <IntrBkSttlmAmt Ccy="${escapeXml(settlementAmount.ccy)}">${formatAmount(settlementAmount.sttlmAmt)}</IntrBkSttlmAmt>
      <IntrBkSttlmDt>${escapeXml(settlementAmount.valDt) || new Date().toISOString().split('T')[0]}</IntrBkSttlmDt>
      <InstgAgt>
        <FinInstnId>
          <BICFI>${escapeXml(instructingAgent.instgAgtBic)}</BICFI>
          <Nm>${escapeXml(instructingAgent.instgAgtName)}</Nm>
        </FinInstnId>
      </InstgAgt>
      <InstdAgt>
        <FinInstnId>
          <BICFI>${escapeXml(instructedAgent.instdAgtBic)}</BICFI>
          <Nm>${escapeXml(instructedAgent.instdAgtName)}</Nm>
        </FinInstnId>
      </InstdAgt>
      <Dbtr>
        <FinInstnId>
          <BICFI>${escapeXml(instructingAgent.instgAgtBic)}</BICFI>
          <Nm>${escapeXml(instructingAgent.instgAgtName)}</Nm>
        </FinInstnId>
      </Dbtr>
      <Cdtr>
        <FinInstnId>
          <BICFI>${escapeXml(instructedAgent.instdAgtBic)}</BICFI>
          <Nm>${escapeXml(instructedAgent.instdAgtName)}</Nm>
        </FinInstnId>
      </Cdtr>${coverLinkage.linkedUetr ? `
      <UndrlygCstmrCdtTrf>
        <InstdAmt Ccy="${escapeXml(settlementAmount.ccy)}">${formatAmount(settlementAmount.sttlmAmt)}</InstdAmt>
        <OrgnlTxRef>
          <UETR>${escapeXml(coverLinkage.linkedUetr)}</UETR>
        </OrgnlTxRef>
      </UndrlygCstmrCdtTrf>` : ''}${settlementInstructions.instrCd ? `
      <InstrForCdtrAgt>
        <Cd>${escapeXml(settlementInstructions.instrCd)}</Cd>
        ${settlementInstructions.addtlInfo ? `<InstrInf>${escapeXml(settlementInstructions.addtlInfo)}</InstrInf>` : ''}
      </InstrForCdtrAgt>` : ''}
    </CdtTrfTxInf>
  </FICdtTrf>
</Document>`;

  return xml;
};

/**
 * Generate PACS.009 data from PACS.008 data (for COVE settlement)
 */
export const generatePACS009FromPACS008 = (pacs008Data: OutwardRemittanceFormData): FICreditTransferFormData => {
  const { paymentHeader, amountCharges, routingSettlement, remittanceInfo } = pacs008Data;
  
  return {
    settlementHeader: {
      sttlmRef: `COV-${paymentHeader.msgRef}`,
      uetr: `${paymentHeader.uetr.substring(0, 8)}-COVER-${Date.now().toString(36)}`,
      creDt: new Date().toISOString(),
      sttlmMtd: 'COVE',
    },
    instructingAgent: {
      instgAgtName: 'Instructing Bank',
      instgAgtBic: routingSettlement.instgAgtBic,
      instgAgtAddr: '',
    },
    instructedAgent: {
      instdAgtName: 'Instructed Bank',
      instdAgtBic: routingSettlement.instdAgtBic,
      instdAgtAddr: '',
    },
    settlementAmount: {
      sttlmAmt: amountCharges.instAmt,
      ccy: amountCharges.ccy,
      valDt: new Date().toISOString().split('T')[0],
    },
    coverLinkage: {
      linkedPacs008Ref: paymentHeader.msgRef,
      linkedUetr: paymentHeader.uetr,
    },
    settlementInstructions: {
      instrCd: '',
      addtlInfo: remittanceInfo.rmtInfo || '',
    },
  };
};

/**
 * Download XML content as a file
 */
export const downloadXML = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Format XML with proper indentation for display
 */
export const formatXMLForDisplay = (xml: string): string => {
  // The XML is already formatted, just return it
  return xml.trim();
};
