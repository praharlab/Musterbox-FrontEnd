import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-penalty-report',
    templateUrl: './penalty-report.component.html',
    styleUrls: ['./penalty-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PenaltyReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
    startdate: '',
    enddate: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  currentPage: number;

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
              permissionval.formName == 'PenaltyReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.filterData.startdate = val?.startdate.slice(0, 10);
    this.filterData.enddate = val?.enddate.slice(0, 10);
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;

    this.getPenaltyReportData();
  }

  getPenaltyReportData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.PENALTYREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
          this.spinner.stop();
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getPenaltyReportData();
    } else {
      this.filterData.page = 1;
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getPenaltyReportData();
    } else {
      this.filterData.page = 1;
    }
  }

  clear() {
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: null,
      startdate: '',
      enddate: '',
    };
    this.rows = []
  }

  download(val: any) {
    let body1 = {
      page: '',
      limit: '',
      startdate: val?.startdate.slice(0, 10),
      enddate: val?.enddate.slice(0, 10),
      companyMasterID: val?.company,
      userMasterID: val.user ? val.user : this.filterData.userMasterID,
      exportData: true,
    };

    try {
      this.spinner.start('start');
      this.api
        .callApi(this.constant.PENALTYREPORT, body1, 'POST', true, false, true, true)
        .subscribe(
          (res: any) => this.handleFileDownload(res),
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('start');
          },
        );
    } catch (err) {
      this.notifications.create('Error in Download', 'Please Try Again', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Penalty Report.xlsx');
    this.spinner.stop('start');
  }

  private handleError(message: any) {
    this.notifications.create('Error in Download', 'Please Try Again', NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
