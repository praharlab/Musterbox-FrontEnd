import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import {
  CommonFilterFields,
  CommonFilterButtonFields,
  ItemOptionsPerPageArray,
  CommonRequiredFields,
} from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-salary-register-report',
    templateUrl: './salary-register-report.component.html',
    styleUrls: ['./salary-register-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SalaryRegisterReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  resultColumns: any[];
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    page: 1,
    limit: 10,
    exportData: false,
    exportPdf: false,
    userMasterID: null,
  };
  limit = 10;

  currentPage: number;
  pdfData: string;
  permissionview: any = [];
  scrollBarHorizontal = window.innerWidth < 1201;
  hideFilters: CommonFilterFields[] = [];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];
  showRequiredFields: any = [CommonRequiredFields.Company];
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
              permissionval.formName == 'CTCReport' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.resultColumns = [];

    this.filterData['userMasterID'] = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.page = 1;
    this.filterData['yearmonth'] = val?.YearMM.replace('-', '');
    this.filterData['companyMasterID'] = val?.company;

    this.getSalaryRegisterData();
  }

  getSalaryRegisterData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETSALARYREGISTERNEW, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
            this.showButtons.push(CommonFilterButtonFields.Pdf);
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          for (var key in this.rows[0]) {
            this.resultColumns.push({
              name: key,
              prop: key,
              flexGrow: 1.2,
              minWidth: 200,
            });
          }
          this.spinner.stop();
        }
      });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getSalaryRegisterData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getSalaryRegisterData();
    } else {
      console.log('error');
    }
  }

  clear() {
    setTimeout(() => {
      this.rows = [];
      this.resultColumns = [];
      this.filterData = {
        page: 1,
        limit: 10,
        exportData: false,
        exportPdf: false,
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
    this.filterData.exportData = true;
    this.api
      .callApi(this.constant.GETSALARYREGISTERNEW, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'CTC Master Report.xlsx', 'text/xlsx');
          this.filterData.exportData = false;
          this.spinner.stop('start');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  exportPdf() {
    this.filterData.exportPdf = true;

    this.spinner.start('pdf');
    this.api
      .callApi(this.constant.GETSALARYREGISTERNEW, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          this.pdfData = 'data:application/pdf;base64,' + res.data;
          this.downloadPdf(this.pdfData, 'CTC Master Report');
          this.spinner.stop('pdf');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.start('pdf');
        },
      );
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
    this.filterData.exportPdf = false;
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
