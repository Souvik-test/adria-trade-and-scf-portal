import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { ImportLCTemplate } from '@/services/importLCTemplateService';
import { format } from 'date-fns';

interface TemplateSearchResultsProps {
  templates: ImportLCTemplate[];
  onSelect: (template: ImportLCTemplate) => void;
  isLoading?: boolean;
}

const TemplateSearchResults: React.FC<TemplateSearchResultsProps> = ({
  templates,
  onSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Searching templates...
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No templates found. Try different search criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Search Results ({templates.length} found)</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template ID</TableHead>
              <TableHead>Template Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.template_id}</TableCell>
                <TableCell>{template.template_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {template.template_description || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(template.created_at), 'dd MMM yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelect(template)}
                    className="gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Use Template
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TemplateSearchResults;
