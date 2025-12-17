import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Loader2, CheckCircle } from 'lucide-react';
import { generateSpecificationDocument } from '@/services/specificationDocumentService';
import { useToast } from '@/hooks/use-toast';

const SpecificationDocument = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateSpecificationDocument();
      toast({
        title: 'Document Generated',
        description: 'The specification document has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sections = [
    { number: '1', title: 'Executive Summary', description: 'System overview and key features' },
    { number: '2', title: 'System Architecture Overview', description: 'Configuration flow and component relationships' },
    { number: '3', title: 'Dynamic Form Engine', description: 'Product Event Mapping, Panes & Sections, Field Definition' },
    { number: '4', title: 'NextGen Workflow Configurator', description: 'Templates, Stages, Field Configuration, Conditions' },
    { number: '5', title: 'Runtime Components', description: 'Dynamic Transaction Form and Transaction Management' },
    { number: '6', title: 'Database Schema Reference', description: 'Transaction and User Permission tables' },
    { number: '7', title: 'API/RPC Functions', description: 'Security definer functions for custom authentication' },
    { number: '8', title: 'Security & Access Control', description: 'Business application context and stage permissions' },
    { number: '9', title: 'Appendix', description: 'Type definitions, status mappings, trigger types' },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Technical Specification Document
          </h1>
          <p className="text-muted-foreground">
            Dynamic Form Engine & NextGen Workflow Configurator
          </p>
        </div>

        {/* Download Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Document
            </CardTitle>
            <CardDescription>
              Generate and download the complete technical specification as a Word document (.docx)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Document...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download as Word Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Document Contents Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Document Contents</CardTitle>
            <CardDescription>
              The specification document includes the following sections:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.number}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                    {section.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            The generated document includes approximately 25-35 pages with complete database schemas,
            UI descriptions, and technical specifications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecificationDocument;
