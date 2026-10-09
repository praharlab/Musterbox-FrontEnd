import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-expense-head',
    templateUrl: './edit-expense-head.component.html',
    styleUrls: ['./edit-expense-head.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditExpenseHeadComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild(' addcategory') addcategory: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal')lgModal: any;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  product: any = [];
  companydata: any;
  usertype: any;
  company_id: any;
  category: any;
  showdepart: boolean = false;
  permissioncreate: any = [];
  companyid: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  rows: any = [];
  rows1: any = [];


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getproduct();
    this.editdata();
    this.getcategory();
    this.checkpermission();
    // this.erpHead(this.company_id);
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
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseCategory' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getcategory() {
    this.spinner.start();
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.api
      .callApi(this.constant.EXPENSECATEGORYBYCOMPANYDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.category = res.data;
          this.spinner.stop();
        }
      });
  }
  editdata() {
    let companyid = this.formValue.ListExpenseHeadComponent.id;
    this.spinner.start();
    this.api
      .callApi(
        this.constant.VIEWEXPENSEHEADDATA + this.formValue.ListExpenseHeadComponent.id,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          this.company(this.companydata.companyMasterID);
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

  getproduct() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    let body = {
      expenseHeadId: this.formValue.ListExpenseHeadComponent.id,
      expenseHead1: this.addcomp.value.expenseHead,
      expenseCategoryId: this.addcomp.value.expenseCategoryId,
      companyMasterID: this.addcomp.value.companyMasterID,
      accountHeadID: this.addcomp.value.accountHeadID,
      status: '1',
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEEXPENSEHEADDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/expense_head']);
            this.spinner.stop();
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  company(ev) {
    if (ev == undefined) {
      this.showdepart = false;
    } else {
      this.companyid = ev;
      this.showdepart = true;

      this.spinner.start('getcompany');
      const body = {
        page: '',
        limit: '',
        companyMasterID: ev,
      };
      this.api
        .callApi(this.constant.EXPENSECATEGORYBYCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.category = res.data;
            this.spinner.stop('getcompany');
          }
        },(err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getcompany');
        },);
      this.erpHead(ev);
    }
  }

  onSubmit1() {
    if (!this.addcategory.valid) {
      return;
    }
    const filterData = {
      expenseCategory1: this.addcategory.value.expenseCategory,
      companyMasterID: this.companyid,
      status: '1',
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEEXPENSECATEGORYDATA, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();

          this.addcategory.resetForm();

          this.company(this.companyid);

          this.spinner.stop();
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      });
  }


  erpHead(ev) {
    const body = {
      companyMasterID: ev,
    };

    this.spinner.start('geterphead');
    this.api.callApi(this.constant.ERPEXPENSEHEAD, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows1 = res.data;
          this.spinner.stop('geterphead');
        } else {
          this.rows1 = [];
          this.spinner.stop('geterphead');
        }
      },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('geterphead');
        },);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
