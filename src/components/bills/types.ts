
export interface Document {
  id: string;
  type: string;
  documentNo: string;
  documentDate: Date | null;
  file: File | null;
  isCustom: boolean;
}

export interface BillsFormData {
  submissionType: string;
  submissionReference: string;
  submissionDate: Date | null;
  lcReferenceNumber: string;
  corporateReference: string;
  applicantName: string;
  issuingBank: string;
  lcCurrency: string;
  lcAmount: string;
  lcIssueDate: Date | null;
  lcExpiryDate: Date | null;
  drawingAmount: string;
  drawingCurrency: string;
  tenor: string;
  tenorDays: string;
  latestShipmentDate: Date | null;
  actualShipmentDate: Date | null;
  billOfLading: string;
  shippingLine: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfDelivery: string;
  documents: Document[];
  remarks: string;
  declaration: boolean;
}
