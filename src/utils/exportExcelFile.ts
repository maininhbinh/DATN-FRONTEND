import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



export const exportToExcel = ( data : any, fileName : any) => {
 
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write workbook and convert to binary string
    const workbookOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Convert binary string to array buffer
    const buffer = new ArrayBuffer(workbookOut.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < workbookOut.length; i++) {
      view[i] = workbookOut.charCodeAt(i) & 0xFF;
    }

    // Create a Blob from the array buffer
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    // Use file-saver to save the blob as a file
    saveAs(blob, `${fileName}.xlsx`);
  }