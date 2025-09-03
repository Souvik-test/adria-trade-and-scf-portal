import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShippingGuaranteeFormData } from '@/types/shippingGuarantee';

interface ReviewSubmitPaneProps {
  formData: ShippingGuaranteeFormData;
  onFieldChange: (field: string, value: any) => void;
}

const ReviewSubmitPane: React.FC<ReviewSubmitPaneProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Shipping Guarantee Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Guarantee Reference:</span>
                <p className="font-medium">{formData.guaranteeReference || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Corporate Reference:</span>
                <p className="font-medium">{formData.corporateReference || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Issue Date:</span>
                <p className="font-medium">{formData.issueDate || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Expiry Date:</span>
                <p className="font-medium">{formData.expiryDate || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p className="font-medium">
                  {formData.currency} {formData.guaranteeAmount?.toLocaleString() || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Guarantee Type:</span>
                <p className="font-medium">{formData.guaranteeType || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Party Details */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Party Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-muted-foreground mb-2">Applicant</h4>
                <p className="font-medium">{formData.applicantName || 'Not specified'}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.applicantAddress || 'Address not specified'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-2">Beneficiary</h4>
                <p className="font-medium">{formData.beneficiaryName || 'Not specified'}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.beneficiaryAddress || 'Address not specified'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Details */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Shipping Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Vessel Name:</span>
                <p className="font-medium">{formData.vesselName || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Voyage Number:</span>
                <p className="font-medium">{formData.voyageNumber || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">B/L Number:</span>
                <p className="font-medium">{formData.billOfLadingNumber || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Port of Loading:</span>
                <p className="font-medium">{formData.portOfLoading || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Port of Discharge:</span>
                <p className="font-medium">{formData.portOfDischarge || 'Not specified'}</p>
              </div>
            </div>
            
            {formData.cargoDescription && (
              <div className="mt-4">
                <span className="text-muted-foreground">Cargo Description:</span>
                <p className="font-medium mt-1">{formData.cargoDescription}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Supporting Documents */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Supporting Documents</h3>
            {formData.supportingDocuments && formData.supportingDocuments.length > 0 ? (
              <div className="space-y-2">
                {formData.supportingDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No documents uploaded</p>
            )}
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Ready to Submit:</strong> Please review all the information above carefully. 
              Once submitted, the shipping guarantee request will be processed by the trade finance team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSubmitPane;