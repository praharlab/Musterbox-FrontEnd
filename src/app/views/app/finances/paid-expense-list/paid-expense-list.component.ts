import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-paid-expense-list',
    templateUrl: './paid-expense-list.component.html',
    styleUrls: ['./paid-expense-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PaidExpenseListComponent implements OnInit {
  @ViewChild('payment') payment: NgForm;
  @ViewChild('editpayment') editpayment: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;

  currentPage: any
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
  branchfilter: boolean = false;
  employeedata: any;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
    startdate: '',
    enddate: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  PaidData: any = [];
  PaidExpenseId: any;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

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
    this.getcompany();
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

  selectcompany(id) {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('user');
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.selectAllForDropdownItems(this.employee);
          let data1 = [];
          this.employee.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
        }
      });

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('user');
      });
  }

  selectbranch(id) {
    if (id == undefined) {
      this.payment.resetForm();
    }
    this.branchfilter = true;
    let bb = {
      branchMasterID: id,
    };
    this.spinner.start('branchuser');
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employeedata = res.data;
          this.selectAllForDropdownItems(this.employeedata);
          let data2 = [];
          this.employeedata.forEach(async (rating) => {
            data2.push(rating.userMasterID);
          });
          this.spinner.stop('branchuser');
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

  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.startdate = val.fromdate;
    this.filterData.enddate = val.todate;

    this.getAllPaidExpense()
  }

  clear(){
    this.rows = []
    this.filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
    startdate: '',
    enddate: '',
  };
  }

  getAllPaidExpense(){
    this.spinner.start('submit');

    this.api
      .callApi(this.constant.LISTPAIDEXPENSE_V2, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          });
          this.spinner.stop('submit');
        }
      });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getAllPaidExpense()
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.filterData.limit = this.filterData.limit;
    this.getAllPaidExpense()
  }

  showdata(row) {
    this.PaidExpenseId = row;

    this.spinner.start('PaidDetails');
    this.api
      .callApi(this.constant.GETPAIDEXPENSEBYID + this.PaidExpenseId, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.PaidData = res.data;
          this.PaidData.paymentDate = this.PaidData.paymentDate.slice(0, 10)
          this.spinner.stop('PaidDetails');
        }
      });
  }

  updatePaidData() {
    if (!this.editpayment.valid) {
      return;
    }

    let body = {
      ExpensePaymentID: this.PaidData.ExpensePaymentID,
      paymentDate: this.editpayment.value.paymentDate,
      paymentmode: this.editpayment.value.paymentmode,
      referenceNO: this.editpayment.value.referenceNO ? this.editpayment.value.referenceNO : null,
      referenceDate: this.editpayment.value.referenceDate
        ? this.editpayment.value.referenceDate
        : null,
      updateBy: localStorage.getItem('id'),
    };

    this.spinner.start('update');
    this.api
      .callApi(this.constant.UPDATEPAIDEXPENSEBYID, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          }),
            this.closeModal.nativeElement.click();
          this.getAllPaidExpense()
          this.spinner.stop('update');
        } else {
          this.notifications.create('Error', '', NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.closeModal.nativeElement.click();
          this.getAllPaidExpense()
          this.spinner.stop('update');
        }
      });
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
        const body = {
          ExpensePaymentID: id,
        };

        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEPAIDEXPENSE, body, 'POST', true, true, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              }),
                setTimeout(() => { }, 3000);
              this.getAllPaidExpense()
              this.spinner.stop('delete');
            } else {
              this.notifications.create('Error', res.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAllPaidExpense()
              this.spinner.stop('delete');
            }
          });
      }
    });
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
