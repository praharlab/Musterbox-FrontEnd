import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import {
  expenseApprovalTypes,
  expenseTypeArrayForDropDown,
  expenseTypes,
} from 'src/app/constants/commonVariables';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { ViewExpenseCommonComponent } from '../../view-expense-common/view-expense-common.component';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-list-expense',
    templateUrl: './list-expense.component.html',
    styleUrls: ['./list-expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListExpenseComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  // @ViewChild(ViewFinanceTransCommonComponent)
  // viewFinanceTransCommonComponent: ViewFinanceTransCommonComponent;
  @ViewChild(ViewExpenseCommonComponent)
  viewExpenseCommonComponent: ViewExpenseCommonComponent;
  @ViewChild('datefilter') datefilter: NgForm;

  row: any;
  rows: any = [];
  filteredRow: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  expenseTypesObj: any = expenseTypes;

  filterData = {
    companyMasterID: localStorage.getItem('company_id'),
    page: 1,
    limit: 10,
    fromDate: '',
    toDate: null,
    expenseType: this.expenseTypesObj.ALL,
    status: '',
  };

  filterData2 = {
    page: 1,
    limit: 10,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  page2 = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  authdata: [];

  ExpenseAccepted: any;
  ExpensePending: any;
  ExpenseRejected: any;
  ExpensePaid: any;

  showAccepted: boolean = true;
  showPending: boolean = true;
  showRejected: boolean = true;
  showPaid: boolean = true;

  formValue: any;
  expenseTypeArrayForDropDownData: any = expenseTypeArrayForDropDown;
  expenseApprovalTypeData: any = expenseApprovalTypes;

  showFinanceData: boolean = false;
  showGenerateExpenseVoucherColumn: boolean = labelUtils.showGenerateExpenseVoucher;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/finances/expense',
          this.adminRoot + '/finances/expense/edit_expense',
          this.adminRoot + '/finances/reapply',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListExpenseComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListExpenseComponent')) {
      this.filterData = {
        companyMasterID: localStorage.getItem('company_id'),
        page: 1,
        limit: 10,
        fromDate: '',
        toDate: '',
        expenseType: this.expenseTypesObj.ALL,
        status: '',
      };
    } else {
      delete this.formValue.ListExpenseComponent?.body?.navigatedFrom;
      delete this.formValue.ListExpenseComponent.body.userid;
      this.filterData =
        Object.keys(this.formValue.ListExpenseComponent.body).length != 0
          ? this.formValue.ListExpenseComponent.body
          : {
              companyMasterID: localStorage.getItem('company_id'),
              page: 1,
              limit: 10,
              fromDate: '',
              toDate: null,
              expenseType: this.expenseTypesObj.ALL,
              status: '',
            };
    }

    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.checkpermission();
    this.getallexpense();
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
              permissionval.formName == 'Expense' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Expense' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Expense' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Expense' && permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  getallexpense() {
    this.spinner.start('main');
    this.filterData2.page = 1;
    this.filterData2.limit = 10;
    this.page2.totalCount = 0;
    this.page2.offset = 0;
    this.filterData.toDate == null ? (this.filterData.toDate = '') : this.filterData.toDate;

    this.api
      .callApi(this.constant.GETEXPENSEBYUSERID_V3, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.showAccepted = false;
            this.showPending = false;
            this.showRejected = false;
            this.showPaid = false;

            if (this.filterData.status) {
              if (this.filterData.status == expenseApprovalTypes.APPROVED) this.showAccepted = true;
              else if (this.filterData.status == expenseApprovalTypes.PENDING)
                this.showPending = true;
              else if (this.filterData.status == expenseApprovalTypes.REJECTED)
                this.showRejected = true;
              else if (this.filterData.status == expenseApprovalTypes.PAID) this.showPaid = true;
            } else {
              this.showAccepted = true;
              this.showPending = true;
              this.showRejected = true;
              this.showPaid = true;
            }

            this.ExpenseAccepted = res.userExpenseCalculations.Accepted
              ? res.userExpenseCalculations.Accepted
              : 0;
            this.ExpensePending = res.userExpenseCalculations.Pending
              ? res.userExpenseCalculations.Pending
              : 0;
            this.ExpenseRejected = res.userExpenseCalculations.Rejected
              ? res.userExpenseCalculations.Rejected
              : 0;
            this.ExpensePaid = res.userExpenseCalculations.Paid
              ? res.userExpenseCalculations.Paid
              : 0;
          } else {
            this.commonNotificationService.handleError(res.message);
          }
          this.spinner.stop('main');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
  }

  selectfrom(event: any) {
    if (event.target.value) this.filterData.toDate = new Date();
    else this.filterData.toDate = null;
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.page = 1;
    this.filterData2.page = 1;
    this.filterData.fromDate = this.datefilter.value.startdate;
    this.filterData.toDate = this.datefilter.value.enddate;
    this.filterData.expenseType = this.datefilter.value.expensetype
      ? this.datefilter.value.expensetype
      : this.expenseTypesObj.ALL;
    this.filterData.status = this.datefilter.value.status ? this.datefilter.value.status : '';
    if (this.filterData.fromDate > this.filterData.toDate) {
      return this.commonNotificationService.handleWarning(
        'Fromdate should be less then Or equal to todate ',
      );
    }
    this.filterData.status == '' ||
    this.filterData.status == null ||
    this.filterData.status == 'null' ||
    !this.filterData.status
      ? this.getallexpense()
      : this.getAllExpenseByStatus();
  }

  onItemsPerPageChange(itemCount): void {
    this.filterData.limit = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getallexpense();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  pageChanged(event: any): void {
    this.filterData.page = event.page;
    this.getallexpense();
  }

  pageChanged2(event: any): void {
    this.filterData2.page = event.page;
    this.getAllExpenseByStatus();
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.filterData2.limit = ev;
      this.datefilter.value.status == '' ? this.getallexpense() : this.getAllExpenseByStatus();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/expense/add_expense']);
  }

  alertConfirmation(userExpenseID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userExpenseID,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEALLEXPENSEBYEXPENSEID, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.commonNotificationService.handleSuccess(res.message);
              this.getallexpense();
              this.spinner.stop();
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }

  downloadFile() {
    let body1 = {
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
      expenseType: this.filterData.expenseType,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.EXPORTMYEXPENSE, body1, 'POST', true, false, true, true)

      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.commonNotificationService.handleWarning('No data found to export!');
            this.spinner.stop('download');
          } else {
            this.downloadFileService.handleFileDownload(res, 'MyExpense.xlsx', 'text/xlsx');
            this.spinner.stop('download');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message || 'Someting Went Wrong!');
          this.spinner.stop('download');
        },
      );
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListExpenseComponent', false);
    setTimeout(() => {
      this.ngOnInit();
      this.filterData.toDate = null;
    }, 200);
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListExpenseComponent',
      // this.filterData,
      {
        ...this.filterData,
        navigatedFrom: 'ListExpenseComponent',
      },
      '/finances/expense/edit_expense',
      rowData.userExpenseID,
    );
  }

  navigateToReapplyPage(userExpenseTransactionID: any): void {
    this.formValueStorageService.navigate(
      'ListExpenseComponent',
      this.filterData,
      '/finances/reapply',
      userExpenseTransactionID,
    );
  }

  onModalClose() {
    this.showFinanceData = false;
    this.row = null;
  }

  showExpenseData(row: any) {
    this.showFinanceData = true;
    this.row = row;
  }

  checkEdit(transaction: any[]) {
    const index = transaction?.findIndex(
      (x) => x.authorizationStatus == 0 || x.authorizationStatus == 1 || x.authorizationStatus == 2,
    );
    return index == -1 ? false : true;
  }
  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }
  generateExpenseVoucher(row: any) {
    const body = {
      userExpenseID: +row.userExpenseID,
      isPrintVoucher: true,
    };
    this.spinner.start('expenseData');
    this.api.callApi(this.constant.GETUSEREXPENSEBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          let base64String = 'data:application/pdf;base64,' + res.data;
          this.downloadPdf(base64String, `${row.userExpenseID}_Expense Voucher`);
        } else {
          this.commonNotificationService.handleError(res.message);
        }
        this.spinner.stop('expenseData');
      },
      (error: any) => {
        this.spinner.stop('expenseData');
        this.commonNotificationService.handleError(error.error.message);
      },
    );
  }

  getAllExpenseByStatus() {
    this.spinner.start('main');
    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.page.totalCount = 0;
    this.page.offset = 0;

    this.filterData.toDate == null ? '' : this.filterData.toDate;

    this.api
      .callApi(
        this.constant.GETEXPENSEBYUSERID_V2,
        {
          ...this.filterData2,
          fromDate: this.filterData.fromDate,
          toDate: this.filterData.toDate,
          status: this.filterData.status,
          expenseType: this.filterData.expenseType,
          companyMasterID: this.filterData.companyMasterID,
        },
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.filteredRow = res.data;
            this.page2.totalCount = res.totalcount;
            this.showAccepted = false;
            this.showPending = false;
            this.showRejected = false;
            this.showPaid = false;

            if (this.filterData.status) {
              if (this.filterData.status == expenseApprovalTypes.APPROVED) this.showAccepted = true;
              else if (this.filterData.status == expenseApprovalTypes.PENDING)
                this.showPending = true;
              else if (this.filterData.status == expenseApprovalTypes.REJECTED)
                this.showRejected = true;
              else if (this.filterData.status == expenseApprovalTypes.PAID) this.showPaid = true;
            } else {
              this.showAccepted = true;
              this.showPending = true;
              this.showRejected = true;
              this.showPaid = true;
            }

            this.ExpenseAccepted = res.userExpenseCalculations.Accepted
              ? res.userExpenseCalculations.Accepted
              : 0;
            this.ExpensePending = res.userExpenseCalculations.Pending
              ? res.userExpenseCalculations.Pending
              : 0;
            this.ExpenseRejected = res.userExpenseCalculations.Rejected
              ? res.userExpenseCalculations.Rejected
              : 0;
            this.ExpensePaid = res.userExpenseCalculations.Paid
              ? res.userExpenseCalculations.Paid
              : 0;

            this.spinner.stop('main');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('main');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
  }

  downloadFileByStatus() {
    let body1 = {
      companyMasterID: localStorage.getItem('company_id'),
      userMasterID: [+localStorage.getItem('id')],
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
      expenseType: this.filterData.expenseType,
      status: this.filterData.status,
      exportData: true,
      exportFileType: 'xlsx',
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.GETEXPENSEBYUSERID_V2, body1, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        this.downloadFileService.handleFileDownload(res, 'MyExpense.xlsx', 'text/xlsx');
        this.spinner.stop('download');
      });
  }

  downloadFunction() {
    this.filterData.status == '' ? this.downloadFile() : this.downloadFileByStatus();
  }
}
