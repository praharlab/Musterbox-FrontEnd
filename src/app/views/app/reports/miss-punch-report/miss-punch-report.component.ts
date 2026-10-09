import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { environment } from 'src/environments/environment';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-miss-punch-report',
    templateUrl: './miss-punch-report.component.html',
    styleUrls: ['./miss-punch-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MissPunchReportComponent implements OnInit {

  apiURL = environment.apiUrl;

  filterConfig = {
    page: 1,
    limit: 10,
    fromDate: '',
    toDate: '',
    users: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  itemOptionsPerPage = ItemOptionsPerPageArray;
  permissionView: any = [];
  rows: any = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit(): void {
    this.checkPermission();
  }

  getMissPunchReportData(exportData: boolean = false) {
    this.spinner.start('submit');
    // if (!exportData) {
    //   queryString += `&page=${this.filterConfig.page}&limit=${this.filterConfig.limit}`
    // }

    const body = {
      fromDate: this.filterConfig.fromDate,
      toDate: this.filterConfig.toDate,
      exportData: exportData,
      users: this.filterConfig?.users,
      page: exportData ? '' : this.filterConfig.page,
      limit: exportData ? '' : this.filterConfig.limit
    };
    this.api
      .callApi(this.constant.DASHBOARDMISSPUNCHREPORT, body, 'POST', false, false, true, exportData)
      .subscribe(
        (res: any) => {
          if (exportData) {
            this.handleFileDownload(res);
          } else {
            this.rows = res?.data;
            if (this.rows?.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel);
            } else {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalcount;
          }
          this.spinner.stop('submit');
        },
        (err) => {
          this.handleError(err);
        });
  }

  checkPermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionView = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MissPunchReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterConfig.limit = ev;
      this.getMissPunchReportData();
    } else {
      this.filterConfig.page = 1;
    }
  }

  clear() {
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.filterConfig = {
      page: 1,
      limit: 10,
      fromDate: '',
      toDate: '',
      users: null
    };
    this.rows = [];
  }

  onSubmit(val: any) {
    this.filterConfig.page = 1;
    this.filterConfig.fromDate = val?.fromDate;
    this.filterConfig.toDate = val?.toDate;
    this.filterConfig.users = val.user ? val.user : this.filterConfig.users;

    this.getMissPunchReportData();
  }

  download() {
    this.getMissPunchReportData(true);
  }

  onPageChange(e: any) {
    if (e) {
      this.filterConfig.page = e.offset + 1;
      this.getMissPunchReportData();
    } else {
      this.filterConfig.page = 1;
    }
  }

  private handleFileDownload(res: any) {
    const blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Miss Punch Report.xlsx');
    this.spinner.stop('main');
  }

  private handleError(err: any) {
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
    this.spinner.stop('submit');
  }

  init(users: any){
    this.filterConfig.users = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterConfig.users = users.map((x) => x.userMasterID);
  }

}
