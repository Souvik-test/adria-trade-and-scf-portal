
import React from 'react';
import BillDetailsPane from './BillDetailsPane';
import FinanceDetailsPane from './FinanceDetailsPane';
import RepaymentDetailsPane from './RepaymentDetailsPane';
import UploadSupportingDocumentPane from './UploadSupportingDocumentPane';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

interface RequestFinancePaneRendererProps {
  currentPane: number;
  billReference: string;
  setBillReference: (value: string) => void;
  lcReference: string;
  billCurrency: string;
  setBillCurrency: (value: string) => void;
  billAmount: string;
  setBillAmount: (value: string) => void;
  billDueDate: string;
  setBillDueDate: (value: string) => void;
  financeRequestType: string;
  setFinanceRequestType: (value: string) => void;
  financeProductType: string;
  setFinanceProductType: (value: string) => void;
  financeCurrency: string;
  setFinanceCurrency: (value: string) => void;
  financeAmountRequested: string;
  setFinanceAmountRequested: (value: string) => void;
  financeRequestDate: string;
  setFinanceRequestDate: (value: string) => void;
  financeTenureDays: string;
  setFinanceTenureDays: (value: string) => void;
  financeDueDate: string;
  setFinanceDueDate: (value: string) => void;
  interestRate: string;
  setInterestRate: (value: string) => void;
  interestCurrency: string;
  interestAmount: string;
  purposeOfFinance: string;
  setPurposeOfFinance: (value: string) => void;
  principalRepaymentAmount: string;
  interestRepaymentAmount: string;
  totalRepaymentAmount: string;
  principalRepaymentAccountNumber: string;
  setPrincipalRepaymentAccountNumber: (value: string) => void;
  interestRepaymentAccountNumber: string;
  setInterestRepaymentAccountNumber: (value: string) => void;
  documentTypes: string[];
  selectedDocuments: string[];
  customDocumentName: string;
  setCustomDocumentName: (value: string) => void;
  uploadedDocuments: UploadedDocument[];
  onBillSearch: () => void;
  onDocumentSelect: (docType: string, checked: boolean) => void;
  onAddCustomDocumentType: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentDelete: (id: string) => void;
}

const RequestFinancePaneRenderer: React.FC<RequestFinancePaneRendererProps> = (props) => {
  switch (props.currentPane) {
    case 0:
      return (
        <BillDetailsPane
          billReference={props.billReference}
          setBillReference={props.setBillReference}
          lcReference={props.lcReference}
          billCurrency={props.billCurrency}
          setBillCurrency={props.setBillCurrency}
          billAmount={props.billAmount}
          setBillAmount={props.setBillAmount}
          billDueDate={props.billDueDate}
          setBillDueDate={props.setBillDueDate}
          onBillSearch={props.onBillSearch}
        />
      );
    case 1:
      return (
        <FinanceDetailsPane
          financeRequestType={props.financeRequestType}
          setFinanceRequestType={props.setFinanceRequestType}
          financeProductType={props.financeProductType}
          setFinanceProductType={props.setFinanceProductType}
          financeCurrency={props.financeCurrency}
          setFinanceCurrency={props.setFinanceCurrency}
          financeAmountRequested={props.financeAmountRequested}
          setFinanceAmountRequested={props.setFinanceAmountRequested}
          financeRequestDate={props.financeRequestDate}
          setFinanceRequestDate={props.setFinanceRequestDate}
          financeTenureDays={props.financeTenureDays}
          setFinanceTenureDays={props.setFinanceTenureDays}
          financeDueDate={props.financeDueDate}
          setFinanceDueDate={props.setFinanceDueDate}
          interestRate={props.interestRate}
          setInterestRate={props.setInterestRate}
          interestCurrency={props.interestCurrency}
          interestAmount={props.interestAmount}
          purposeOfFinance={props.purposeOfFinance}
          setPurposeOfFinance={props.setPurposeOfFinance}
        />
      );
    case 2:
      return (
        <RepaymentDetailsPane
          principalRepaymentAmount={props.principalRepaymentAmount}
          interestRepaymentAmount={props.interestRepaymentAmount}
          totalRepaymentAmount={props.totalRepaymentAmount}
          principalRepaymentAccountNumber={props.principalRepaymentAccountNumber}
          setPrincipalRepaymentAccountNumber={props.setPrincipalRepaymentAccountNumber}
          interestRepaymentAccountNumber={props.interestRepaymentAccountNumber}
          setInterestRepaymentAccountNumber={props.setInterestRepaymentAccountNumber}
        />
      );
    case 3:
      return (
        <UploadSupportingDocumentPane
          documentTypes={props.documentTypes}
          selectedDocuments={props.selectedDocuments}
          customDocumentName={props.customDocumentName}
          setCustomDocumentName={props.setCustomDocumentName}
          uploadedDocuments={props.uploadedDocuments}
          onDocumentSelect={props.onDocumentSelect}
          onAddCustomDocumentType={props.onAddCustomDocumentType}
          onFileSelect={props.onFileSelect}
          onDocumentDelete={props.onDocumentDelete}
        />
      );
    default:
      return null;
  }
};

export default RequestFinancePaneRenderer;
