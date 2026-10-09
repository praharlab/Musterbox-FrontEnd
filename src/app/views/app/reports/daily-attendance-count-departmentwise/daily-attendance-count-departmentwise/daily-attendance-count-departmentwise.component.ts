import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-daily-attendance-count-departmentwise',
    templateUrl: './daily-attendance-count-departmentwise.component.html',
    styleUrls: ['./daily-attendance-count-departmentwise.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DailyAttendanceCountDepartmentwiseComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterform = {
    companyMasterID: [Number(localStorage.getItem('company_id'))],
    page: 1,
    limit: 10,
    searchQuery: '',
  };

  rows = [];
  rows1: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;
  columns = [];
  temp = [];
  currentPage: number;
  filterData1: any;
  ipAddress: any;
  company_id: number;
  company1: any;
  formValue: any;
  querystring: string;

  filterData = {
    page: 1,
    limit: 10,
    fromDate: '',
    toDate: '',
    companyID: '',
  };
  date12: any;
  resultColumns: any = [];
  permissionview: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }
  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
  }

  checkpermission() {
    this.spinner.start('loader');
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
              permissionval.formName == 'ShiftwiseAttendanceCountReport' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('loader');
        }
      });
  }



  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        }
      });
  }


  download() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.companyID = this.datefilter.value.company;
    this.filterData.fromDate = this.datefilter.value.startdate;
    this.filterData.toDate = this.datefilter.value.enddate;

    let queryString = `?companyMasterID=${this.datefilter.value.company}&startdate=${this.datefilter.value.startdate}&enddate=${this.datefilter.value.enddate}&exportData=true`;

    this.spinner.start('search');
    this.api
      .callApi(this.constant.SHIFTWISEATTENDANCECOUNTREPORT + queryString, {}, 'GET', true, false, true, true)
      .subscribe((res: any) => {

        var blob = new Blob([res], { type: 'text/xlsx' });
        saveAs(blob, 'Shiftwise Attendance Count Report.xlsx');
        this.spinner.stop('search');
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    if (
      new Date(this.datefilter.value.startdate) > new Date(this.datefilter.value.enddate) ||
      this.datefilter.value.startdate > this.date12 ||
      this.datefilter.value.enddate > this.date12
    ) {
      this.notifications.create(
        'Invalid Date range',
        'Please enter proper Date range',
        NotificationType.Error,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
      return;
    }
    this.filterData.companyID = this.datefilter.value.company;
    this.filterData.fromDate = this.datefilter.value.startdate;
    this.filterData.toDate = this.datefilter.value.enddate;

    let queryString = `?companyMasterID=${this.datefilter.value.company}&startdate=${this.datefilter.value.startdate}&enddate=${this.datefilter.value.enddate}&page=${this.filterData.page}&limit=${this.filterData.limit}`;

    this.spinner.start('search');
    this.api
      .callApi(this.constant.SHIFTWISEATTENDANCECOUNTREPORT + queryString, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.resultColumns = [];
          for (var key in this.rows[0]) {
            this.resultColumns.push({
              name: key,
              prop: key,
              flexGrow: 1.2,
              minWidth: 200,
            });
          }


          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('search');
      });
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.rows = []
      this.resultColumns = [];
      this.ngOnInit();
    }, 200);
  }

}