import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-daily-hourly-report',
    templateUrl: './daily-hourly-report.component.html',
    styleUrls: ['./daily-hourly-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DailyHourlyReportComponent implements OnInit {
  math = Math;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;

  filterData = {
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    userMasterID: null,
    exportData: false,
    exportFileType: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissionview: any = [];
  enddate: Date;
  selectedValue: string;
  currentPage: number;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit() {
    this.spinner.start('loader');
    this.setVariables()
      .then(() => Promise.all([this.checkpermission()]))
      .catch(() => {
        this.handleCatchError();
      });
    this.spinner.stop('loader');
  }

  private setVariables() {
    return new Promise((resolve, reject) => {
      try {
        this.filterData = {
          page: 1,
          limit: 10,
          startDate: '',
          endDate: '',
          userMasterID: null,
          exportData: false,
          exportFileType: '',
        };

        this.page = {
          totalCount: 0,
          offset: 0,
        };

        resolve('Variables set successfully');
      } catch (error) {
        reject(error);
      }
    });
  }

  private checkpermission(): Promise<void> {
    this.spinner.start('loader');
    return new Promise<void>((resolve, reject) => {
      this.api
        .callApi(
          this.constant.GETPERMISSION,
          {
            userMasterID: localStorage.getItem('id'),
          },
          'POST',
          true,
          false,
          true,
        )
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              let permission = res.data;
              this.permissionview = permission.filter((permissionval) => {
                return (
                  permissionval.formName == 'DailyHourlyReport' &&
                  permissionval.operationName.includes('View')
                );
              });
              this.spinner.stop('loader');

              resolve();
            } else {
              this.handleCatchError();
              reject(); // Reject the Promise in case of an error
            }
          },
          (err) => {
            this.handleCatchError();
            reject(err); // Reject the Promise in case of an error
          },
        );
    });
  }

  onSubmit(val: any) {
    this.filterData.page = 1;
    this.filterData.startDate = val.fromdate;
    this.filterData.endDate = val.todate ? val.todate : this.enddate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;

    this.getReportdata();
  }

  getReportdata() {
    this.spinner.start('mainData');
    this.api
      .callApi(this.constant.GETDAILYHOURLYREPORT, this.filterData, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('mainData');
        } else {
          this.handleCatchError();
          this.spinner.stop('mainData');
        }
      }, () => {
        this.handleCatchError();
        this.spinner.stop('mainData');
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getReportdata();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getReportdata();
    } else {
      console.log('error');
    }
  }

  selectfrom() {
    this.enddate = new Date();
  }

  clear() {
    this.filterData = {
      page: 1,
      limit: 10,
      startDate: '',
      endDate: '',
      userMasterID: null,
      exportData: false,
      exportFileType: '',
    };
    this.rows = [];
    this.enddate = null;
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };
    allSelect(items);
  }

  onOptionSelectDownlad() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start('a');
    this.filterData.exportFileType = this.selectedValue;
    this.filterData.exportData = true;
    this.api
      .callApi(this.constant.GETDAILYHOURLYREPORT, this.filterData, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (this.selectedValue == 'csv') {
          var blob = new Blob([res], { type: 'text/csv' });
          saveAs(blob, 'Daily-Hourly-Report.csv');
          this.selectedValue = null;
          this.filterData.exportData = false;
          this.filterData.exportFileType = '';
          this.spinner.stop('a');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Daily-Hourly-Report.xlsx');
          this.selectedValue = null;
          this.filterData.exportData = false;
          this.filterData.exportFileType = '';
          this.spinner.stop('a');
        }
      });
  }

  handleCatchError() {
    this.spinner.stop('loader');
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
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
