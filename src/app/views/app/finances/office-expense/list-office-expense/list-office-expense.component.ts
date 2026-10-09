import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import { ViewOfficeExpenseCommonComponent } from '../../view-office-expense-common/view-office-expense-common.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-list-office-expense',
    templateUrl: './list-office-expense.component.html',
    styleUrls: ['./list-office-expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListOfficeExpenseComponent implements OnInit {

  @ViewChild(ViewOfficeExpenseCommonComponent) viewOfficeExpenseCommonComponent: ViewOfficeExpenseCommonComponent;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    branchMasterID: null,
    exportData: false,
    siteID: null
  }
  showOfficeExpenseData: boolean = false;
  row: any
  commonFilterData: any
  initData: boolean = true

  adminRoot = environment.adminRoot;
  itemOptionsPerPage = ItemOptionsPerPageArray
  permissioncreate: any = []
  permissionview: any = []
  permissionedit: any = []
  permissiondelete: any = []

  allSites: any = []
  rows: any = []
  officeExpenseCalculations: any
  page = {
    totalCount: 0,
    offset: 0
  }
  currentPage: any
  selectedSite: any

  showPaid: boolean = true;
  showRejected: boolean = true;
  showPending: boolean = true;
  showAccepted: boolean = true;
  formValue: any

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.EmployementType,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.User,
    CommonFilterFields.WorkingArea
  ];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/finances/officeExpense',
          this.adminRoot + '/finances/officeExpense/edit',
          this.adminRoot + '/finances/officeExpense/reapply',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('commonFilterData', true);
          formValueStorageService.removeData('ListOfficeExpenseComponent', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.checkpermission()
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpense' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpense' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpense' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpense' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getAllOfficeExpense();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  getAllOfficeExpense() {
    const body: any = {
      companyMasterID: this.filterData.companyMasterID,
      page: this.filterData.page,
      limit: this.filterData.limit,
    }

    if(this.filterData.siteID != '' && this.filterData.siteID && this.filterData.siteID != null){
      body.siteID = this.filterData.siteID
    }else{
      body.branchMasterID = this.filterData.branchMasterID
    }

    this.spinner.start('GETALLOFFICEEXPENSE');
    this.api
      .callApi(this.constant.GETALLOFFICEEXPENSE, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.initData = false;
            this.officeExpenseCalculations = res.officeExpenseCalculations;
            if (this.rows.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel);
            } else {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page
            });
            this.spinner.stop('GETALLOFFICEEXPENSE');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('GETALLOFFICEEXPENSE');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('GETALLOFFICEEXPENSE');
        },
      );
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/officeExpense/add']);
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    if(this.initData)
    this.getAllOfficeExpense();
  }

  onSubmit(val: any){
    this.filterData.companyMasterID = val?.company;
    if(val?.siteID != ''){
      this.filterData.siteID = val?.siteID;
    }else{
      this.filterData.branchMasterID = val?.branch;
    }

    this.getAllOfficeExpense()
  }

  onModalClose() {
    this.showOfficeExpenseData = false;
    this.row = null;
  }

  showExpenseData(row: any) {
    this.showOfficeExpenseData = true;
    this.row = row;
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListOfficeExpenseComponent',
      {
        ...this.filterData,
        navigatedFrom: 'ListOfficeExpenseComponent'
      },
      '/finances/officeExpense/edit',
      rowData.officeExpenseID,
    );
  }

  alertConfirmation(officeExpenseID: any) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover!',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinner.start('active');
          this.api.callApi(this.constant.DELETEOFFICEEXPENSEBYID + officeExpenseID, {}, 'DELETE', true, true, true).subscribe(
            (res: any) => {
              this.commonNotificationService.handleSuccess(res.message)
              this.getAllOfficeExpense();
              this.spinner.stop('active');
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
        }
      });
    }


  export() {
    this.spinner.start('EXPORTOFFICEEXPENSE');
    this.api
      .callApi(this.constant.EXPORTOFFICEEXPENSE, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.downloadFileService.handleFileDownload(res, 'OfficeExpense.xlsx', 'text/xlsx');
            this.spinner.stop('EXPORTOFFICEEXPENSE');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('EXPORTOFFICEEXPENSE');
        },
      );
  }
  
  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllOfficeExpense();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  clear() {
    this.initData = true;
    this.formValue = this.formValueStorageService.getData();
    this.rows = []
    this.allSites = []
    this.commonFilterData = null;
    this.filterData = {
      page: this.formValue.ListOfficeExpenseComponent?.body?.page ? this.formValue.ListOfficeExpenseComponent?.body?.page : 1,
      limit: this.formValue.ListOfficeExpenseComponent?.body?.limit ? this.formValue.ListOfficeExpenseComponent?.body?.limit : 10,
      companyMasterID: localStorage.getItem('company_id'),
      branchMasterID: null,
      exportData: false,
      siteID: null
    };
    this.formValueStorageService.removeData('ListOfficeExpenseComponent', true);
  }

  getBranch(branchMasterID: any){
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
}
