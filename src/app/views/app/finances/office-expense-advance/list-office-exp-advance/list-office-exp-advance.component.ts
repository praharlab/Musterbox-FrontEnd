import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-list-office-exp-advance',
    templateUrl: './list-office-exp-advance.component.html',
    styleUrls: ['./list-office-exp-advance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListOfficeExpAdvanceComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('listOfficeExpenseAdvance') listOfficeExpenseAdvance: NgForm;

  adminRoot = environment.adminRoot;

  filterData = {
    companyMasterID: null,
    branchMasterID: null,
    siteID: null,
    userMasterID: null,
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10,
    exportData: false
  }

  page = {
    offset: 0,
    totalCount: 0
  }

  permissioncreate: any = [];
  permissionview: any = [];

  companyData: any = [];
  branchData: any = [];
  siteData: any = [];
  userData: any = [];
  rows: any = [];
  allSites: any = [];
  itemOptionsPerPage = ItemOptionsPerPageArray;

  selectedSite: any;
  currentPage: any;
  maxDate: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
    this.maxDate = new Date().toISOString().slice(0, 10);
  }

  checkpermission() {
    this.spinner.start('GETPERMISSION');
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
              permissionval.formName == 'OfficeExpenseAdvance' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseAdvance' &&
              permissionval.operationName.includes('Create')
            );
          });

          if(this.permissionview.length > 0){
            this.getCompany();
            this.getAllOfficeExpenseAdvance();
          }
          this.spinner.stop('GETPERMISSION');
        }
      });
  }

  getAllOfficeExpenseAdvance() {
    this.spinner.start('OfficeExpenseAdvance');
    this.api.callApi(this.constant.GETALLOFFICEEXPENSEADVANCE, this.filterData, 'POST', false, true, true, this.filterData.exportData).subscribe(
      (res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.downloadFileService.handleFileDownload(
            res,
            'OfficeExpenseAdvance.xlsx',
            'text/xlsx',
          );
          this.filterData.exportData = false;
          this.spinner.stop('OfficeExpenseAdvance');
        } else {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
          this.spinner.stop('OfficeExpenseAdvance');
        }
      },
      (err) => {
        this.spinner.stop('OfficeExpenseAdvance');
        const message = err.error.size && this.filterData.exportData ? 'No Data found to export' : err.error.message
        this.commonNotificationService.handleError(message)
        this.filterData.exportData = false;
      },
    )
  }


  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/officeExpenseAdvance/add']);
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getAllOfficeExpenseAdvance();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllOfficeExpenseAdvance();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  clear() {
    this.rows = []
    this.allSites = []
    this.filterData = {
      companyMasterID: null,
      branchMasterID: null,
      siteID: null,
      userMasterID: null,
      fromDate: '',
      toDate: '',
      page: 1,
      limit: 10,
      exportData: false
    }
    const currentCompany = +localStorage.getItem('company_id');
    this.selectCompany(currentCompany);
  }

  getBranch(branchMasterID: any) {
    this.allSites = []
    this.selectedSite = null;
    this.filterData.branchMasterID = branchMasterID;
    this.getAllSites()
  }

  getAllSites() {
    const body = {
      companyMasterID: this.filterData.companyMasterID,
      branchMasterID: this.filterData.branchMasterID
    }
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.spinner.stop('getAllSites');
      });
  }

  onSubmit() {
    this.filterData.companyMasterID = this.listOfficeExpenseAdvance.value?.company;
    this.filterData.branchMasterID = this.listOfficeExpenseAdvance.value?.branch;
    this.filterData.siteID = this.listOfficeExpenseAdvance.value?.siteID;
    this.filterData.fromDate = this.listOfficeExpenseAdvance.value?.fromDate;
    this.filterData.toDate = this.listOfficeExpenseAdvance.value?.toDate;
    this.filterData.userMasterID = this.listOfficeExpenseAdvance.value?.user;

    this.getAllOfficeExpenseAdvance();
  }

  export() {
    this.filterData.exportData = true;
    this.getAllOfficeExpenseAdvance();
  }

  onFromDateChange() {
    this.filterData.toDate = new Date().toISOString().slice(0, 10);
  }

  getData(userMaster: any) {
    return {
      employeeCode: userMaster?.employeeJoiningDetails[0]?.employeeCode,
      branch: userMaster?.employeeBranches[0]?.branchMaster?.branchName,
      department: userMaster?.employeeDepartments[0]?.department?.departmentName,
      designation: userMaster?.employeeDesignations[0]?.designation?.designationName,
      division: userMaster?.employeeDivisions[0]?.division?.divisionName,
      workingArea: userMaster?.employeeWorkingAreas[0]?.workingArea?.workingAreaName
    }
  }

  getCompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          const currentCompany = +localStorage.getItem('company_id');
          this.selectCompany(currentCompany);
          this.spinner.stop('company');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  getAllBranches(id?: any) {
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.branchData = res;
        this.spinner.stop('branch');
      });
  }

  getAllUsers() {
    const body = {
      branchMasterID: this.filterData.branchMasterID,
      siteID: this.filterData.siteID
    }
    this.spinner.start('user');
    this.api.callApi(this.constant.GETASSIGNEDUSERSBYBRANCHANDSITE, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.userData = res.data;
        }
        this.spinner.stop('user');
      },
      (error) => {
        this.spinner.stop('user');
      },
    );
  }

  selectCompany(companyMasterID: any) {
    this.filterData.branchMasterID = null;
    this.filterData.siteID = null;
    this.filterData.userMasterID = null;
    this.branchData = [];
    this.siteData = [];
    this.userData = [];
    this.filterData.companyMasterID = companyMasterID;
    if (!companyMasterID) return;
    this.getAllBranches(companyMasterID);
  }

  selectBranch(branchMasterID: any) {
    this.filterData.siteID = null;
    this.filterData.branchMasterID = branchMasterID;
    this.filterData.userMasterID = null;
    this.getAllSites();
    this.getAllUsers();
  }

  selectSite(siteID: any) {
    this.filterData.userMasterID = null;
    this.filterData.siteID = siteID
    this.getAllUsers();
  }

}
