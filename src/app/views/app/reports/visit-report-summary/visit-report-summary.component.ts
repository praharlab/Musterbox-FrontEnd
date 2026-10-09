import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-visit-report-summary',
    templateUrl: './visit-report-summary.component.html',
    styleUrls: ['./visit-report-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VisitReportSummaryComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    userMasterID: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissionview: any = [];
  limit = 10;

  resultColumns: any[];
  companydata: any;

  enddate: any;

  currentPage: number;
  
  selectedUser: any[];
  isResetForm: boolean = false;
  selectedBranch: any[];



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
              permissionval.formName == 'VisitSummaryReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectfrom() {
    this.enddate = new Date().toISOString().split('T')[0];
  }

  onSubmit(val?: any) {
    this.filterData.startDate = val?.fromdate;
    this.filterData.endDate = val?.todate ? val?.todate : this.enddate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETVISITREPORTSUMMARY, this.filterData, 'POST', true, false, true)
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
            this.currentPage = this.filterData.page;
          }, 100);
          this.spinner.stop('submit');
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.onSubmit();
    } else {
      this.filterData.page = 1;
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.onSubmit();
    } else {
      this.filterData.page = 1;

    }
  }


  clear() {
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      startDate: '',
      endDate: '',
      userMasterID: null,
    };
    this.enddate = ''
    this.page = {
      totalCount: 0,
      offset: 0,
    };
  }

  download(val?: any) {
    this.spinner.start('download');
    let body1 = {
      page: '',
      limit: '',
      userMasterID: val.user ? val.user : this.filterData.userMasterID,
      startDate: val?.fromdate,
      endDate: val?.todate ? val?.todate : this.enddate,
      exportData: true,
    };
    this.api
      .callApi(this.constant.GETVISITREPORTSUMMARY, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
        },
      );
    this.spinner.stop('download');
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Visit Summary Report.xlsx');
    this.spinner.stop('start');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
