
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
    case 'document-submission':
      return (
        <DocumentSubmissionPane
          documentTypes={['Invoice', 'Packing List', 'Bill of Lading', 'Insurance Certificate', 'Certificate of Origin', "Beneficiary's Certificate"]}
          selectedDocuments={formData.selectedDocuments || []}
          customDocumentName={formData.customDocumentName || ''}
          setCustomDocumentName={(value: string) => updateFormData({ customDocumentName: value })}
          uploadedDocuments={formData.documents || []}
          onDocumentSelect={(docType: string, checked: boolean) => {
            const currentDocs = formData.selectedDocuments || [];
            const updatedDocs = checked 
              ? [...currentDocs, docType]
              : currentDocs.filter((doc: string) => doc !== docType);
            updateFormData({ selectedDocuments: updatedDocs });
          }}
          onAddCustomDocumentType={() => {
            if (formData.customDocumentName?.trim()) {
              const currentDocs = formData.selectedDocuments || [];
              updateFormData({ 
                selectedDocuments: [...currentDocs, formData.customDocumentName.trim()],
                customDocumentName: ''
              });
            }
          }}
          onFileSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || []);
            const newDocuments = files.map(file => ({
              id: Date.now().toString() + Math.random(),
              name: file.name,
              reference: '',
              date: new Date().toISOString().split('T')[0],
              type: file.type,
              file: file
            }));
            updateFormData({ 
              documents: [...(formData.documents || []), ...newDocuments]
            });
          }}
          onDocumentDelete={(id: string) => {
            const updatedDocs = (formData.documents || []).filter((doc: any) => doc.id !== id);
            updateFormData({ documents: updatedDocs });
          }}
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
