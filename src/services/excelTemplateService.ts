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
    'Invoice Date',
    'Due Date',
    'Program ID',
    'Program Name',
    'Buyer ID',
    'Buyer Name',
    'Seller ID',
    'Seller Name'
  ];

  // Example data row
  const exampleRow = [
    'INV-2025-001',
    'USD',
    '10000',
    '14/10/2025',
    '13/11/2025',
    'TESTPROG2',
    'Savy Test',
    'BID001',
    'ABC Corp',
    'SID001',
    'XYZ Supplier'
  ];

  // Validation hints row
  const validationHints = [
    'Format: INV-YYYY-NNN',
    'Must match program currency',
    'Numeric only',
    'DD/MM/YYYY format',
    'DD/MM/YYYY format',
    'Must match existing program',
    'Must match program name',
    'Required if Buyer is NOT anchor',
    'Registered buyer name',
    'Required if Seller is NOT anchor',
    'Registered seller name'
  ];

  // Create worksheet data
  const wsData = [
    headers,
    exampleRow,
    [''], // Empty row for separation
    ['Validation Hints:'],
    validationHints,
    [''], // Empty row
    ['Important Notes:'],
    ['1. Maximum 100 rows per upload'],
    ['2. Multiple programs allowed in same file'],
    ['3. Invoice currency MUST match program currency'],
    ['4. If Buyer is anchor: Buyer does NOT need to be in counterparties, but Seller ID is REQUIRED'],
    ['5. If Seller is anchor: Seller does NOT need to be in counterparties, but Buyer ID is REQUIRED'],
    ['6. Non-anchor party must be registered in program counterparties with matching ID']
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // Invoice No.
    { wch: 12 }, // Currency
    { wch: 12 }, // Amount
    { wch: 15 }, // Invoice Date
    { wch: 15 }, // Due Date
    { wch: 20 }, // Program ID
    { wch: 25 }, // Program Name
    { wch: 15 }, // Buyer ID
    { wch: 25 }, // Buyer Name
    { wch: 15 }, // Seller ID
    { wch: 25 }  // Seller Name
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
