import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import JsPDF from 'jspdf';
require('jspdf-autotable');
import { config } from 'dotenv';

config();
@Injectable()
export class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(
    fileData: any,
    fileName: string,
    contentType: string,
    moduleName: string
  ): Promise<string> {
    let bufferData;
    if (contentType === 'application/pdf') {
      bufferData = await this.generatePDFBuffer(fileData, moduleName);
    } else {
      bufferData = fileData;
    }
    const params: S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: bufferData,
      ACL: 'public-read',
      ContentType: contentType,
    };

    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }

  async generatePDFBuffer(data: any[], moduleName: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      if (!data || data.length === 0) {
        reject(new Error('Data is empty or undefined.'));
        return;
      }
      const snakeCaseToTitleCase = (inputArray) => {
        return inputArray.map((str) =>
          str
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
      };
      const columnNames: string[] = Object.keys(data[0]);
      const doc = new JsPDF('landscape');
      const titleCaseArray = snakeCaseToTitleCase(columnNames);
      const tableData = data.map((row) =>
        columnNames.map((col) => {
          try {
            return row[col] !== null ? row[col].toString() : '';
          } catch (error) {
            console.error(`Error converting ${col} in row:`, row);
            return '';
          }
        })
      );

      doc.text(`${moduleName}`, 10, 10);

      const columnWidths: number[] = tableData.reduce((acc, row) => {
        row.forEach((cell, columnIndex) => {
          const cellWidth = doc.getStringUnitWidth(cell) + 6; // Add some padding
          acc[columnIndex] = Math.max(acc[columnIndex] || 0, cellWidth);
        });
        return acc;
      }, []);

      const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);

      const pageWidth = doc.internal.pageSize.width - 20;
      const scaleFactor = pageWidth / totalWidth;
      const scaledWidths: number[] = columnWidths.map(
        (width) => width * scaleFactor
      );

      (doc as any).autoTable({
        head: [titleCaseArray],
        body: tableData,
        headStyles: {
          fillColor: [100, 100, 100],
          textColor: [255, 255, 255],
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 10,
        },
        columnStyles: scaledWidths.map((width) => ({ cellWidth: width })),
        startY: 20,
      });

      const pdfBuffer = doc.output('arraybuffer');

      resolve(Buffer.from(pdfBuffer));
    });
  }
}
