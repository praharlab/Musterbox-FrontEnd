import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as xlsx from 'xlsx';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-reportee-wise-shift-roster',
    templateUrl: './reportee-wise-shift-roster.component.html',
    styleUrls: ['./reportee-wise-shift-roster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReporteeWiseShiftRosterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('tableForm') tableForm: NgForm;
  scrollBarHorizontal = window.innerWidth < 1201;
  permissioncreate: any = [];
  permissionview: any = [];

  company_id: any;
  company1: any;

  rows = [];

  allbranch: any;
  alldepartment: any;
  alldesignation: any;
  alluser: any;
  allDivision: any;
  allWorkingArea: any;
  allshift: any;
  selectedUser: any = [];

  filterData = {
    // page: 1,
    // limit: 10,
    userMasterID: [],
    companyMasterID: localStorage.getItem('company_id'),
    fromDate: '',
    toDate: '',
    exportData: false
  };
  isResetForm: boolean = false;
  values: any = [];

  dateRange: any = []
  rosterUserIDs: any = []
  filteredUsers: any = []
  adminRoot = environment.adminRoot;
  currentDate: string;
  currentUser: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.immediateReportToData()
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
              permissionval.formName == 'ReporteeWiseShiftRoster' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ReporteeWiseShiftRoster' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  private handleSuccess(message: any) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  selectUser() {
    this.rows = []
    this.dateRange = [];
    this.filteredUsers = [];
    this.filterData.userMasterID = this.datefilter.value.user;
  }

  selectFromDate() {
    this.rows = []
    this.dateRange = [];
    this.filteredUsers = [];
    this.filterData.fromDate = this.datefilter.value.fromDate;
    this.filterData.toDate = '';
  }

  selectTodate() {
    this.rows = []
    this.dateRange = [];
    this.filteredUsers = [];
    this.filterData.toDate = this.datefilter.value.toDate;
  }

  immediateReportToData() {
    let id = localStorage.getItem('id');
    let queryString = `?userMasterID=${id}&date=${this.currentDate}`;

    this.spinner.start('report');
    this.api.callApi(this.constant.REPORTSTOIMMEDIATECHILD + queryString, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.alluser = res.data.child;
          this.currentUser = res.data.currentUser;

          this.alluser = this.alluser.filter((e) => {
            return e.userMasterID != id;
          });

          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((el) => {
            el.name = el.employee.displayName;
          });
          let data1 = [];
          this.alluser.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.spinner.stop('report');
        } else {
          this.handleError(res.message);
          this.spinner.stop('report');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('report');
      },
    );

  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  clear() {
    this.isResetForm = true;
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        userMasterID: [],
        companyMasterID: localStorage.getItem('company_id'),
        fromDate: '',
        toDate: '',
        exportData: false

      };
      this.selectedUser = [];
      this.company_id = +localStorage.getItem('company_id');
      this.dateRange = [];
      this.rows = []

      this.ngOnInit();
    }, 200);

    this.isResetForm = false;
  }

  onSubmit() {
    this.rows = [];
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.userMasterID = this.datefilter.value.user && this.datefilter.value.user.length > 0 ? this.datefilter.value.user : this.alluser.map((e) => e.userMasterID)
    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.ADDSHIFTROSTER, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data
            this.allshift = res.allshift;
            this.dateRange = res.datesArray
            this.rosterUserIDs = res.rosterUserIDs
            this.handleSuccess(res.message);
            this.spinner.stopLoader('master3');

          } else {
            this.handleError(res.message);
            this.spinner.stopLoader('master3');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master3');
        },
      );
  }

  saveData() {
    this.spinner.start('saveData');
    const body = {
      updateRosterData: this.rows,
      rosterUserIDs: this.rosterUserIDs,
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
    };
    this.api
      .callApi(this.constant.UPDATESHIFTROSTER, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            setTimeout(() => {
              this.rows = [];
              this.filterData = {
                userMasterID: [],
                companyMasterID: localStorage.getItem('company_id'),
                fromDate: '',
                toDate: '',
                exportData: false
              };
              this.selectedUser = [];
              this.company_id = +localStorage.getItem('company_id');
              this.dateRange = [];
              this.rows = []
              this.ngOnInit();
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }

  download() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = localStorage.getItem('company_id')
    this.filterData.userMasterID = this.datefilter.value.user && this.datefilter.value.user.length > 0 ? this.datefilter.value.user : this.alluser.map((e) => e.userMasterID)
    this.filterData.exportData = true
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETALLSHIFTROSTER, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
    this.filterData.exportData = false
  }
  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Shift Roster.xlsx');
    this.spinner.stop('start');
  }
  importExcel() {
    this.router.navigate([this.adminRoot + '/attendances/reporteeWiseShiftRoster/import_reporteeWiseShiftRoster']);
  }
}
