import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const generateInvoiceUploadTemplate = (): void => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Define headers
  const headers = [
    'Invoice No.',
    'Currency',
    'Amount',
    'Date',
    'Program Name',
    'Buyer Name',
    'Supplier Name'
  ];

  // Example data row
  const exampleRow = [
    'INV-2025-001',
    'USD',
    '10000',
    '14/10/2025',
    'TEST PROGRAM',
    'ABC Corp',
    'XYZ Supplier'
  ];

  // Validation hints row
  const validationHints = [
    'Format: INV-YYYY-NNN',
    'ISO code: USD, EUR, GBP',
    'Numeric only',
    'DD/MM/YYYY',
    'Must match existing program',
    'Registered buyer name',
    'Registered supplier name'
  ];

  // Create worksheet data
  const wsData = [
    headers,
    exampleRow,
    [''], // Empty row for separation
    ['Validation Hints:'],
    validationHints
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // Invoice No.
    { wch: 12 }, // Currency
    { wch: 12 }, // Amount
    { wch: 15 }, // Date
    { wch: 25 }, // Program Name
    { wch: 25 }, // Buyer Name
    { wch: 25 }  // Supplier Name
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice Upload');

  // Generate file name with current date
  const fileName = `Invoice_Upload_Template_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Write and download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};
