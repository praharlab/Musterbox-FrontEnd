import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-tax-regime',
    templateUrl: './list-employee-tax-regime.component.html',
    styleUrls: ['./list-employee-tax-regime.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeTaxRegimeComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;
  limit = 10;
  permissionview: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissiondelete: any = [];

  filterData = {
    companyMasterID: null,
    branchMasterID: '',
    userMasterID: [],
    financialYear: '',
    regime: '',
    Export: '',
    searchQuery: '',
    page: 1,
    limit: 10,
  };

  commonFilterData: any

  page = {
    totalCount: 0,
    offset: 0,
  };

  rows: any = [];

  financialYears: any = [];

  currentPage: number;
  formValue: any;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/incometax/list_employee_tax_regime',
          this.adminRoot + '/incometax/list_employee_tax_regime/edit_employee_tax_regime',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListEmployeeTaxRegimeComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getFinancialYears();
    this.checkpermission();
  }

  getFinancialYears() {
    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.financialYears = res.data;
        }
        this.spinner.stop('financialyear');
      },
      (err) => {
        this.spinner.stop('financialyear');
      },
    );
  }

  getlistdata() {
    // let queryString = `?page=${this.filterData.page}&limit=${this.filterData.limit}`;

    // if (this.filterData.companyMasterID) {
    //   queryString += `&companyMasterID=${this.filterData.companyMasterID}`;
    // }

    // if (this.filterData.branchMasterID) {
    //   queryString += `&branchMasterID=${this.filterData.branchMasterID}`;
    // }

    // if (this.filterData.userMasterID && +this.filterData.userMasterID.length > 0) {
    //   this.filterData.userMasterID.map((e) => {
    //     queryString += `&userMasterID[]=${e}`;
    //   });
    // }

    // if (this.filterData.financialYear) {
    //   queryString += `&financialYear=${this.filterData.financialYear}`;
    // }

    // if (this.filterData.regime) {
    //   queryString += `&regime=${this.filterData.regime}`;
    // }

    // if (this.filterData.searchQuery) {
    //   queryString += `&searchQuery=${this.filterData.searchQuery}`;
    // }

    // this.query = queryString;

    this.spinner.start('start');

    this.api
      .callApi(this.constant.GETEMPLOYEETAXREGIMELIST, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            if(this.rows.length > 0){
              this.showButtons.push(CommonFilterButtonFields.Excel);
            }else{
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
          }

          this.spinner.stop('start');
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('start');
        },
      );
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
              permissionval.formName == 'EmployeeIncomeTaxRegime' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeIncomeTaxRegime' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeIncomeTaxRegime' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeIncomeTaxRegime' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  onSubmit(val: any) {
    this.commonFilterData = val;
    this.filterData.companyMasterID = val?.company;
    this.filterData.branchMasterID = val?.branch;
    this.filterData.userMasterID = val?.user;
    this.filterData.financialYear = val?.financialYear;
    this.filterData.regime = val?.regime;
    this.filterData.Export = '';

    this.getlistdata();
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getlistdata();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    this.getlistdata();
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/incometax/list_employee_tax_regime/add_employee_tax_regime']);
  }

  updateFilter(event) {
    this.filterData.searchQuery = event.target.value.toLowerCase().trim();
    this.getlistdata();
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEEMPLOYEETAXREGIME + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getlistdata();
                this.spinner.stop('delete');
              } else {
                this.notifications.create('Error', res.message, NotificationType.Error, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('delete');
              }
            },
            (err) => {
              this.notifications.create(
                '',
                err.error.message || 'Something Went Wrong',
                NotificationType.Error,
                {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                },
              );
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  clear() {
    this.formValue = this.formValueStorageService.getData();
    this.commonFilterData = null;
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.filterData = {
      companyMasterID: null,
      branchMasterID: '',
      userMasterID: [],
      financialYear: '',
      regime: '',
      Export: '',
      searchQuery: '',
      page: this.formValue.ListEmployeeTaxRegimeComponent?.body?.page ? this.formValue.ListEmployeeTaxRegimeComponent?.body?.page : 1,
      limit: this.formValue.ListEmployeeTaxRegimeComponent?.body?.limit ? this.formValue.ListEmployeeTaxRegimeComponent?.body?.limit : 10,
    };
    this.rows = [];

    this.formValueStorageService.removeData('ListEmployeeTaxRegimeComponent', false);
  }

  download() {
    this.filterData.Export = 'true';
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETEMPLOYEETAXREGIMELIST,
        this.filterData,
        'POST',
        true,
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Employee Tax Regime.xlsx`);

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListEmployeeTaxRegimeComponent',
      this.filterData,
      '/incometax/list_employee_tax_regime/edit_employee_tax_regime',
      rowData.employeeTaxRegimeID,
    );
  }

  getCompany(companyMasterID: number){
    this.filterData.companyMasterID = companyMasterID;
    this.getlistdata();
  }
}
