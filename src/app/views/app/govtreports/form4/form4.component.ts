import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-form4',
    templateUrl: './form4.component.html',
    styleUrls: ['./form4.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form4Component implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  apiURL = environment.apiUrl;
  permissionview: any;
  finaldata: boolean = false;
  company_id: any;
  scrollBarHorizontal: boolean;
  company1: any;
  companyData: any;
  branch: any;
  fromMonth: any;
  toMonth: any;
  rows: any = [];
  result: any;
  companydata: any;
  result1: any;
  company: any;
  Branch: any;
  resultColumns: any[];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;

          this.spinner.stop();
        }
      });
  }


  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Form-4' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }


  onSubmit() {
    this.rows = [];
    this.resultColumns = [];
    this.spinner.start();
    this.fromMonth = this.datefilter.value.fromyearmonth;
    this.result = this.fromMonth.slice(5, 7);

    this.toMonth = this.datefilter.value.toyearmonth;
    this.result1 = this.toMonth.slice(5, 7);

    this.company = this.datefilter.value.company;
    this.Branch = this.datefilter.value.branch;

    if (
      this.company != '' &&
      this.company != null &&
      this.Branch != '' &&
      this.Branch != null &&
      this.fromMonth != '' &&
      this.fromMonth != null &&
      this.toMonth != '' &&
      this.toMonth != null
    ) {
      for (var i = this.result; i <= this.result1; i++) {
        let result = this.fromMonth.slice(0, 4);
        const date = new Date();
        date.setMonth(i - 1);

        let month = date.toLocaleString('en-US', {
          month: 'long',
        });

        this.rows.push({
          year: result,
          month: month,
        });

        if (this.rows.length > 8) {
        }
      }

      this.finaldata = true;
    } else {
      this.finaldata = false;
    }
    this.spinner.stop();
    for (var key in this.rows[0]) {

      this.resultColumns.push({
        name: key,
        prop: key,
        flexGrow: 1.2,
        minWidth: 200,
      });
    }
  }

  selectcompany(id) {
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.branch = res;

        this.spinner.stop();
      });

    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
        }
      });
  }
  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.finaldata = false;
      this.ngOnInit();
      this.rows = [];
    }, 100);
  }
  // dataShorting() {
  //   if (this.rows.length > 0) {
  //     $(document).ready(function () {
  //       $("#form4-content tr:nth-child(15)").after(
  //         '<tr style="border-bottom: 1px solid ; height:50px"><td style="border:none">&nbsp;</td><td style="border:none" colspan="8">&nbsp;</td><td style="border:none">&nbsp;</td><td style="border:none">&nbsp;</td><td style="border:none">&nbsp;</td><td style="border:none">&nbsp;</td><td style="border:none">&nbsp;</td></tr>'
  //       );
  //     });
  //   }
  // }

  savePdf() {
    // this.dataShorting();
    // setTimeout(()=>{
    //   this.spinner.start();
    // let data = document.getElementById('form4-content');
    // html2canvas(data, {scale:5 , useCORS: true, allowTaint: true, scrollY: 0 }).then((canvas) => {
    //   const image = { type: 'png', quality: 100 };
    //   const margin = [1, 1];
    //   const filename = 'myfile.pdf';

    //   var imgWidth = 16.5;
    //   var pageHeight = 11.7;

    //   var innerPageWidth = imgWidth - margin[0] * 2;
    //   var innerPageHeight = pageHeight - margin[1] * 2;

    //   var pxFullHeight = canvas.height;
    //   var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
    //   var nPages = Math.ceil(pxFullHeight / pxPageHeight);

    //   var pageHeight = innerPageHeight;

    //   var pageCanvas = document.createElement('canvas');
    //   var pageCtx = pageCanvas.getContext('2d');
    //   pageCanvas.width = canvas.width;
    //   pageCanvas.height = pxPageHeight;

    //   var pdf = new jsPDF('l', 'in',  'a3');
    //   // pdf.internal.scaleFactor = 30;
    //   for (var page = 0; page < nPages; page++) {
    //     if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
    //       pageCanvas.height = pxFullHeight % pxPageHeight;
    //       pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
    //     }

    //     var w = pageCanvas.width;
    //     var h = pageCanvas.height;
    //     pageCtx.fillStyle = 'gray';

    //     pageCtx.fillRect(20, 20, w, h);

    //     pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

    //     if (page > 0) pdf.addPage();
    //     var imgData = pageCanvas.toDataURL('image/png' + image.type, image.quality);
    //     pdf.addImage(imgData, image.type, margin[1], margin[0], innerPageWidth, pageHeight);
    //   }

    //  pdf.save("form4.pdf")
    // //  this.spinner.stop();
    // window.location.reload();
    // });
    // },200);
    var doc = new jsPDF('landscape');

    var col = [];
    var row = [];

    /* The following array of object as response from the API req  */
    this.resultColumns.forEach((element) => {
      col.push(element.name);
    });
    var img = new Image();
    this.api
      .callApi(
        this.constant.VIEWCOMPANYDATA + this.datefilter.value.company,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe((res: any) => {
        this.companydata = res.data;

        img.src = this.apiURL + 'uploads/company/logo/' + this.companydata.companyLogo;

        this.rows.forEach(function (row, index) {
          row.ANo = index + 1;
        });
        var itemNew = this.rows;

        itemNew.forEach((element) => {
          var ele = Object.values(element);

          var array = [];
          for (var k = 0; k < ele.length; k++) {
            if (k > 0) {
              if (k == 1) {
                var string =
                  'No any Fine for the month of ' + String(ele[0]) + ' ' + String(ele[1]);
                array.push(string);
              } else {
                var string = String(ele[k]);

                array.push(string);
              }
            }
          }
          var temp = string;

          row.push(temp);
        });

        const col = [
          'SlNo1',
          'Name',
          'Father’s/ Husband’s Name',
          'Sex',
          'Designation And Department',
          'Dates on Which overtime worked',
          'Extent of overtime each occasion',
          'Total overtime worked or production in case of piece-workers',

          'Normal hours',
          'Normal rate',
          'Overime rate',
          'Normal earnings',
          'Overime earnings',
          'Total earnings',
          'Date on which overtime payment made',
        ];

        var headers = [
          { title: 'Sl No', columnWidth: 'auto' },
          { title: 'Name', columnWidth: 'auto' },
          { title: 'Father’s/ Husband’s Name', columnWidth: 'auto' },
          { title: 'Sex', columnWidth: 'auto' },
          { title: 'Designation And Department', columnWidth: 'auto' },
          {
            title: 'Dates on Which overtime worked',
            columnWidth: 'auto',
          },
          {
            title: 'Extent of overtime each occasion',
            columnWidth: 'auto',
          },
          {
            title: 'Total overtime worked or production in case of piece-workers',
            columnWidth: 'auto',
          },
          { title: 'Normal hours', columnWidth: 'auto' },
          { title: 'Normal rate', columnWidth: 'auto' },
          { title: 'Overime rate', columnWidth: 'auto' },
          { title: 'Normal earnings', columnWidth: 'auto' },
          { title: 'Overime earnings', columnWidth: 'auto' },
          { title: 'Total earnings', columnWidth: 'auto' },
          {
            title: 'Date on which overtime payment made123',
            columnWidth: 'auto',
          },
        ];
        const rowData = [
          [
            { content: '1' },
            {
              content: 'Whether workman showed cause against fine or not, if so, enter date',
              colSpan: 6,
            },
            { content: '' },
            { content: '' },
            { content: '' },
            { content: '' },
          ],
          [
            { content: '1' },
            {
              content: 'Whether workman showed cause against fine or not, if so, enter date',
              colSpan: 6,
            },
            { content: '' },
            { content: '' },
            { content: '' },
            { content: '' },
          ],
          [
            { content: '1' },
            {
              content: 'Whether workman showed cause against fine or not, if so, enter date',
              colSpan: 6,
            },
            { content: '' },
            { content: '' },
            { content: '' },
            { content: '' },
          ],
          [
            { content: '1' },
            {
              content: 'Whether workman showed cause against fine or not, if so, enter date',
              colSpan: 6,
            },
            { content: '' },
            { content: '' },
            { content: '' },
            { content: '' },
          ],
        ];

        autoTable(doc, {
          html: '#form4-content',
          theme: 'grid',
          head: [col],
          headStyles: {
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            halign: 'center',
            fontSize: 16,
            valign: 'middle',
          },
          bodyStyles: {
            lineColor: [0, 0, 0],
            minCellHeight: 9,
            minCellWidth: 9,
            valign: 'middle',
            fontSize: 10,
            // halign: 'center',
            fontStyle: 'bold',
          },

          // body: rowData,
          styles: { font: 'Times New Roman' },
          // margin: { top: 50 },
          startY: 50,
          // didDrawPage: (dataArg) => {
          //   doc.setFontSize(10);

          //   if (img.complete) {
          //     doc.addImage(img, 'png', 15, 3, 20, 15)
          //   } else {
          //     img.onload = () => {
          //       doc.addImage(img, 'png', 15, 3, 20, 15)
          //     };

          //     img.onerror = () => {

          //     };
          //   }

          //   doc.text("Name:- " + this.companydata.companyName, 15, 24);

          //   doc.text("Add:- " + this.companydata.companyAddress, 15, 28);
          //   doc.setFontSize(20);
          //   doc.text('Salary Register', 110, 36);
          // },
          didDrawPage: (dataArg) => {
            doc.setFontSize(10);
            if (img.complete) {
              doc.addImage(img, 'png', 15, 3, 20, 15);
            } else {
              img.onload = () => {
                doc.addImage(img, 'png', 15, 3, 20, 15);
              };

              img.onerror = () => {
                console.log('error');
              };
            }
            // var pageCount = doc.internal.getNumberOfPages();
            const pageCount = (doc as any).internal.getNumberOfPages();

            if (pageCount == 1) {
              // doc.html('margin-top: 40px !important');

              // doc.addImage(img, 'png',15, 3, 20, 15)

              doc.setFontSize(26);
              doc.setFont('Times New Roman');
              doc.text('FORM NO. 4', 150, 20, { align: 'center' });
              doc.setFontSize(9);
              doc.text('[Rule-25(2)]', 150, 30, { align: 'center' });
              doc.setFontSize(11);
              doc.text('Overtime Register for Workers', 150, 38, {
                align: 'center',
              });
              doc.setFontSize(10);
              doc.text('Month Ending ' + this.datefilter.value.toyearmonth.slice(0, 4), 150, 46, {
                align: 'center',
              });

              // doc.text('Attendance Salary Report '+this.datefilter.value.YearMM, 110, 36);
            } else {
            }
          },
        });

        doc.save(
          'Form4_' +
            this.datefilter.value.fromyearmonth +
            '_' +
            this.datefilter.value.toyearmonth +
            '.pdf',
        );
      });
  }
}
