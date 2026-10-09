import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  CommonRequiredFields,
  ItemOptionsPerPageArray,
} from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-visit-report',
    templateUrl: './visit-report.component.html',
    styleUrls: ['./visit-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VisitReportComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];
  showRequiredFields: any = [CommonRequiredFields.Company];
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    startDate: '',
    endDate: '',
    userMasterID: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissionview: any = [];
  image: any;
  enddate: any;
  visitcustomizefield: any;
  visitreportcustomizefield: any;
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
              permissionval.formName == 'VisitReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectfrom() {
    const today = new Date();
    this.enddate = today.toISOString().split('T')[0];
  }

  onSubmit(val?: any) {
    this.filterData.companyMasterID = val?.company;
    this.filterData.startDate = val?.fromdate;
    this.filterData.endDate = val?.todate ? val?.todate : this.enddate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;

    this.getVisitReportData();
  }

  getVisitReportData() {
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETVISITREPORT, this.filterData, 'POST', true, false, true)
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
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('submit');
        }
      });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getVisitReportData();
    } else {
      this.filterData.page = 1;
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getVisitReportData();
    } else {
      this.filterData.page = 1;
    }
  }

  clear() {
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: '',
      startDate: '',
      endDate: '',
      userMasterID: null,
    };
    this.rows = [];
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.enddate = '';
  }

  editimage(image) {
    this.image = image;
  }

  download(val: any) {
    let body1 = {
      page: '',
      limit: '',
      companyMasterID: val?.company,
      userMasterID: val.user ? val.user : this.filterData.userMasterID,
      startDate: val?.fromdate,
      endDate: val?.todate ? val?.todate : this.enddate,
      exportData: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.GETVISITREPORT, body1, 'POST', true, false, true, true)
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
    saveAs(blob, 'Visit Report.xlsx');
    this.spinner.stop('download');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
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
