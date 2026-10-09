import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor() { }

  handleFileDownload(res: any, fileName: string, fileType: string) {
    const blob = new Blob([res], { type: fileType });
    saveAs(blob, fileName);
  }
}
