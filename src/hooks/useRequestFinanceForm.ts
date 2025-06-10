
import { useState } from 'react';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

export const useRequestFinanceForm = () => {
  const [currentPane, setCurrentPane] = useState(0);
  
  // Bill Details
  const [billReference, setBillReference] = useState('');
  const [lcReference, setLcReference] = useState('');
  const [billCurrency, setBillCurrency] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState('');
  
  // Finance Details
  const [financeRequestType, setFinanceRequestType] = useState('');
  const [financeProductType, setFinanceProductType] = useState('');
  const [financeCurrency, setFinanceCurrency] = useState('');
  const [financeAmountRequested, setFinanceAmountRequested] = useState('');
  const [financeRequestDate, setFinanceRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [financeTenureDays, setFinanceTenureDays] = useState('');
  const [financeDueDate, setFinanceDueDate] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [interestCurrency, setInterestCurrency] = useState('');
  const [interestAmount, setInterestAmount] = useState('');
  const [purposeOfFinance, setPurposeOfFinance] = useState('');
  
  // Repayment Details
  const [principalRepaymentAmount, setPrincipalRepaymentAmount] = useState('');
  const [interestRepaymentAmount, setInterestRepaymentAmount] = useState('');
  const [totalRepaymentAmount, setTotalRepaymentAmount] = useState('');
  const [principalRepaymentAccountNumber, setPrincipalRepaymentAccountNumber] = useState('');
  const [interestRepaymentAccountNumber, setInterestRepaymentAccountNumber] = useState('');
  
  // Document Upload
  const [documentTypes, setDocumentTypes] = useState([
    'Invoice',
    'Packing List',
    'Bill of Lading',
    'Certificate of Origin',
    'Insurance Certificate',
    'Commercial Invoice',
    'Customs Declaration'
  ]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  return {
    currentPane,
    setCurrentPane,
    billReference,
    setBillReference,
    lcReference,
    setLcReference,
    billCurrency,
    setBillCurrency,
    billAmount,
    setBillAmount,
    billDueDate,
    setBillDueDate,
    financeRequestType,
    setFinanceRequestType,
    financeProductType,
    setFinanceProductType,
    financeCurrency,
    setFinanceCurrency,
    financeAmountRequested,
    setFinanceAmountRequested,
    financeRequestDate,
    setFinanceRequestDate,
    financeTenureDays,
    setFinanceTenureDays,
    financeDueDate,
    setFinanceDueDate,
    interestRate,
    setInterestRate,
    interestCurrency,
    setInterestCurrency,
    interestAmount,
    setInterestAmount,
    purposeOfFinance,
    setPurposeOfFinance,
    principalRepaymentAmount,
    setPrincipalRepaymentAmount,
    interestRepaymentAmount,
    setInterestRepaymentAmount,
    totalRepaymentAmount,
    setTotalRepaymentAmount,
    principalRepaymentAccountNumber,
    setPrincipalRepaymentAccountNumber,
    interestRepaymentAccountNumber,
    setInterestRepaymentAccountNumber,
    documentTypes,
    setDocumentTypes,
    selectedDocuments,
    setSelectedDocuments,
    customDocumentName,
    setCustomDocumentName,
    uploadedDocuments,
    setUploadedDocuments,
    showDocumentDetails,
    setShowDocumentDetails,
    pendingFile,
    setPendingFile
  };
};
