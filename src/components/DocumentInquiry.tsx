import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileSearch, FileDown } from 'lucide-react';
import { 
  DocumentRecord, 
  DocumentFilters, 
  fetchDocuments, 
  downloadDocument, 
  exportToExcel 
} from '@/services/documentInquiryService';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const DocumentInquiry = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<DocumentFilters>({
    documentType: 'All',
    direction: 'All',
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await fetchDocuments(filters);
      setDocuments(results);
      toast({
        title: 'Search Complete',
        description: `Found ${results.length} document(s)`,
      });
    } catch (error: any) {
      toast({
        title: 'Search Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: DocumentRecord) => {
    try {
      await downloadDocument(doc);
      toast({
        title: 'Download Started',
        description: `Downloading ${doc.documentName}`,
      });
    } catch (error: any) {
      toast({
        title: 'Download Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    exportToExcel(documents);
    toast({
      title: 'Export Complete',
      description: 'Document list exported to Excel',
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Inquiry</h1>
          <p className="text-muted-foreground">Search and retrieve document records</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select
              value={filters.documentType}
              onValueChange={(value) => setFilters({ ...filters, documentType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Export LC">Export LC</SelectItem>
                <SelectItem value="Bank Guarantee">Bank Guarantee</SelectItem>
                <SelectItem value="Documentary Collection">Documentary Collection</SelectItem>
                <SelectItem value="Invoice Template">Invoice Template</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Direction</Label>
            <Select
              value={filters.direction}
              onValueChange={(value) => setFilters({ ...filters, direction: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Uploaded">Uploaded</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Document Name</Label>
            <Input
              placeholder="Search by name..."
              value={filters.documentName || ''}
              onChange={(e) => setFilters({ ...filters, documentName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>From Date</Label>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>To Date</Label>
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>User ID (Optional)</Label>
            <Input
              placeholder="Enter user ID..."
              value={filters.userId || ''}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleSearch} disabled={loading}>
            <FileSearch className="mr-2 h-4 w-4" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
          <Button variant="outline" onClick={() => setFilters({ documentType: 'All', direction: 'All' })}>
            Clear Filters
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={documents.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No documents found. Use the filters above to search.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.documentName}</TableCell>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell>{doc.direction}</TableCell>
                  <TableCell>{format(new Date(doc.date), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="font-mono text-sm">{doc.userId.substring(0, 8)}...</TableCell>
                  <TableCell>{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
