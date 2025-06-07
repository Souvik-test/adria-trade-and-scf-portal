
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft, FileText, Upload, Bot } from 'lucide-react';

interface ProductOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  methods: string[];
  onOptionClick?: (option: string) => void;
  onMethodClick?: (method: string) => void;
}

const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
  isOpen,
  onClose,
  title,
  options,
  methods,
  onOptionClick,
  onMethodClick
}) => {
  if (!isOpen) return null;

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'manual':
        return <FileText className="w-8 h-8 text-gray-600 dark:text-gray-400" />;
      case 'upload':
        return <Upload className="w-8 h-8 text-gray-600 dark:text-gray-400" />;
      case 'contextual assistance':
      case 'interactive agent':
        return <Bot className="w-8 h-8 text-gray-600 dark:text-gray-400" />;
      default:
        return <FileText className="w-8 h-8 text-gray-600 dark:text-gray-400" />;
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-900 text-white rounded-t-lg">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-gray-900 text-white">
          {/* Options Section */}
          {options.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.map((option) => (
                  <Card 
                    key={option} 
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => onOptionClick?.(option)}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <FileText className="w-8 h-8 text-gray-400 mb-3" />
                      <h3 className="font-semibold text-white mb-2">
                        {option}
                      </h3>
                      <p className="text-sm text-gray-400">
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
            <h3 className="text-lg font-semibold text-white mb-4">
              Processing Methods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {methods.map((method) => (
                <Card 
                  key={method} 
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onMethodClick?.(method)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {getMethodIcon(method)}
                    <h4 className="font-medium text-white mt-3 mb-2">
                      {method}
                    </h4>
                    <p className="text-sm text-gray-400">
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
