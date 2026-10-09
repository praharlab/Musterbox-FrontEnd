import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

@Component({
    selector: 'app-add-advance-expense-payment',
    templateUrl: './add-advance-expense-payment.component.html',
    styleUrls: ['./add-advance-expense-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAdvanceExpensePaymentComponent implements OnInit {
  @ViewChild('addPayment') addPayment: NgForm;
  adminRoot = environment.adminRoot;

  datefilter = '';
  PaymentMode = '';
  refNo = '';
  refDate = '';
  expensefiltervalue: any;
  expense_data = [];
  amount = '';
  expensefiltervalueAfterSubmit: any;
  company_id: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: []
  }
  company1: any;
  alluser: any;
  allbranch: any;
  selectedBranch: any;
  selectedUser: any;
  userMasterID: '';
  remarks:'';
  constructor(private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,) { }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
    }
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        }
      });
  }

  getUsers() {



    this.users_Body.branchMasterID = this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0 ? this.users_Body.branchMasterID : null

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

  selectcompany(id: any) {
    this.alluser = [];
    this.allbranch = [];

    this.selectedBranch = [];


    this.users_Body = {
      companyMasterID: '',
      branchMasterID: null,
    }

    if (!id) return;

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stop('branch');
      });
    this.users_Body.companyMasterID = id;
    this.getUsers();
  }


  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };
    ``
    allSelect(items);
  }

  selectbranch() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.branchMasterID = this.addPayment.value.branch;
    this.getUsers();
  }

  AddPayment() {
    if (!this.addPayment.valid) {
      return;
    }
    this.userMasterID = this.addPayment.value.user;
    this.amount = this.addPayment.value.amount;
    this.datefilter = this.addPayment.value.paymentDate;
    this.PaymentMode = this.addPayment.value.paymentmode;
    this.refNo = this.addPayment.value.referenceNO ? this.addPayment.value.referenceNO : null;
    this.refDate = this.addPayment.value.referenceDate ? this.addPayment.value.referenceDate : null;
    this.remarks = this.addPayment.value.remarks;
    let body = {};

    if (this.expensefiltervalue == 0) {
      body = {
        userMasterID: this.userMasterID,
        amount: this.amount,
        paymentDate: this.datefilter,
        paymentmode: this.PaymentMode,
        referenceNO: this.refNo,
        referenceDate: this.refDate,
        createBy: localStorage.getItem('id'),
        paymentType: 1,
        expensefilter: this.expensefiltervalueAfterSubmit,
        remarks: this.remarks,
      };
    } else {
      body = {
        userMasterID: this.userMasterID,
        amount: this.amount,
        paymentDate: this.datefilter,
        paymentmode: this.PaymentMode,
        referenceNO: this.refNo,
        referenceDate: this.refDate,
        createBy: localStorage.getItem('id'),
        paymentType: 1,
        expensefilter: this.expensefiltervalueAfterSubmit,
        remarks: this.remarks,
      };
    }

    this.spinner.start('AddPayment');
    this.api
      .callApi(this.constant.ADDEXPENSEADVANCE, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/list_advance_payment']);
          }, 3000);
          this.spinner.stop('submit');
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('AddPayment');
        }
      });
  }

}
