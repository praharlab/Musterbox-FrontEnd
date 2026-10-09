import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {  DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
@Component({
    selector: 'app-depositreport',
    templateUrl: './depositreport.component.html',
    styleUrls: ['./depositreport.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DepositreportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  selected: any = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
    companyMasterID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  filter: any;
  excelevents: any;
  permissionview: any = [];
  limit = 10;
  currentPage: number;


  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
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
              permissionval.formName == 'DepositReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }


  getDepositData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.DEPOSITREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = res.data;
          if(this.rows.length > 0){
            this.showButtons.push(CommonFilterButtonFields.Excel)
          }else{
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.filterData.companyMasterID = val?.company;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;

    this.getDepositData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getDepositData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getDepositData();
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
        companyMasterID: '',
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
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      userMasterID: this.filterData.userMasterID,
      exportData: true,
    };

    this.spinner.start('start');
    this.api.callApi(this.constant.DEPOSITREPORT, body, 'POST', true, false, true, true).subscribe(
      (res: any) => { this.downloadFileService.handleFileDownload(res, 'Deposit Report.xlsx', 'text/xlsx'); this.spinner.stop('start'); },
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
