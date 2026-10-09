import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { saveAs } from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-short-leave-app-report',
    templateUrl: './short-leave-app-report.component.html',
    styleUrls: ['./short-leave-app-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShortLeaveAppReportComponent implements OnInit {
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  filterData = {
    userMasterID: null,
    startdate: '',
    enddate: '',
    page: 1,
    limit: 10,
    type: 'leave'
  };

  itemOptionsPerPage = ItemOptionsPerPageArray;
  rows: any = [];
  page = {
    totalCount: 0,
    offset: 0,
  };
  currentPage: number;

  permissionview: any = [];
  scrollBarHorizontal: boolean;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.checkpermission();
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getShortLeaveReportData();
    } else {
    }
  }

  getShortLeaveReportData() {
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETSHORTLEAVEAPPLICATIONREPORT, this.filterData, 'POST', true, false, true)
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  download() {

    const filterData = {
      page: '',
      limit: '',
      userMasterID: this.filterData.userMasterID,
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      exportData: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.GETSHORTLEAVEAPPLICATIONREPORT, filterData, 'POST', false, false, true, true)
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

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getShortLeaveReportData()
    } else {
    }
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
              permissionval.formName == 'ShortLeaveApplicationReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit1(val: any) {

    this.filterData.page = 1;
    this.filterData.userMasterID = val?.user ? val.user : this.filterData.userMasterID;
    this.filterData.startdate = val.startdate;
    this.filterData.enddate = val.enddate;
    this.getShortLeaveReportData();
  }

  onPageChange(val: any) {
    this.filterData.page = val.page;
    this.getShortLeaveReportData();
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  clear() {
    this.filterData = {
      userMasterID: null,
      startdate: '',
      enddate: '',
      page: 1,
      limit: 10,
      type: 'leave'
    };
  }

}