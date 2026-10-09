import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ExpenseAcceptRejectModalComponent } from '../../../finance-common/expense-accept-reject-modal/expense-accept-reject-modal.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-exp-req-table',
    templateUrl: './exp-req-table.component.html',
    styleUrls: ['./exp-req-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExpReqTableComponent implements OnInit {
  @Input('expenseType') expenseType: any;
  @Input('fromdate') fromdate: any;
  @Input('todate') todate: any;
  @Input('userMasterID') userMasterID: any;
  @Input('permissiondelete') permissiondelete: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild(ExpenseAcceptRejectModalComponent)
  expenseAcceptRejectModalComponent: ExpenseAcceptRejectModalComponent;
  @Output() getNewArray = new EventEmitter<any>();
  @Output() getTracking = new EventEmitter<any>();
  @Output() getAuthorizer = new EventEmitter<any>();

  @ViewChild('acceptModal') acceptModal: ModalDirective;
  @ViewChild('rejectModal') rejectModal: ModalDirective;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('reject') reject: NgForm;

  showFinanceData: boolean = false;
  row: any;
  newArray: any = [];
  newArray2: any;

  filterData = {
    page: 1,
    limit: 20,
    authorizerUserMasterID: +localStorage.getItem('id'),
    userid: [],
    fromdate: '',
    todate: '',
    expenseType: '',
  };
  userdata: any = [];
  mainexpensename: any;
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows: any = [];
  mainproduct: any;
  product: any;
  remarks: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private modalService: ModalService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    // this.modalService.userRequestRefresh$.subscribe(() => {
    //   this.filter();
    // });
  }

  getauthrequestdata() {
    this.newArray = [];
    this.filterData.fromdate = this.fromdate;
    this.filterData.todate = this.todate;
    this.filterData.expenseType = this.expenseType;
    this.filterData.userid = this.userMasterID;
    this.spinner.start('auth');
    this.api
      .callApi(
        this.constant.EXPENSEAUTH_DETAILS + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.userdata = res.data;
          this.mainexpensename = [];
          for (let i = 0; i < this.userdata.length; i++) {
            this.userdata[i].fullname =
              this.userdata[i].userName +
              ' ( ' +
              this.userdata[i].Number +
              ' - ' +
              this.userdata[i].companyMaster.companyName +
              ' )';
            this.mainexpensename.push(this.userdata[i].userMasterID);
          }

          this.spinner.stop('auth');

          if (this.mainexpensename.length == 0)
            this.mainexpensename = [+localStorage.getItem('id')];

          this.getAuthorizer.emit(this.mainexpensename);

          this.spinner.start('child');
          this.api
            .callApi(
              this.constant.GETALLPRODUCTBYPARENTCHILD + localStorage.getItem('company_id'),
              {},
              'GET',
              true,
              false,
              true,
            )
            .subscribe(
              (res: any) => {
                if (res.status == 200) {
                  this.product = res.data;

                  this.mainproduct = [];
                  for (let i = 0; i < this.product.length; i++) {
                    this.product[i].productdetails =
                      this.product[i].productName +
                      ' ( ' +
                      this.product[i].companyMaster.companyName +
                      ' )';
                    this.mainproduct.push(this.product[i].productID);
                  }
                  this.spinner.stop('child');
                } else {
                  this.commonNotificationService.handleError(res.message);
                  this.spinner.stop('child');
                }

                this.spinner.start('load');
                this.filterData.userid = this.mainexpensename.map((d) => +d);
                this.api
                  .callApi(
                    this.constant.GETEXPENSEAUTHBYUSEREXPENSETRANS,
                    this.filterData,
                    'POST',
                    true,
                    false,
                    true,
                  )
                  .subscribe(
                    (res: any) => {
                      if (res.status == 200) {
                        this.rows = res.data;
                        for (let i = 0; i < this.rows.length; i++) {
                          this.rows[i].checkbox = false;
                        }
                        this.page.totalCount = res.totalcount;
                        this.spinner.stop('load');
                      } else {
                        this.commonNotificationService.handleError(res.message);
                        this.spinner.stop('load');
                      }
                    },
                    (err) => {
                      this.commonNotificationService.handleError(err.error.message);
                      this.spinner.stop('load');
                    },
                  );
              },
              (err) => {
                this.commonNotificationService.handleError(err.error.message);

                this.spinner.stop('child');
              },
            );
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);

          this.spinner.stop('auth');
        },
      );
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.filter();
  }

  filter() {
    this.newArray = [];
    // this.filterData.userid = this.userMasterID;
    this.spinner.start('filter');
    this.api
      .callApi(
        this.constant.GETEXPENSEAUTHBYUSEREXPENSETRANS,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('filter');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('filter');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);

          this.spinner.stop('filter');
        },
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

  getCheckboxValues(ev, data) {
    let obj = data;

    if (ev.target.checked) {
      // Pushing the object into array
      this.newArray.push(obj);

      this.rows.map((todo, i) => {
        if (todo.authorizationrequestid == obj.authorizationrequestid) {
          this.rows[i].checked = true;
        }
      });
    } else {
      let el = this.newArray.find((itm) => itm === data);

      if (el) this.newArray.splice(this.newArray.indexOf(el), 1);
      this.rows.map((todo, i) => {
        if (todo.authorizationrequestid == obj.authorizationrequestid) {
          this.rows[i].checked = false;
        }
      });
    }

    this.getNewArray.emit(this.newArray);
  }

  accept1() {
    this.newArray2 = [];
    this.remarks = this.accept.value.remarks
    for (let i = 0; i < this.newArray.length; i++) {
      this.newArray2.push({
        userexpensetransactionid: this.newArray[i].ReferenceID,
        authorizationrequestid: this.newArray[i].AuthorizationRequestId,
        remarks: this.remarks,
      });
    }

    const body = {
      newArray: this.newArray2,
      authstatus: 1,
      updateBy: localStorage.getItem('id'),
    };

    this.spinner.start('AcceptAll');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTEXPENSEALL, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess('Expense Accepted Successfully');
          this.newArray = [];
          this.newArray2 = [];
          this.remarks = '';
          this.acceptModal.hide();
          this.getNewArray.emit(this.newArray);
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
          }, 3000);
          this.filter();
          this.spinner.stop('AcceptAll');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.filter();
          this.spinner.stop('AcceptAll');
        }
      });
  }
  reject1() {
    if (!this.reject.valid) return;
    this.remarks = this.reject.value.remarks
    this.newArray2 = [];
    for (let i = 0; i < this.newArray.length; i++) {
      this.newArray2.push({
        userexpensetransactionid: this.newArray[i].ReferenceID,
        authorizationrequestid: this.newArray[i].AuthorizationRequestId,
        remarks: this.remarks,
      });
    }

    const body = {
      newArray: this.newArray2,
      authstatus: 0,
      updateBy: localStorage.getItem('id'),
    };

    this.spinner.start('RejectAll');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTEXPENSEALL, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.newArray = [];
          this.newArray2 = [];
          this.remarks = '';
          this.rejectModal.hide();
          this.getNewArray.emit(this.newArray);
          this.commonNotificationService.handleSuccess('Expense Rejected Successfully');
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
          }, 3000);
          this.filter();
          this.spinner.stop('RejectAll');
        } else {
          this.commonNotificationService.handleSuccess(res.message);
          this.filter();
          this.spinner.stop('RejectAll');
        }
      });
  }

  alertConfirmation(row) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Delete?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userExpenseTransactionID: row.ReferenceID,
          updateBy: localStorage.getItem('id'),
        };
        this.spinner.start('Delete');
        this.api
          .callApi(this.constant.DELETEEXPENSE, body, 'POST', true, true, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.commonNotificationService.handleSuccess('Expense Deleted Successfully');
              this.filter();
              this.spinner.stop('Delete');
            } else {
              this.commonNotificationService.handleError(res.message);
              this.filter();
              this.spinner.stop('Delete');
            }
          });
      }
    });
  }

  openAcceptModalAndSubmit(row: any) {
    this.expenseAcceptRejectModalComponent.getExpenseAuthorizationData(row.AuthorizationRequestId);
    this.expenseAcceptRejectModalComponent.acceptModal.show();
  }

  openRejectModalAndSubmit(row: any) {
    this.expenseAcceptRejectModalComponent.getExpenseAuthorizationData(row.AuthorizationRequestId);
    this.expenseAcceptRejectModalComponent.rejectModal.show();
  }

  showtracking(row: any) {
    const trackingData = {
      visitID: row?.userExpenseTransaction?.userExpense?.visitID,
      expense_date: row?.userExpenseTransaction?.userExpense?.expense_date,
      userMasterID: row?.userExpenseTransaction?.userExpense?.userMasterID,
    };
    this.getTracking.emit(trackingData);
  }
  getBranchName(row: any): string {
    return (
      row?.userExpenseTransaction?.userExpense?.userMaster?.employeeBranches[0]?.branchMaster
        ?.branchName || ''
    );
  }
  getEmployeeCode(row: any): string {
    return (
      row?.userExpenseTransaction?.userExpense?.userMaster?.employeeJoiningDetails[0]
        ?.employeeCode || ''
    );
  }

  getDepartmentName(row: any): string {
    return (
      row?.userExpenseTransaction?.userExpense?.userMaster?.employeeDepartments[0]?.department
        ?.departmentName || ''
    );
  }

  getDesignationName(row: any): string {
    return (
      row?.userExpenseTransaction?.userExpense?.userMaster?.employeeDesignations[0]?.designation
        ?.designationName || ''
    );
  }

  clear(){
    this.userMasterID = null;
    this.fromdate = null;
    this.todate = null;
    this.expenseType = null;

    this.filterData = {
      page: 1,
      limit: 20,
      authorizerUserMasterID: +localStorage.getItem('id'),
      userid: [],
      fromdate: '',
      todate: '',
      expenseType: '',
    };

    this.remarks = '';
    this.getauthrequestdata()
  }
}
