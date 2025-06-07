
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft, FileText, Upload, Bot } from 'lucide-react';

interface ProductOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  methods: string[];
  selectedOption?: string;
  onOptionClick?: (option: string) => void;
  onMethodClick?: (method: string) => void;
}

const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
  isOpen,
  onClose,
  title,
  options,
  methods,
  selectedOption,
  onOptionClick,
  onMethodClick
}) => {
  if (!isOpen) return null;

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'manual':
        return <FileText className="w-8 h-8 text-muted-foreground" />;
      case 'upload':
        return <Upload className="w-8 h-8 text-muted-foreground" />;
      case 'contextual assistance':
      case 'interactive agent':
        return <Bot className="w-8 h-8 text-muted-foreground" />;
      default:
        return <FileText className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const getMethodDescription = (method: string) => {
    switch (method.toLowerCase()) {
      case 'manual':
        return 'Enter details manually through forms';
      case 'upload':
        return 'Upload documents and auto-extract data';
      case 'contextual assistance':
        return 'Use AI-powered contextual assistant';
      case 'interactive agent':
        return 'Use AI-powered interactive assistant';
      default:
        return 'Process using this method';
    }
  };

  // Order methods: Manual, Upload, Contextual Assistance
  const orderedMethods = [...methods].sort((a, b) => {
    const order = ['manual', 'upload', 'contextual assistance', 'interactive agent'];
    const aIndex = order.indexOf(a.toLowerCase());
    const bIndex = order.indexOf(b.toLowerCase());
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  // Filter methods based on selected option
  const getEnabledMethods = () => {
    if (!selectedOption) return orderedMethods;
    
    // Define which methods are available for each option type
    const methodMapping: { [key: string]: string[] } = {
      // Letter of Credit
      'Request Issuance': ['Manual', 'Upload', 'Contextual Assistance'],
      'Request Amendments': ['Manual', 'Upload', 'Contextual Assistance'],
      'Request Cancellation': ['Manual', 'Upload', 'Contextual Assistance'],
      'Approve/Reject Pre-Advised LC': ['Manual', 'Contextual Assistance'],
      'Record Amendment Response': ['Manual', 'Contextual Assistance'],
      'Request Transfer': ['Manual', 'Contextual Assistance'],
      'Request Assignment': ['Manual', 'Contextual Assistance'],
      
      // Bank Guarantee/SBLC
      'Request Reduction/Release': ['Manual', 'Contextual Assistance'],
      'Demand Submission': ['Manual', 'Upload', 'Contextual Assistance'],
      
      // Bills
      'Accept/Refuse': ['Manual', 'Contextual Assistance'],
      'Process Bill Settlement': ['Manual', 'Contextual Assistance'],
      'Pre-Check Bills': ['Manual', 'Upload'],
      'Resolve Discrepancies': ['Manual'],
      'Request Finance': ['Manual', 'Contextual Assistance'],
      'Present Bills': ['Manual', 'Upload'],
      'Present Bills(On Behalf Of)': ['Manual', 'Upload'],
      'Bill Payment': ['Manual', 'Contextual Assistance'],
      'Bill Acceptance/Refusal': ['Manual', 'Contextual Assistance'],
      
      // Shipping Guarantee
      'Request Link/Delink': ['Manual', 'Contextual Assistance'],
      
      // Trade Loan
      'Request Loan': ['Manual', 'Upload'],
      'Request Loan Update': ['Manual', 'Upload'],
    };

    const enabledMethods = methodMapping[selectedOption] || orderedMethods;
    return orderedMethods.filter(method => 
      enabledMethods.some(enabled => enabled.toLowerCase() === method.toLowerCase())
    );
  };

  const enabledMethods = getEnabledMethods();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-background">
          {/* Options Section */}
          {options.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.map((option) => (
                  <Card 
                    key={option} 
                    className="border-border hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => onOptionClick?.(option)}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <FileText className="w-8 h-8 text-muted-foreground mb-3" />
                      <h3 className="font-semibold mb-2">
                        {option}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {option.includes('Present') ? 'Submit bills for presentation' :
                         option.includes('Resolve') ? 'Address and resolve bill discrepancies' :
                         option.includes('Request') ? 'Apply for trade finance facilities' :
                         option.includes('Accept') ? 'Accept or refuse import bills' :
                         option.includes('Process') ? 'Process bill settlement' :
                         option.includes('Pre-Check') ? 'Pre-check bills before submission' :
                         'Click to proceed with this option'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Processing Methods Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Processing Methods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enabledMethods.map((method) => (
                <Card 
                  key={method} 
                  className="border-border hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => onMethodClick?.(method)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {getMethodIcon(method)}
                    <h4 className="font-medium mt-3 mb-2">
                      {method}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getMethodDescription(method)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionsModal;
