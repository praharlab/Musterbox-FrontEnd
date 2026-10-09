import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
    selector: 'app-office-expense-report',
    templateUrl: './office-expense-report.component.html',
    styleUrls: ['./office-expense-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OfficeExpenseReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  filterData = {
    companyMasterID: null,
    branchMasterID: null,
    siteID: null,
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10,
    exportData: false
  }
  body = {
    companyMasterID: null,
    branchMasterID: null,
    siteID: null,
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10,
    exportData: false
  }

  page = {
    totalCount: 0,
    offset: 0
  }

  rows: any = [];
  allBranches: any = [];
  allSites: any = [];
  currentPage: any;
  permissionview: any = [];
  allCompanies: any = []

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
    private _localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.checkpermission()
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: this._localStorageService.getLoggedInUser(),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseReport' &&
              permissionval.operationName.includes('View')
            );
          });

          if(this.permissionview?.length > 0){
            this.filterData.companyMasterID = this._localStorageService.getCompany();
            this.body.companyMasterID = this.filterData.companyMasterID;
            this.getAllCompanies();
            this.getAllOfficeExpenseData();
          }
          this.spinner.stop();
        }
      });
  }

  getAllOfficeExpenseData() {
    this.spinner.start('OFFICEEXPENSEREPORT');
    this.api.callApi(this.constant.OFFICEEXPENSEREPORT, this.body, 'POST', false, true, true, this.body.exportData).subscribe(
      (res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.downloadFileService.handleFileDownload(
            res,
            'officeExpenseReport.xlsx',
            'text/xlsx',
          );
          this.filterData.exportData = false;
          this.spinner.stop('OFFICEEXPENSEREPORT');
        } else {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
        }
        this.spinner.stop('OFFICEEXPENSEREPORT');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  onSubmit(){
    this.body = {...this.filterData};
    this.getAllOfficeExpenseData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.body.limit = ev;
    this.getAllOfficeExpenseData();
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.body.page = e.offset + 1;
      this.getAllOfficeExpenseData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!')
    }
  }

  getAllCompanies() {
    const usertype = +localStorage.getItem('usertype');
    if (usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start('company');
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allCompanies = res.data;
            setTimeout(() => {
              this.selectcompany(this.filterData.companyMasterID);
            });
            this.spinner.stop('company');
          }
        });
    } else {
      const body = {
        companyMasterID: this._localStorageService.getCompany(),
      };
      this.spinner.start('company');
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allCompanies = res.data;
            setTimeout(() => {
              this.selectcompany(this.filterData.companyMasterID);
            }, 50);
            this.spinner.stop('company');
          }
        });
    }
  }

  async selectcompany(companyMasterID: any) {
    this.filterData.branchMasterID = null;
    this.filterData.siteID = null;
    this.allBranches = [];
    this.allSites = [];
    this.filterData.companyMasterID = companyMasterID;
    this.getAllBranches();
  }

  getAllBranches() {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + this.filterData.companyMasterID, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allBranches = res;
          this.spinner.stop('branch');
          resolve();
        });
    });
  }

  selectBranch(branchMasterID: number){
    this.allSites = [];
    this.filterData.siteID = null;
    this.getAllSites(branchMasterID);
  }

  getAllSites(branchMasterID: number) {
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, { branchMasterID, companyMasterID: this.filterData.companyMasterID }, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.spinner.stop('getAllSites');
      });
  }

  clear() {
    this.allCompanies = [];
    this.allBranches = [];
    this.allSites = [];

    this.filterData = {
      companyMasterID: this._localStorageService.getCompany(),
      branchMasterID: null,
      siteID: null,
      fromDate: '',
      toDate: '',
      page: 1,
      limit: 10,
      exportData: false
    }
    this.body = {
      companyMasterID: this._localStorageService.getCompany(),
      branchMasterID: null,
      siteID: null,
      fromDate: '',
      toDate: '',
      page: 1,
      limit: 10,
      exportData: false
    }

    this.selectcompany(this.filterData.branchMasterID);
    this.getAllOfficeExpenseData();
  }

  export(){
    this.body.exportData = true;
    this.getAllOfficeExpenseData();
  }

}
