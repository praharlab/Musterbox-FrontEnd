import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-nda-report',
    templateUrl: './nda-report.component.html',
    styleUrls: ['./nda-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NdaReportComponent implements OnInit {
  rows = [];
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  currentPage: number;
  permissionview: any = [];
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private downloadFileService: DownloadFileService,
    private commonNotificationService: CommonNotificationService,

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
              permissionval.formName == 'NdaReport' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.getNDAReportData();
  }

  getNDAReportData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.NDAREPORT, this.filterData, 'POST', true, false, true)
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
          }, 100);

          this.spinner.stop();
        }
      });
  }


  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getNDAReportData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getNDAReportData();
    } else {
      console.log('error');
    }
  }

  clear() {
    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        page: 1,
        limit: 10,
        userMasterID: null,
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
      this.ngOnInit();
    }, 200);
  }

  download() {
    this.spinner.start('start');
    let body1: any = {
      page: '',
      limit: '',
      userMasterID: this.filterData.userMasterID,
      exportData: true,
    };
    this.api.callApi(this.constant.NDAREPORT, body1, 'POST', true, false, true, true).subscribe(
      (res: any) => {
        this.downloadFileService.handleFileDownload(res, 'Nda Report.xlsx', 'text/xlsx');
        this.spinner.stop('start');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
