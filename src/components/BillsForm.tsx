
import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import SubmissionSection from './bills/SubmissionSection';
import LcDetailsSection from './bills/LcDetailsSection';
import DrawingDetailsSection from './bills/DrawingDetailsSection';
import ShipmentDetailsSection from './bills/ShipmentDetailsSection';
import DocumentSubmissionSection from './bills/DocumentSubmissionSection';
import ActionButtonsSection from './bills/ActionButtonsSection';
import { Document } from './bills/types';

interface BillsFormProps {
  onBack: () => void;
  onClose: () => void;
}

const BillsForm: React.FC<BillsFormProps> = ({ onBack, onClose }) => {
  const [submissionType, setSubmissionType] = useState('');
  const [submissionReference, setSubmissionReference] = useState('');
  const [submissionDate, setSubmissionDate] = useState<Date | null>(new Date());
  const [lcReferenceNumber, setLcReferenceNumber] = useState('');
  const [corporateReference, setCorporateReference] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [issuingBank, setIssuingBank] = useState('');
  const [lcCurrency, setLcCurrency] = useState('');
  const [lcAmount, setLcAmount] = useState('');
  const [lcIssueDate, setLcIssueDate] = useState<Date | null>(null);
  const [lcExpiryDate, setLcExpiryDate] = useState<Date | null>(null);
  const [drawingAmount, setDrawingAmount] = useState('');
  const [drawingCurrency, setDrawingCurrency] = useState('');
  const [tenor, setTenor] = useState('');
  const [tenorDays, setTenorDays] = useState('');
  const [latestShipmentDate, setLatestShipmentDate] = useState<Date | null>(null);
  const [actualShipmentDate, setActualShipmentDate] = useState<Date | null>(null);
  const [billOfLading, setBillOfLading] = useState('');
  const [shippingLine, setShippingLine] = useState('');
  const [portOfLoading, setPortOfLoading] = useState('');
  const [portOfDischarge, setPortOfDischarge] = useState('');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [remarks, setRemarks] = useState('');
  const [declaration, setDeclaration] = useState(false);

  const handleSubmit = () => {
    console.log('Bills submission data:', {
      submissionType,
      submissionReference,
      submissionDate,
      lcReferenceNumber,
      corporateReference,
      applicantName,
      issuingBank,
      lcCurrency,
      lcAmount,
      lcIssueDate,
      lcExpiryDate,
      drawingAmount,
      drawingCurrency,
      tenor,
      tenorDays,
      latestShipmentDate,
      actualShipmentDate,
      billOfLading,
      shippingLine,
      portOfLoading,
      portOfDischarge,
      placeOfDelivery,
      documents,
      remarks,
      declaration
    });
    alert('Bills submitted successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Bills under Export LC – Field Specification (Pre-check Submission)
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete all mandatory fields marked with * to proceed with submission
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 bg-muted/30">
          {/* Section 1: Submission Type and Export LC Selection */}
          <SubmissionSection
            submissionType={submissionType}
            setSubmissionType={setSubmissionType}
            submissionReference={submissionReference}
            setSubmissionReference={setSubmissionReference}
            submissionDate={submissionDate}
            lcReferenceNumber={lcReferenceNumber}
            setLcReferenceNumber={setLcReferenceNumber}
            corporateReference={corporateReference}
            setCorporateReference={setCorporateReference}
          />

          {/* Section 2: LC Details */}
          <LcDetailsSection
            applicantName={applicantName}
            setApplicantName={setApplicantName}
            issuingBank={issuingBank}
            setIssuingBank={setIssuingBank}
            lcCurrency={lcCurrency}
            setLcCurrency={setLcCurrency}
            lcAmount={lcAmount}
            setLcAmount={setLcAmount}
            lcIssueDate={lcIssueDate}
            setLcIssueDate={setLcIssueDate}
            lcExpiryDate={lcExpiryDate}
            setLcExpiryDate={setLcExpiryDate}
          />

          {/* Section 3: Drawing Details */}
          <DrawingDetailsSection
            drawingAmount={drawingAmount}
            setDrawingAmount={setDrawingAmount}
            drawingCurrency={drawingCurrency}
            setDrawingCurrency={setDrawingCurrency}
            tenor={tenor}
            setTenor={setTenor}
            tenorDays={tenorDays}
            setTenorDays={setTenorDays}
          />

          {/* Section 4: Shipment Details */}
          <ShipmentDetailsSection
            latestShipmentDate={latestShipmentDate}
            actualShipmentDate={actualShipmentDate}
            setActualShipmentDate={setActualShipmentDate}
            billOfLading={billOfLading}
            setBillOfLading={setBillOfLading}
            shippingLine={shippingLine}
            setShippingLine={setShippingLine}
            portOfLoading={portOfLoading}
            setPortOfLoading={setPortOfLoading}
            portOfDischarge={portOfDischarge}
            setPortOfDischarge={setPortOfDischarge}
            placeOfDelivery={placeOfDelivery}
            setPlaceOfDelivery={setPlaceOfDelivery}
          />

          {/* Section 5: Document Submission Details */}
          <DocumentSubmissionSection
            documents={documents}
            setDocuments={setDocuments}
            remarks={remarks}
            setRemarks={setRemarks}
            declaration={declaration}
            setDeclaration={setDeclaration}
          />

          {/* Action Buttons */}
          <ActionButtonsSection
            onBack={onBack}
            onSubmit={handleSubmit}
            submissionType={submissionType}
            submissionDate={submissionDate}
            lcReferenceNumber={lcReferenceNumber}
            declaration={declaration}
            documentsCount={documents.length}
          />
        </div>
      </div>
    </div>
  );
};

export default BillsForm;
