import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-deposit',
    templateUrl: './add-deposit.component.html',
    styleUrls: ['./add-deposit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddDepositComponent implements OnInit {
  @ViewChild('adddeposit') adddeposit: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  category: any;
  user: any;
  salary: boolean;
  showdate: boolean = false;
  adminRoot = environment.adminRoot;
  selectedUser: any = [];
  showsalary: boolean = false;
  selectedCompany:any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    // this.companyid(this.company_id);
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.adddeposit.valid) {
      return;
    }
    let salarymonth;

    if (this.adddeposit.value.salaryMonth != undefined && this.salary) {
      salarymonth = this.adddeposit.value.salaryMonth.replace('-', '');
    } else {
      salarymonth = null;
    }

    const salaryMonthToPay = this.showsalary
      ? this.adddeposit.value.salaryMonthPayable.replace('-', '')
      : null;

    const body = {
      depositCategoryID: this.adddeposit.value.depositCategoryID,
      userMasterID: this.selectedUser,
      amount: this.adddeposit.value.amount,
      description: this.adddeposit.value.description,
      dateOfDeposit: this.showdate ? this.adddeposit.value.dateOfDeposit : null,
      depositReceiveAs: this.adddeposit.value.depositReceiveAs,
      salaryMonth: salarymonth,
      companyMasterID: this.selectedCompany,
      status: '1',
      createBy: localStorage.getItem('id'),
      // depositPayAs: this.adddeposit.value.depositPayAs,
      // salaryMonthToPay: salaryMonthToPay,
    };

    this.spinner.start('add');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEDEPOSITDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/deposit']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('add');
      },
    );
  }

  companyid(id: number) {
    this.category = [];
    this.user = [];
    this.selectedCompany = ''

    if (!id) return;

    this.selectedCompany = id;

    this.api
      .callApi(this.constant.GETDEPOSITCATEGORYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.category = res.data;
          this.spinner.stop();
        }
      });

    const filterData = {
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.user = res.data;
          this.user.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });

          this.selectAllForDropdownItems(this.user);
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


  depositreceived(data) {
    if (!data) {
      this.showdate = false;
      this.salary = false;
      return;
    }
    if (data == 'cash') {
      this.showdate = true;
      this.salary = false;
    } else {
      this.salary = true;
      this.showdate = false;
    }
  }

  // depositpayable(data) {
  //   this.showsalary = false;

  //   if (data == 'salary') {
  //     this.showsalary = true;
  //   }
  // }

  onSubmit1() {
    if (!this.addcomp1.valid) {
      return;
    }
    let body;

    if (this.childcompany == 'false') {
      body = {
        depositcategoryname: this.addcomp1.value.depositcategoryname,
        companyMasterID: this.addcomp1.value.companyMasterID,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        depositcategoryname: this.addcomp1.value.depositcategoryname,
        companyMasterID: localStorage.getItem('company_id'),
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }

    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEDEPOSITCATEGORYDATA, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.ngOnInit();
            this.companyid(body.companyMasterID);
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
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
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }
}
