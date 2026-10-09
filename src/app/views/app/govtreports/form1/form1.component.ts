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
    selector: 'app-form1',
    templateUrl: './form1.component.html',
    styleUrls: ['./form1.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form1Component implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  apiURL = environment.apiUrl;
  permissionview: any;
  finaldata: boolean = false;
  company_id: any;
  scrollBarHorizontal: boolean;
  company1: any;
  dataValue: any;
  companyData: any;
  branch: any;
  fromMonth: any;
  toMonth: any;
  rows: any = [];
  result: any;
  result1: any;
  company: any;
  Branch: any;
  startYear: number;
  branch1: any;
  companydata: any;
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
              permissionval.formName == 'Form-1' && permissionval.operationName.includes('View')
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

    let startyear = this.datefilter.value.fromyearmonth.slice(0, 4);
    let startmonth = this.datefilter.value.fromyearmonth.slice(5, 7);

    let startyearmonth = startyear.concat(startmonth);

    let endyear = this.datefilter.value.toyearmonth.slice(0, 4);
    let endmonth = this.datefilter.value.toyearmonth.slice(5, 7);

    let endyearmonth = endyear.concat(endmonth);

    let monthArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    let monthName = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let startTimeString = startyearmonth;
    let endTimeString = endyearmonth;
    let startYear = parseInt(startTimeString.slice(0, 4));
    let endYear = parseInt(endTimeString.slice(0, 4));
    let startMonth = startTimeString.slice(4, startTimeString.length);
    let endMonth = endTimeString.slice(4, endTimeString.length);

    this.company = this.datefilter.value.company;
    this.Branch = this.datefilter.value.branch;

    if (
      this.company != '' &&
      this.company != null &&
      this.Branch != '' &&
      this.Branch != null &&
      startTimeString != '' &&
      startTimeString != null &&
      endTimeString != '' &&
      endTimeString != null
    ) {
      if (startyear == endyear) {
        for (var i = startmonth; i <= endmonth; i++) {
          let result = startyear;
          const date = new Date();
          date.setMonth(i - 1);

          let month = date.toLocaleString('en-US', {
            month: 'long',
          });

          this.rows.push({
            year: result,
            month: month,
          });
        }
      } else {
        let i = 0;

        while (startYear <= endYear) {
          if (i === 0) {
            // If first time loop run
            let startMonthIndex = monthArray.findIndex((val) => val === startMonth); //Find Index for starting month
            for (let j = startMonthIndex; j < monthArray.length; j++) {
              // this.rows.push(`${monthName[j]},${startYear}`);
              this.rows.push({
                month: monthName[j],
                year: startYear,
              });
            }
          } else if (startYear === endYear) {
            // If Last time loop run
            let endMonthIndex = monthArray.findIndex((val) => val === endMonth); //Find Index for last month
            for (let j = 0; j <= endMonthIndex; j++) {
              // this.rows.push(`${monthName[j]},${startYear}`);
              this.rows.push({
                month: monthName[j],
                year: startYear,
              });
            }
          } else {
            //If between loop run
            for (let j = 0; j < monthArray.length; j++) {
              // this.rows.push(`${monthName[j]} ${startYear}`);
              this.rows.push({
                month: monthName[j],
                year: startYear,
              });
            }
          }

          //Incrimenting values after each loop
          i++;
          startYear++;
        }
      }
      this.selectBranch();
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

  selectBranch() {
    this.api
      .callApi(
        this.constant.VIEWBRANCH + this.datefilter.value.branch,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.branch1 = res.data;
        }
      });
  }
  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.finaldata = false;
      this.resultColumns = [];
      this.rows = [];
      this.ngOnInit();
    }, 100);
  }

  savePdf() {
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
          [
            { content: 'SrNo' },
            { content: 'Name' },
            { content: 'Father’s/ Husband’s Name' },
            { content: 'Sex' },
            { content: 'Department' },
            {
              content: 'Nature and date of the offence for which fine imposed',
            },
            {
              content: 'Whether workman showed cause against fine or not, if so, enter date',
            },
            { content: 'Rate of Wages' },
            { content: 'Date and amount of fine imposed' },
            { content: 'Date on which fine realised' },
            { content: 'Remarks' },
          ],
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
          html: '#form1-content',
          theme: 'grid',

          headStyles: {
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            halign: 'center',
            valign: 'middle',
          },
          bodyStyles: {
            lineColor: [0, 0, 0],
            cellPadding: 4,
            valign: 'middle',
            fontSize: 10,
            // halign: 'center'
            fontStyle: 'bold',
          },
          head: col,

          // body: rowData,
          styles: { fontSize: 8, font: 'Times New Roman' },
          // margin: { top: 50 },
          startY: 55,
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
              doc.text('FORM NO. 1', 150, 20, { align: 'center' });
              doc.setFontSize(9);
              doc.text('[Rule-21(4)]', 150, 30, { align: 'center' });
              doc.setFontSize(11);
              doc.text('Register of Fines Employer', 150, 38, {
                align: 'center',
              });
              doc.setFontSize(9);
              doc.text('Name of the Company: ' + this.companydata.companyName, 15, 47, {
                align: 'left',
              });
              doc.text('Address of Compnay: ' + this.companydata.companyAddress, 15, 53, {
                align: 'left',
              });

              // doc.text('Attendance Salary Report '+this.datefilter.value.YearMM, 110, 36);
            } else {
            }
          },
        });

        doc.save('Form_1' + '.pdf');
      });
  }
}
