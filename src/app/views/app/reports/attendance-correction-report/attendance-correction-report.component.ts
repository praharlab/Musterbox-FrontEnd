import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-attendance-correction-report',
    templateUrl: './attendance-correction-report.component.html',
    styleUrls: ['./attendance-correction-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AttendanceCorrectionReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear]
  showRequiredFields: any = [CommonRequiredFields.Company]

  filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
    fromDate: '',
    toDate: '',
    exportData: false
  }

  page = {
    totalCount: 0,
    offset: 0,
  };
  currentPage: number

  rows: any = [];

  permissionview: any = [];


  limit: number = 10;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
    this.checkpermission()
  }

  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.filterData.userMasterID = val?.user ? val.user : this.filterData.userMasterID;
    this.filterData.fromDate = val?.startdate;
    this.filterData.toDate = val?.enddate;
    this.getAllData();
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllData();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: null,
      fromDate: '',
      toDate: '',
      exportData: false
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  }

  getAllData() {
    this.spinner.start('attendanceCorrectionData');
    this.api
      .callApi(this.constant.ATTENDANCECORRECTIONREPORT, this.filterData, 'POST', true, true, true, this.filterData.exportData)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.downloadFileService.handleFileDownload(res, 'AttendanceCorrectionRequestReport.xlsx', 'text/xlsx')
          this.filterData.exportData = false;
          this.spinner.stop('attendanceCorrectionData');
        } else {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            if (this.rows.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel)
            }
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            });
            this.spinner.stop('attendanceCorrectionData');
          }
        }
      }, (error) => {
        this.commonNotificationService.handleError(error.error.message);
        this.spinner.stop('attendanceCorrectionData');
      })
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllData();
    } else {
      console.log('error');
    }
  }

  download() {
    this.filterData.exportData = true;
    this.getAllData()
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
              permissionval.formName == 'AttendanceCorrectionRequestReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

}
