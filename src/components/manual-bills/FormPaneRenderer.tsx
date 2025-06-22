import React from 'react';
import SubmissionDetailsPane from './SubmissionDetailsPane';
import LcApplicantDetailsPane from './LcApplicantDetailsPane';
import DrawingDetailsPane from './DrawingDetailsPane';
import ShipmentTransportationPane from './ShipmentTransportationPane';
import DocumentSubmissionPane from './DocumentSubmissionPane';
import { ManualBillsFormPane } from '@/hooks/useManualBillsForm';

interface FormPaneRendererProps {
  currentPane: ManualBillsFormPane;
  formData: any;
  updateFormData: (updates: any) => void;
}

const FormPaneRenderer: React.FC<FormPaneRendererProps> = ({
  currentPane,
  formData,
  updateFormData
}) => {
  switch (currentPane) {
    case 'lc-applicant-details':
      return (
        <LcApplicantDetailsPane
          formData={formData}
          updateFormData={updateFormData}
        />
      );
    case 'drawing-details':
      return (
        <DrawingDetailsPane
          drawingCurrency={formData.billCurrency || ''}
          setDrawingCurrency={(value: string) => updateFormData({ billCurrency: value })}
          drawingAmount={formData.billAmount?.toString() || ''}
          setDrawingAmount={(value: string) => updateFormData({ billAmount: parseFloat(value) || 0 })}
          drawingDate={formData.billDate || ''}
          setDrawingDate={(value: string) => updateFormData({ billDate: value })}
          tenorType={formData.tenor || ''}
          setTenorType={(value: string) => updateFormData({ tenor: value })}
          tenorDays={''}
          setTenorDays={() => {}}
          billDueDate={''}
          setBillDueDate={() => {}}
        />
      );
    case 'shipment-transportation':
      return (
        <ShipmentTransportationPane
          shipmentDetails={formData.shipmentDate || ''}
          setShipmentDetails={(value: string) => updateFormData({ shipmentDate: value })}
          billOfLadingNo={formData.vesselName || ''}
          setBillOfLadingNo={(value: string) => updateFormData({ vesselName: value })}
        />
      );
    case 'submission-details':
      return (
        <SubmissionDetailsPane
          submissionType={'manual'}
          setSubmissionType={() => {}}
          submissionDate={formData.presentationDate || ''}
          setSubmissionDate={(value: string) => updateFormData({ presentationDate: value })}
          submissionReference={formData.presentingBank || ''}
          setSubmissionReference={(value: string) => updateFormData({ presentingBank: value })}
        />
      );
    case 'document-submission':
      return (
        <DocumentSubmissionPane
          documentTypes={[]}
          selectedDocuments={[]}
          customDocumentName={''}
          setCustomDocumentName={() => {}}
          uploadedDocuments={formData.documents || []}
          onDocumentSelect={() => {}}
          onAddCustomDocumentType={() => {}}
          onFileSelect={() => {}}
          onDocumentDelete={() => {}}
        />
      );
    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Pane "{currentPane}" is not yet implemented</p>
        </div>
      );
  }
};

export default FormPaneRenderer;
