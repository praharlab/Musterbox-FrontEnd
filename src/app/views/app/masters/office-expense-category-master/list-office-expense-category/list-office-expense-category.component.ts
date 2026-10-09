import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
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
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-list-office-expense-category',
    templateUrl: './list-office-expense-category.component.html',
    styleUrls: ['./list-office-expense-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListOfficeExpenseCategoryComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  currentPage: number;

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Branch,
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
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
  commonFilterData: any

  permissionview: any = []
  permissionedit: any = []
  permissiondelete: any = []
  permissioncreate: any = []

  itemOptionsPerPage = ItemOptionsPerPageArray;

  page = {
    totalCount: 0,
    offset: 0,
  };

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    exportData: false
  };

  rows: any = []

  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
    private downloadFileService: DownloadFileService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/officeExpenseCategory',
          this.adminRoot + '/masters/officeExpenseCategory/edit',
          this.adminRoot + '/masters/officeExpenseCategory/import',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListOfficeExpenseCategoryComponent', true);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListOfficeExpenseCategoryComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: null,
        exportData: false
      };
    } else {
      this.filterData = this.formValue.ListOfficeExpenseCategoryComponent?.body;
    }
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseCategory' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseCategory' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseCategory' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseCategory' &&
              permissionval.operationName.includes('Delete')
            );
          });

          if (this.permissionview.length > 0)
            this.spinner.stop();
        }
      });
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getAllData();
  }

  getAllData() {
    this.spinner.start('OfficeExpenseCategories');
    this.api.callApi(this.constant.GETALLOFFICEEXPENSECATEGORY, this.filterData, 'POST', false, true, true, this.filterData.exportData).subscribe(
      (res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.downloadFileService.handleFileDownload(
            res,
            'OfficeExpenseCategory.xlsx',
            'text/xlsx',
          );
          this.filterData.exportData = false;
          this.spinner.stop('OfficeExpenseCategories');
        } else {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel)
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
        }
        this.spinner.stop('OfficeExpenseCategories');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    this.getAllData();
  }


  onSubmit(val: any) {
    this.filterData.companyMasterID = val.company;
    this.getAllData();
  }

  clear() {
    this.commonFilterData = null
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: null,
      exportData: false
    };
    if (!this.formValueStorageService.isEmptyObject('ListOfficeExpenseCategoryComponent')) {
      this.filterData.page = this.formValue?.ListOfficeExpenseCategoryComponent?.body?.page;
      this.filterData.limit = this.formValue?.ListOfficeExpenseCategoryComponent?.body?.limit;
    }
    this.currentPage = this.filterData.page;
    this.formValueStorageService.removeData('ListOfficeExpenseCategoryComponent', true);
  }

  navigateToAddPage() {
    this.router.navigate(['/app/masters/officeExpenseCategory/add'])
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListOfficeExpenseCategoryComponent',
      {
        officeExpenseCategoryID: rowData.officeExpenseCategoryID,
        page: this.filterData.page,
        limit: this.filterData.limit
      },
      '/masters/officeExpenseCategory/edit',
      rowData.officeExpenseCategoryID,
    );
  }

  alertConfirmation(officeExpenseCategoryID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEOFFICEEXPENSECATEGORY + officeExpenseCategoryID, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message);
                this.getAllData();
                this.spinner.stop('confirm');
              } else {
                this.commonNotificationService.handleWarning(res.message)
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message)
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!')
    }
  }

  export() {
    this.filterData.exportData = true;
    this.getAllData()
  }

  navigateToImport() {
    this.router.navigate(['/app/masters/officeExpenseCategory/import'])
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Office expense category will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          officeExpenseCategoryID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.UPDATEOFFICEEXPENCECATEGORYSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message);
                this.getAllData();
                this.spinner.stop('deactive');
              } else {
                this.commonNotificationService.handleWarning(res.message)
                this.spinner.stop('deactive');
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message)
              this.spinner.stop('deactive');
            },
          );
      }
    });
  }

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Office expense category will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          officeExpenseCategoryID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.UPDATEOFFICEEXPENCECATEGORYSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.commonNotificationService.handleSuccess(res.message);
              this.getAllData();
              this.spinner.stop('active');
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message)
              this.spinner.stop('active');
            },
          );
      }
    });
  }

}
