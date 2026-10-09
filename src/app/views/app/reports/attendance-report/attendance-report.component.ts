import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-attendance-report',
    templateUrl: './attendance-report.component.html',
    styleUrls: ['./attendance-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AttendanceReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company ]

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  currentPage: number;
  body1 = {
    page: 1,
    limit: 10,
    fromdate: '',
    todate: '',
    department: '',
    companyMasterID: '',
    userMasterID: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissionview: any = [];

  image: any;
  enddate: any;

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
    this.checkpermission();
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
              permissionval.formName == 'PunchinPunchoutReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.body1.page = 1;
    this.body1.companyMasterID = val?.company;
    this.body1.department = val?.department;
    this.body1.fromdate = val?.fromdate;
    this.body1.todate = val?.todate ? val?.todate : this.enddate;
    this.body1.userMasterID = val.user ? val.user : this.body1.userMasterID;

    this.getAttendaceReportData();
  }


  getAttendaceReportData(){
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.ATTENDANCEREPORTDATA, this.body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if(this.rows.length > 0){
            this.showButtons.push(CommonFilterButtonFields.Excel);
          }else{
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body1.page;
          }, 100);
        }
        this.spinner.stop('submit');
      });
  }

  onChange(e: any) {
    if (e) {
      this.body1.page = e.offset + 1;
      this.getAttendaceReportData();
    } else {
      this.body1.page = 1;
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body1.limit = ev;
      this.getAttendaceReportData();
    } else {
      this.body1.page = 1;
    }
  }

  editimage(image) {
    this.image = image;
  }
  selectfrom() {
    const today = new Date();
    this.enddate = today.toISOString().split('T')[0];
  }

  clear() {
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.rows = [];
    this.body1 = {
      page: 1,
      limit: 10,
      fromdate: '',
      todate: '',
      department: '',
      companyMasterID: '',
      userMasterID: null,
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.enddate = ''
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

  download(val: any) {
    this.spinner.stop('start');

    let body1 = {
      fromdate: '',
      todate: '',
      userMasterID: null,
      exportData: true,
    };

    body1.fromdate = val?.fromdate;
    body1.todate = val?.todate ? val?.todate : this.enddate;
    body1.userMasterID = val.user ? val.user : this.body1.userMasterID;

    this.api
      .callApi(this.constant.ATTENDANCEREPORTDATA, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => this.handleError(err),
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'PunchIn-Out Report.xlsx');
    this.spinner.stop('main');
  }

  private handleError(err: any) {
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
    this.spinner.stop('main');
  }

  init(users: any){
    this.body1.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.body1.userMasterID = users.map((x) => x.userMasterID);
  }
}
