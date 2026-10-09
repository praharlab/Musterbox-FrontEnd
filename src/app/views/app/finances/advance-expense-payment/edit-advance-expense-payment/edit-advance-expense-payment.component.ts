import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-advance-expense-payment',
    templateUrl: './edit-advance-expense-payment.component.html',
    styleUrls: ['./edit-advance-expense-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAdvanceExpensePaymentComponent implements OnInit {
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
  formValue: any;
  getdata: any;
  userMasterID: '';
  remarks:'';
  constructor(private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
    }
    // this.getUsers();
    this.editdata();
 
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
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

    allSelect(items);
  }

  selectbranch() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.branchMasterID = this.addPayment.value.branch;
    this.getUsers();
  }
  // AddPayment


  editdata() {
    const id = this.formValue.ListAdvanceExpensePaymentComponent.id

    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETBYIDEXPENSEADVANCE + id, {},
        'POST',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.getdata = res.data;
          if (this.getdata.paymentDate) {
            this.getdata.paymentDate = this.formatDate(this.getdata.paymentDate);
          }
          if(this.getdata.referenceDate){
            this.getdata.referenceDate = this.formatDate(this.getdata.referenceDate);
          }
          

          this.spinner.stop('data');
        },
        (err) => {
          this.handleCatchError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  onSubmit() {
    if (!this.addPayment.valid) {
      return;
    }

    this.userMasterID = this.addPayment.value.userMasterID;
    this.amount = this.addPayment.value.amount;
    this.datefilter = this.addPayment.value.paymentDate;
    this.PaymentMode = this.addPayment.value.paymentmode;
    this.refNo = this.addPayment.value.referenceNO ? this.addPayment.value.referenceNO : null;
    this.refDate = this.addPayment.value.referenceDate ? this.addPayment.value.referenceDate : null;
    this.remarks = this.addPayment.value.remarks ;

    let body = {};

    if (this.expensefiltervalue == 0) {
      body = {
        amount: this.amount,
        paymentDate: this.datefilter,
        paymentmode: this.PaymentMode,
        referenceNO: this.refNo,
        referenceDate: this.refDate,
        expensefilter: this.expensefiltervalueAfterSubmit,
        updateBy: localStorage.getItem('id'),
        remarks: this.remarks
      };
    } else {
      body = {
        amount: this.amount,
        paymentDate: this.datefilter,
        paymentmode: this.PaymentMode,
        referenceNO: this.refNo,
        referenceDate: this.refDate,
        expensefilter: this.expensefiltervalueAfterSubmit,
        updateBy: localStorage.getItem('id'),
        remarks: this.remarks

      };
    }
    this.spinner.start('AddPayment');
    this.api
      .callApi(this.constant.UPDATEEXPENSEADVANCE + this.formValue.ListAdvanceExpensePaymentComponent.id, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/list_advance_payment']);
            this.spinner.stop('AddPayment');
          }, 3000);
        } else {
          this.notifications.create('Error', 'Error', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        }
        this.spinner.stop('AddPayment');
      });
  }

  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }



}
