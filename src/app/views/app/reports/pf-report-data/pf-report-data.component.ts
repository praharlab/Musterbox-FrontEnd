import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-pf-report-data',
    templateUrl: './pf-report-data.component.html',
    styleUrls: ['./pf-report-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PFReportDataComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  designation1 = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  currentPage: number;
  bodyData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branchMasterID: '',
    YYYYMM: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;

  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  resultColumns: any = [];
  usertype: any;
  company_id: any;
  alldepartment: any;
  company1: any;
  employee: any;
  image: any;
  enddate: Date;
  export: any;
  allbranch: any = [];
  alluser: any;
  overTimeData: any;
  visible: boolean = false;
  MonthName: string;
  companydata: any;
  ecrdata: any;
  pfReportData: string;
  selectedBranch: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,

  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
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
              permissionval.formName == 'PFReport' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    } else {
      this.MonthName = '';

      const date = new Date();
      date.setMonth(Number(this.datefilter.value.yearmonth.slice(5, 7)) - 1);

      this.MonthName =
        date.toLocaleString('en-US', {
          month: 'short',
        }) +
        ' ' +
        this.datefilter.value.yearmonth.slice(0, 4);

      // if (this.datefilter.value.user != undefined) {
      //   if (this.datefilter.value.user.length == 0) {
      //     for (var i = 0; i < this.alluser.length; i++) {
      //       this.datefilter.value.user.push(this.alluser[i].userMasterID);
      //     }
      //   }
      // }

      this.bodyData.companyMasterID = this.datefilter.value.company;
      this.bodyData.branchMasterID = this.datefilter.value.branch;
      this.bodyData.YYYYMM = this.datefilter.value.yearmonth.replace('-', '');
      this.api
        .callApi(this.constant.PfReport, this.bodyData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.filter = 'filter';
            this.rows = res.data;
            this.visible = true;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.bodyData.page;
              this.itemsPerPage = this.bodyData.limit;
            }, 100);
            this.spinner.stop();
          }
        });
    }
  }

  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.visible = false;
      this.rows = [];
      this.bodyData = {
        page: 1,
        limit: 10,
        companyMasterID: '',
        branchMasterID: '',
        YYYYMM: '',
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'filter') {
      this.bodyData.page = e.offset + 1;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'filter') {
      this.bodyData.limit = ev;
      this.limit = this.bodyData.limit;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }
  selectcompany(id) {
    // let companyId = id;
    this.allbranch = [];
    if (id) {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        });
    }
    // this.getBranch(companyId)
    // this.getUser(companyId)
  }


  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date) {
    return (
      [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  download() {
    // let data = [];

    const body1 = {
      companyMasterID: this.bodyData.companyMasterID,
      branchMasterID: this.bodyData.branchMasterID,
      YYYYMM: this.bodyData.YYYYMM,
      exportData: true,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.PfReport, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }


  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'PF-Report.xlsx');
    this.spinner.stop('start');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  emptyData() {
    this.rows = [];
    this.visible = false;
    this.filter = '';
  }

  exportPdf() {
    const body1 = {
      companyMasterID: this.bodyData.companyMasterID,
      branchMasterID: this.bodyData.branchMasterID,
      YYYYMM: this.bodyData.YYYYMM,
      exportPdfReport: true,
    };


    this.spinner.start();
    this.api
      .callApi(this.constant.PfReport, body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.pfReportData = 'data:application/pdf;base64,' + res.data;
        this.onClickDownloadPdf();
      });
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}${this.datefilter.value.yearmonth}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.pfReportData;
    this.downloadPdf(base64String, 'PF-REPORT-');
  }

  downloadECR() {
    const body = {
      companyMasterID: this.bodyData.companyMasterID,
      branchMasterID: this.bodyData.branchMasterID,
      YYYYMM: this.bodyData.YYYYMM,
    };

    this.spinner.start('ecr');

    this.api
      .callApi(this.constant.PfReport, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ecrdata = res.data;

          let data = [];

          for (let i = 0; i < this.ecrdata.length; i++) {
            const data1 = {
              ['UAN']: this.ecrdata[i].uanNumber,
              ['MEMBER NAME']: this.ecrdata[i].memberName,
              ['GROSSWAGES']: this.ecrdata[i].grosswages,
              ['EPF WAGES']: this.ecrdata[i].EPFWAGES,
              ['EPS WAGES']: this.ecrdata[i].EPSWAGES,
              ['EDLI WAGES']: this.ecrdata[i].EDLIWAGES,
              ['EPF CONTRI REMITTED']: this.ecrdata[i].EPFcontriRemitted,
              ['EPS CONTRI REMITTED']: this.ecrdata[i].EPScontriRemitted,
              ['EPF EPS DIFF REMITTED']: this.ecrdata[i].EPFEPSDIFF,
              ['NCP DAYS']: this.ecrdata[i].NCPDAYS,
              ['REFUND OF ADVANCES']: this.ecrdata[i].refundofadvance,
            };
            data.push(data1);
          }

          this.spinner.stop('ecr');
          const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
          const header = Object.keys(data[0]);

          let csv = data.map((row) =>
            header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join('#~#'),
          );

          let csvArray = csv.join('\r\n').replace(/"/g, '');

          let blob = new Blob([csvArray], { type: 'text/csv' });
          saveAs(blob, 'PF-ECR.txt');
        }
      });
  }
}
