import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-outdoor-duty-application-report',
    templateUrl: './outdoor-duty-application-report.component.html',
    styleUrls: ['./outdoor-duty-application-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OutdoorDutyApplicationReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  scrollBarHorizontal: boolean;
  apiURL = environment.apiUrl;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  permissionview: any = [];

  filterData = {
    userMasterID: null,
    startdate: '',
    enddate: '',
    page: 1,
    limit: 10,
    type: 'outdoor',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  rows: any = [];

  itemsPerPage = 10;
  currentPage: number;

  isResetForm: boolean = false;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
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
              permissionval.formName == 'OutdoorDutyApplicationReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit1(val: any) {
    this.filterData.page = 1;

    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.startdate = val.startdate;
    this.filterData.enddate = val.enddate;

    this.getLeaveReportData();
  }

  getLeaveReportData() {
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.LEAVEREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.CSV)
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('submit');
        } else {
          this.handleError(res.message);
          this.spinner.stop('submit');
        }
      }, (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('submit');
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getLeaveReportData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getLeaveReportData();
    } else {
      console.log('error');
    }
  }
  download() {

    const filterData = {
      page: '',
      limit: '',
      userMasterID: this.filterData.userMasterID,
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      type: 'outdoor',
      exportData: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.LEAVEREPORT, filterData, 'POST', false, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, `Leave Report ${this.filterData.startdate} To ${this.filterData.enddate}.xlsx`);
    this.spinner.stop('download');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  clear() {
    this.isResetForm = true;
    this.rows = [];
    this.filterData = {
      userMasterID: null,
      startdate: '',
      enddate: '',
      page: 1,
      limit: 10,
      type: 'outdoor'
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.isResetForm = false;
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
