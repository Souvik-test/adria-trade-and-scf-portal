
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Building2, CreditCard, MapPin, Calendar, DollarSign, User, Landmark } from 'lucide-react';
import LCSearchDropdown from './LCSearchDropdown';

interface ImportLC {
  id: string;
  corporate_reference: string;
  lc_amount: number | null;
  currency: string | null;
  expiry_date: string | null;
  place_of_expiry: string | null;
  applicant_name: string | null;
  issuing_bank: string | null;
  status: string | null;
}

interface LcApplicantDetailsPaneProps {
  formData: any;
  updateFormData: (updates: any) => void;
}

const LcApplicantDetailsPane: React.FC<LcApplicantDetailsPaneProps> = ({
  formData,
  updateFormData
}) => {
  const handleLCSelect = (lcReference: string, lcData: ImportLC) => {
    console.log('Selected LC:', lcReference, lcData);
    
    // Auto-populate fields based on selected LC
    updateFormData({
      lcReference,
      corporateReference: lcData.corporate_reference,
      lcCurrency: lcData.currency || 'USD',
      lcAmount: lcData.lc_amount || 0,
      lcExpiryPlace: lcData.place_of_expiry || '',
      lcExpiryDate: lcData.expiry_date || '',
      applicantName: lcData.applicant_name || '',
      issuingBank: lcData.issuing_bank || ''
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-600 shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-corporate-blue" />
          LC & Applicant Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LC Reference - Searchable */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              LC Reference Number <span className="text-red-500">*</span>
            </Label>
            <LCSearchDropdown
              value={formData.lcReference || ''}
              onSelect={handleLCSelect}
              placeholder="Search and select LC Reference..."
            />
          </div>

          {/* Corporate Reference - Auto-populated */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Corporate Reference Number
            </Label>
            <Input
              value={formData.corporateReference || ''}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              placeholder="Auto-populated from LC"
            />
          </div>

          {/* LC Currency - Auto-populated */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              LC Currency
            </Label>
            <Input
              value={formData.lcCurrency || ''}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              placeholder="Auto-populated from LC"
            />
          </div>

          {/* LC Amount - Auto-populated */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              LC Amount
            </Label>
            <Input
              value={formData.lcAmount ? formData.lcAmount.toLocaleString() : ''}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              placeholder="Auto-populated from LC"
            />
          </div>

          {/* LC Expiry Place - Auto-populated */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              LC Expiry Place
            </Label>
            <Input
              value={formData.lcExpiryPlace || ''}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              placeholder="Auto-populated from LC"
            />
          </div>

          {/* LC Expiry Date - Auto-populated */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              LC Expiry Date
            </Label>
            <Input
              value={formData.lcExpiryDate ? formatDate(formData.lcExpiryDate) : ''}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              placeholder="Auto-populated from LC"
            />
          </div>

          {/* Applicant Name - Auto-populated */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User className="h-4 w-4" />
              Applicant Name
            </Label>
            <Input
              value={formData.applicantName || ''}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              placeholder="Auto-populated from LC"
            />
          </div>

          {/* Issuing Bank - Auto-populated */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              Issuing Bank
            </Label>
            <Input
              value={formData.issuingBank || ''}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              placeholder="Auto-populated from LC"
            />
          </div>
        </div>

        {/* Information Note */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> Select an LC Reference to auto-populate the Corporate Reference, LC Currency, 
            LC Amount, LC Expiry Place, LC Expiry Date, Applicant Name, and Issuing Bank fields.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LcApplicantDetailsPane;
