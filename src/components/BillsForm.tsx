
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
  const [submissionType, setSubmissionType] = useState('Pre-Check');
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
  const [lcExpiryPlace, setLcExpiryPlace] = useState('');
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
      lcExpiryPlace,
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
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-orange-400 hover:text-orange-500 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Bills under Export LC Management
            </h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-7xl mx-auto p-8 space-y-12">
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

          {/* Section 2: LC & Applicant Details */}
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
            lcExpiryPlace={lcExpiryPlace}
            setLcExpiryPlace={setLcExpiryPlace}
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

          {/* Section 4: Shipment & Transportation Details */}
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
