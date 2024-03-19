import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
import moment from 'moment';
@Injectable()
export class ExportService {
  constructor(private readonly s3Service: S3Service) {}

  async exportDataToS3(
    data: any[],
    getAllInterface: any,
    fileNamePrefix: string,
    moduleName: string
  ): Promise<string> {
    if (!data || data.length === 0) {
      throw new Error('Data is empty or undefined.');
    }

    // const columnNames = JSON.parse(getAllInterface.tableHeaders);
    // function filterObjectByKeys(obj, keys) {
    //   const filteredObj = {};
    //   for (const key of keys) {
    //     if (obj.hasOwnProperty(key)) {
    //       filteredObj[key] = obj[key];
    //     }
    //   }
    //   return filteredObj;
    // }
    // const filteredData = data.map((item) =>
    //   filterObjectByKeys(item, columnNames)
    // );
    const filteredData = data;
    const toPascalCase = (title) => {
      return title
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
    };
    const convertPrefix = toPascalCase(fileNamePrefix);
    const downloadType = getAllInterface.downloadType.toLowerCase().trim();
    let csvPDfContent;
    if (downloadType === 'csv') {
      const csvData = [];
      const snakeCaseToTitleCase = (inputArray) => {
        return inputArray.map((str) =>
          str
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
      };
      const headers = Object.keys(filteredData[0]);

      csvData.push(headers.join(','));
      filteredData.forEach((row) => {
        const values = headers.map((header) => row[header]);
        csvData.push(values.join(','));
      });
      csvData[0] = snakeCaseToTitleCase(csvData[0].split(',')).join(',');
      csvPDfContent = Buffer.from(csvData.join('\n'));
    } else if (downloadType === 'pdf') {
      csvPDfContent = filteredData;
    }

    const currentDate = moment().format('MM-DD-YYYY-HH-mm-ss');
    const fileName = `${convertPrefix}_${currentDate}.${downloadType}`;
    const contentType = `application/${downloadType}`;
    return await this.s3Service.uploadFile(
      csvPDfContent,
      fileName,
      contentType,
      moduleName
    );
  }
}
