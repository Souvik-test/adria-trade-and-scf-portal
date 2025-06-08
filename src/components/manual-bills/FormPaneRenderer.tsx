
import React from 'react';
import SubmissionDetailsPane from './SubmissionDetailsPane';
import LcApplicantDetailsPane from './LcApplicantDetailsPane';
import DrawingDetailsPane from './DrawingDetailsPane';
import ShipmentTransportationPane from './ShipmentTransportationPane';
import DocumentSubmissionPane from './DocumentSubmissionPane';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

interface FormPaneRendererProps {
  currentPane: number;
  submissionType: string;
  setSubmissionType: (value: string) => void;
  submissionDate: string;
  setSubmissionDate: (value: string) => void;
  submissionReference: string;
  setSubmissionReference: (value: string) => void;
  lcReference: string;
  setLcReference: (value: string) => void;
  corporateReference: string;
  lcCurrency: string;
  setLcCurrency: (value: string) => void;
  applicantName: string;
  setApplicantName: (value: string) => void;
  drawingCurrency: string;
  setDrawingCurrency: (value: string) => void;
  drawingAmount: string;
  setDrawingAmount: (value: string) => void;
  drawingDate: string;
  setDrawingDate: (value: string) => void;
  tenorType: string;
  setTenorType: (value: string) => void;
  tenorDays: string;
  setTenorDays: (value: string) => void;
  billDueDate: string;
  setBillDueDate: (value: string) => void;
  shipmentDetails: string;
  setShipmentDetails: (value: string) => void;
  billOfLadingNo: string;
  setBillOfLadingNo: (value: string) => void;
  documentTypes: string[];
  selectedDocuments: string[];
  customDocumentName: string;
  setCustomDocumentName: (value: string) => void;
  uploadedDocuments: UploadedDocument[];
  onLcSearch: () => void;
  onDocumentSelect: (docType: string, checked: boolean) => void;
  onAddCustomDocumentType: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentDelete: (id: string) => void;
}

const FormPaneRenderer: React.FC<FormPaneRendererProps> = (props) => {
  switch (props.currentPane) {
    case 0:
      return (
        <SubmissionDetailsPane
          submissionType={props.submissionType}
          setSubmissionType={props.setSubmissionType}
          submissionDate={props.submissionDate}
          setSubmissionDate={props.setSubmissionDate}
          submissionReference={props.submissionReference}
          setSubmissionReference={props.setSubmissionReference}
        />
      );
    case 1:
      return (
        <LcApplicantDetailsPane
          lcReference={props.lcReference}
          setLcReference={props.setLcReference}
          corporateReference={props.corporateReference}
          lcCurrency={props.lcCurrency}
          setLcCurrency={props.setLcCurrency}
          applicantName={props.applicantName}
          setApplicantName={props.setApplicantName}
          onLcSearch={props.onLcSearch}
        />
      );
    case 2:
      return (
        <DrawingDetailsPane
          drawingCurrency={props.drawingCurrency}
          setDrawingCurrency={props.setDrawingCurrency}
          drawingAmount={props.drawingAmount}
          setDrawingAmount={props.setDrawingAmount}
          drawingDate={props.drawingDate}
          setDrawingDate={props.setDrawingDate}
          tenorType={props.tenorType}
          setTenorType={props.setTenorType}
          tenorDays={props.tenorDays}
          setTenorDays={props.setTenorDays}
          billDueDate={props.billDueDate}
          setBillDueDate={props.setBillDueDate}
        />
      );
    case 3:
      return (
        <ShipmentTransportationPane
          shipmentDetails={props.shipmentDetails}
          setShipmentDetails={props.setShipmentDetails}
          billOfLadingNo={props.billOfLadingNo}
          setBillOfLadingNo={props.setBillOfLadingNo}
        />
      );
    case 4:
      return (
        <DocumentSubmissionPane
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

export default FormPaneRenderer;
