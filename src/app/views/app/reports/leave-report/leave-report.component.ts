import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
@Component({
    selector: 'app-leave-report',
    templateUrl: './leave-report.component.html',
    styleUrls: ['./leave-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LeaveReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  scrollBarHorizontal: boolean;
  apiURL = environment.apiUrl;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  limit = 10;
  permissionview: any = [];
  alluser: any;
  selected: any[];
  allbranch: any;
  company_id: string;
  company1: any;
  filterData = {
    userMasterID: null,
    startdate: '',
    enddate: '',
    page: 1,
    limit: 10,
    type: 'leave'
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  rows: any = [];
  export: any;
  itemsPerPage = 10;
  currentPage: number;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear]
  showRequiredFields: any = [CommonRequiredFields.Company]
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
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
              permissionval.formName == 'LeaveApplicationReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  view(attachment) {
    window.open(this.apiURL + 'uploads/employee-leave-attachment/' + attachment, '_blank');
  }


  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.startdate = val?.startdate;
    this.filterData.enddate = val?.enddate;
    this.getLeaveReportData();
  }

  getLeaveReportData() {
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.LEAVEREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel)
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('submit');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('submit');
        }
      }, (err) => {
        this.commonNotificationService.handleError(err.error.message);
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
      this.limit = this.filterData.limit;
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
      exportData: true,
      type: 'leave',
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.LEAVEREPORT, filterData, 'POST', false, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, `Leave Report ${this.filterData.startdate} To ${this.filterData.enddate}.xlsx`, 'text/xlsx');
          this.spinner.stop('download');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }
  clear() {
    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        userMasterID: null,
        startdate: '',
        enddate: '',
        page: 1,
        limit: 10,
        type: 'leave'
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
      this.ngOnInit();
    }, 200);
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
