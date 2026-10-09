import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  CommonRequiredFields,
  ItemOptionsPerPageArray,
} from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-expense-payment',
    templateUrl: './expense-payment.component.html',
    styleUrls: ['./expense-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExpensePaymentComponent implements OnInit {
  @ViewChild('payment') payment: NgForm;
  @ViewChild('addPayment') addPayment: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;
  childcompany: string;
  usertype: string;
  company_id: string;
  cid: string;
  company1: any;
  permissionedit: any;
  permissionview: any = [];
  permissiondelete: any;
  employee: any;
  allbranch: any;
  employeedata: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  branchfilter: boolean = false;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: '',
    expensefilter: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows = [];
  expensefiltervalue: any;
  expense_data: any;
  datefilter = '';
  PaymentMode = '';
  refNo = '';
  refDate = '';
  buttonDisabled = false;
  expensefiltervalueAfterSubmit: any;
  alluser: any;
  alldepartment: any[];
  allDivision: any[];
  alldesignation: any[];
  allWorkingArea: any[];
  selectedBranch: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
  };
  expensefilterValue: string = '';
  userName: any;
  userNumber: any;
  rowgetdata: any;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
    CommonFilterButtonFields.Import,
  ];
  showRequiredFields: any = [CommonRequiredFields.Company];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');

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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpensePayment' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpensePayment' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpensePayment' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  onChangeRadioButton(event) {
    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.rows.splice(0);
  }

  onSubmit(val?: any) {
    this.filterData.userMasterID = val?.user ? val?.user : this.filterData.userMasterID;
    this.filterData.expensefilter = val?.expensefilter;
    this.getExpensePaymentData();
  }
  getExpensePaymentData() {
    this.spinner.start('submit');

    this.api
      .callApi(this.constant.EXPENSEPAYMENTLIST, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          this.buttonDisabled = true;
          this.expensefiltervalueAfterSubmit = this.filterData.expensefilter;
        }
        this.spinner.stop('submit');
      });
  }
  expensedata(row) {
    this.expense_data = row;
    this.userName = this.expense_data['userMaster.displayName'];
    this.userNumber = this.expense_data['userMaster.userNumber'];
  }

  closemodalonclick() {
    this.datefilter = null;
    (this.PaymentMode = null), (this.refNo = null), (this.refDate = null);
  }

  AddPayment() {
    if (!this.addPayment.valid) {
      return;
    }

    this.datefilter = this.addPayment.value.paymentDate;
    this.PaymentMode = this.addPayment.value.paymentmode;
    this.refNo = this.addPayment.value.referenceNO || null;
    this.refDate = this.addPayment.value.referenceDate || null;

    const body = {
      userMasterID: this.expense_data.userMasterID,
      amount: this.expense_data.expenseAmount,
      userExpenseTransactionID: this.expense_data.userExpenseTransactionID,
      paymentDate: this.datefilter,
      paymentmode: this.PaymentMode,
      referenceNO: this.refNo,
      referenceDate: this.refDate,
      createBy: localStorage.getItem('id'),
      expensefilter: this.expensefiltervalueAfterSubmit,
    };

    this.spinner.start('AddPayment');
    this.api
      .callApi(this.constant.EXPENSEPAYMENTADD, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
        } else {
          this.notifications.create('Error', 'Error', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        }
        this.closeModal.nativeElement.click();
        this.addPayment.resetForm();
        this.getExpensePaymentData();
        this.spinner.stop('AddPayment');
      });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getExpensePaymentData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.filterData.limit = this.filterData.limit;
    this.getExpensePaymentData();
  }

  clear() {
    this.rows = [];
  }

  getUsers() {
    this.users_Body.branchMasterID =
      this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0
        ? this.users_Body.branchMasterID
        : null;
    this.users_Body.departmentID =
      this.users_Body.departmentID && this.users_Body.departmentID.length > 0
        ? this.users_Body.departmentID
        : null;
    this.users_Body.designationID =
      this.users_Body.designationID && this.users_Body.designationID.length > 0
        ? this.users_Body.designationID
        : null;
    this.users_Body.divisionId =
      this.users_Body.divisionId && this.users_Body.divisionId.length > 0
        ? this.users_Body.divisionId
        : null;
    this.users_Body.workingAreaId =
      this.users_Body.workingAreaId && this.users_Body.workingAreaId.length > 0
        ? this.users_Body.workingAreaId
        : null;

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
        }
        this.spinner.stop('users');
      });
  }

  syncErpPay(row) {
    this.rowgetdata = row;

    const body = {
      userMasterID: this.rowgetdata.userMasterID,
      userExpenseTransactionID: this.rowgetdata.userExpenseTransactionID,
      expensefilter: this.expensefiltervalue,
    };

    this.spinner.start('data');
    this.api.callApi(this.constant.SYNCERPPAYMENT, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.rows = [...this.rows];
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.getExpensePaymentData();
          setTimeout(() => {
            this.spinner.stop('data');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('data');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('data');
      },
    );
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  importExcel() {
    this.router.navigate([this.adminRoot + '/finances/expense_payment/import_expense_payment']);
  }
}
