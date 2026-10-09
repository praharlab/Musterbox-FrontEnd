import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-increment-report',
    templateUrl: './increment-report.component.html',
    styleUrls: ['./increment-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class IncrementReportComponent implements OnInit {
  @ViewChild('TABLE', { static: true }) TABLE: ElementRef;
  scrollBarHorizontal: boolean;
  itemsPerPage = 10;
  filterData = {
    userMasterID: null,
    companyMasterID: null,
    branchMasterID: '',
    page: 1,
    limit: 10,
    exportData: false
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  itemOptionsPerPage = ItemOptionsPerPageArray;
  incrementdata: any = []

  permissionview: any = [];
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private downloadFileService: DownloadFileService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
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
              permissionval.formName == 'IncrementReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.filterData.branchMasterID = val?.branch;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.companyMasterID = val?.company;
    this.filterData.page = 1;
    this.filterData.exportData = false
    this.getIncrementReport(this.filterData)
  }

  getIncrementReport(data) {
    this.spinner.start();
    this.api
      .callApi(this.constant.INCREMENTREPORT, data, 'POST', true, false, true, data.exportData)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.downloadFileService.handleFileDownload(res, 'Increment Report.xlsx', 'text/xlsx')
        } else {
          if (res.status == 200) {
            this.incrementdata = res.data;
            if (this.incrementdata.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel)
            } else {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalcount;
            this.spinner.stop();
          }
        }
        this.spinner.stop();

      });
  }

  download() {
    const filterData = {
      userMasterID: this.filterData.userMasterID,
      companyMasterID: this.filterData.companyMasterID,
      branchMasterID: this.filterData.branchMasterID,
      page: '',
      limit: '',
      exportData: true
    };
    this.getIncrementReport(filterData)
  }

  onChange(event: any) {
    this.filterData.page = event.page;
    this.getIncrementReport(this.filterData);

  }


  clear() {
    this.incrementdata = [];
    this.filterData = { userMasterID: null, companyMasterID: '', branchMasterID: '', page: 1, limit: 10, exportData: false };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.ngOnInit();
  }


  onLimitChange(ev: any) {
    if (this.incrementdata.length == 0) return;
    if (ev) {
      this.filterData.limit = ev;
      this.getIncrementReport(this.filterData);
    } else {
      console.log('error');
    }
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
