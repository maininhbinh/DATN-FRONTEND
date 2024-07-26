import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  Table as DocxTable,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  AlignmentType,
} from 'docx';

export const exportToWord = async (data : any) => {
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph('Item')],
          width: { size: 50, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph('Quantity')],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph('Price')],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
    ...data.map(row => 
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(row.item)],
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph(row.quantity.toString())],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph(row.price.toString())],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
        ],
      })
    ),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun('Bill Order')],
            heading: 'Heading1',
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph(' '), // Adding a space for better formatting
          new DocxTable({
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'bill_order.docx');
};