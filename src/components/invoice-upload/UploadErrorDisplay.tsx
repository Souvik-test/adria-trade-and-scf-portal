import React from 'react';
import { AlertCircle, FileX, Database, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UploadErrorDisplayProps {
  error: Error | null;
}

const UploadErrorDisplay: React.FC<UploadErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  const getErrorDetails = (errorMessage: string) => {
    // Parse error message and provide helpful guidance
    if (errorMessage.includes('Failed to create upload batch')) {
      return {
        icon: Database,
        title: 'Database Connection Error',
        description: 'Unable to create upload batch in the database.',
        suggestions: [
          'Check your internet connection',
          'Verify you are logged in',
          'Ensure you have permission to upload invoices',
          'Try refreshing the page and uploading again'
        ]
      };
    }

    if (errorMessage.includes('exceed 100 rows')) {
      return {
        icon: FileX,
        title: 'Row Limit Exceeded',
        description: 'Your file contains more than the maximum allowed 100 rows.',
        suggestions: [
          'Split your data into multiple files',
          'Remove extra rows beyond the 100 row limit',
          'Ensure only invoice data rows are included (exclude validation hints)'
        ]
      };
    }

    if (errorMessage.includes('Program ID') || errorMessage.includes('not found')) {
      return {
        icon: AlertTriangle,
        title: 'Program Validation Error',
        description: 'One or more program IDs in your file are invalid.',
        suggestions: [
          'Verify all Program IDs match existing active programs',
          'Check that Program Names match their corresponding Program IDs',
          'Download a fresh template to see the correct format'
        ]
      };
    }

    if (errorMessage.includes('Authentication') || errorMessage.includes('permission')) {
      return {
        icon: Shield,
        title: 'Authentication Error',
        description: 'You need to be logged in to upload invoices.',
        suggestions: [
          'Please log in to your account',
          'Check if your session has expired',
          'Verify you have invoice upload permissions'
        ]
      };
    }

    // Default error
    return {
      icon: AlertCircle,
      title: 'Upload Failed',
      description: errorMessage,
      suggestions: [
        'Check that your file format is correct (.xlsx or .xls)',
        'Ensure all required columns are present',
        'Verify your data matches the template format',
        'Try downloading a fresh template and copying your data'
      ]
    };
  };

  const errorDetails = getErrorDetails(error.message);
  const Icon = errorDetails.icon;

  return (
    <Alert variant="destructive" className="mb-4">
      <Icon className="h-5 w-5" />
      <AlertTitle className="text-base font-semibold">{errorDetails.title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm mb-3">{errorDetails.description}</p>
        <div className="text-sm">
          <p className="font-medium mb-2">How to fix:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {errorDetails.suggestions.map((suggestion, index) => (
              <li key={index} className="text-muted-foreground">{suggestion}</li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default UploadErrorDisplay;
