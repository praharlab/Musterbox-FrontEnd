import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-price-rule',
    templateUrl: './list-price-rule.component.html',
    styleUrls: ['./list-price-rule.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListPriceRuleComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  mediumDateFormat = environment.mediumDateFormat;
  adminRoot = environment.adminRoot;

  rows: any = [];
  isdisabled = false;
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  editbyid: any;
  company_id: any;
  alldepartment: any = [];
  department: any;
  current_date = new Date().toISOString().slice(0, 10);

  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.alldata();
    this.getIPAddress();
    this.company_id = localStorage.getItem('company_id');
  }

  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEXPENSEPRICE + this.formValue.ListExpenseHeadComponent.id,
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      expenseHeadId: this.formValue.ListExpenseHeadComponent.id,
      rule: this.addcomp.value.rule,
      applicableDate: this.addcomp.value.applicableDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEEXPENSEPRICE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isdisabled = true;
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/masters/expense_head/expense_price']).then(() => {
              window.location.reload();
              this.spinner.stop();
            });
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }
  edit(item) {
    this.editbyid = item;
  }
  onSubmit1() {
    if (!this.editcomp.valid) {
      return;
    }
    let body = {
      expensePriceRuleID: this.editbyid.expensePriceRuleID,
      expenseHeadId: this.formValue.ListExpenseHeadComponent.id,
      rule: this.editcomp.value.rule,
      applicableDate: this.editcomp.value.applicableDate,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEEXPENSEPRICE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isdisabled = true;
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/masters/expense_head/expense_price']).then(() => {
              window.location.reload();
              this.spinner.stop();
            });
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
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
          expensePriceRuleID: id,
          expenseHeadId: this.formValue.ListExpenseHeadComponent.id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEXPENSEPRICE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }
  // alertDeactiveConfirmation(id:any)
  // {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'User will deactive!',
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, deactive it!',
  //     cancelButtonText: 'No, keep it'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body={
  //         employeeDepartmentID:id,
  //         status:"0"
  //       }
  //       this.spinner.start()
  //       this.api.callApi(
  //         this.constant.EMPLOYEEDEPARTMENTSTATUSCHANGE,
  //         body,
  //         "POST",
  //         true,
  //         true,
  //         true
  //       ).subscribe((res: any) => {
  //        this.ngOnInit();
  //        this.spinner.stop()
  //       }, err => {
  //         this.spinner.stop()
  //       })
  //     }
  //   })
  // }
  // alertActiveConfirmation(id:any)
  // {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'User will active!',
  //     icon: 'success',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, active it!',
  //     cancelButtonText: 'No, keep it'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body={
  //         employeeDepartmentID:id,
  //         status:"1"
  //       }
  //       this.spinner.start()
  //       this.api.callApi(
  //         this.constant.EMPLOYEEDEPARTMENTSTATUSCHANGE,
  //         body,
  //         "POST",
  //         true,
  //         true,
  //         true
  //       ).subscribe((res: any) => {
  //        this.ngOnInit();
  //        this.spinner.stop()
  //       }, err => {
  //         this.spinner.stop()
  //       })
  //     }
  //   })
  // }
}
