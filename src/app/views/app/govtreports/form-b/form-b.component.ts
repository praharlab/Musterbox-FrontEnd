import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import html2canvas from 'html2canvas';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { jsPDF } from 'jspdf';
@Component({
    selector: 'app-form-b',
    templateUrl: './form-b.component.html',
    styleUrls: ['./form-b.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FormBComponent implements OnInit {
  constructor(private spinner: NgxUiLoaderService) {}

  ngOnInit(): void {}

  savePdf() {
    this.spinner.start();
    let data = document.getElementById('form-b-content');
    html2canvas(data, { scale: 5, useCORS: true, allowTaint: true, scrollY: 0 }).then((canvas) => {
      const image = { type: 'png', quality: 100 };
      const margin = [1, 1];
      const filename = 'myfile.pdf';

      var imgWidth = 16.5;
      var pageHeight = 11.7;

      var innerPageWidth = imgWidth - margin[0] * 2;
      var innerPageHeight = pageHeight - margin[1] * 2;

      var pxFullHeight = canvas.height;
      var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      var nPages = Math.ceil(pxFullHeight / pxPageHeight);

      var pageHeight = innerPageHeight;

      var pageCanvas = document.createElement('canvas');
      var pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      var pdf = new jsPDF('l', 'in', 'a3');
      // pdf.internal.scaleFactor = 30;
      for (var page = 0; page < nPages; page++) {
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        var w = pageCanvas.width;
        var h = pageCanvas.height;
        pageCtx.fillStyle = 'gray';

        pageCtx.fillRect(20, 20, w, h);

        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        if (page > 0) pdf.addPage();
        var imgData = pageCanvas.toDataURL('image/png' + image.type, image.quality);
        pdf.addImage(
          imgData,
          image.type,
          margin[1],
          margin[0],
          innerPageWidth,
          pageHeight,
          'someAlias',
          'FAST',
        );
      }

      pdf.save('Form_B' + '.pdf');
      this.spinner.stop();
    });
  }
}
