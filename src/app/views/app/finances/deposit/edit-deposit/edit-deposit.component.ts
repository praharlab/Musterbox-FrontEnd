import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-deposit',
    templateUrl: './edit-deposit.component.html',
    styleUrls: ['./edit-deposit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditDepositComponent implements OnInit {
  @ViewChild('editdeposit') editdeposit: NgForm;
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
  depositdata: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  showdate:boolean = false
  showsalary: boolean = false;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.companyid(this.company_id);
    this.editdata();
  }

  editdata() {
    let companyid = this.formValue.ListDepositComponent.id;
    this.spinner.start('get');
    this.api
      .callApi(this.constant.VIEWDEPOSITDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.depositdata = res.data;
          var data = String(this.depositdata.salaryMonth);
          this.depositdata.salaryMonth = data.slice(0, 4) + '-' + data.slice(4);

          const data1 = String(this.depositdata.salaryMonthToPay);

          this.depositdata.salaryMonthToPay = data1 ?  data1.slice(0, 4) + '-' + data1.slice(4) :null;

          this.companyid(this.depositdata.companyMasterID);

          // this.depositpayable(this.depositdata.depositPayAs);
          this.depositreceived(this.depositdata.depositReceiveAs);

          // if (this.depositdata.depositReceiveAs == 'cash') {
          //   this.showdate = true;
          //   this.salary = false;
          // } else {
          //   this.salary = true;
          //   this.showdate = false;

          // }
          this.spinner.stop('get');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('get');
        },
      );
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
    if (!this.editdeposit.valid) {
      return;
    }

    let salarymonth;
    if (this.editdeposit.value.salaryMonth != undefined && this.salary) {
      salarymonth = this.editdeposit.value.salaryMonth.replace('-', '');
    } else {
      salarymonth = this.editdeposit.value.salaryMonth = null;
    }

    const salaryMonthToPay = this.showsalary
    ? this.editdeposit.value.salaryMonthPayable.replace('-', '')
    : null;
 
     const body = {
        depositId: this.formValue.ListDepositComponent.id,
        depositCategoryID: this.editdeposit.value.depositCategoryID,
        //  userMasterID: this.editdeposit.value.userMasterID,
        amount: this.editdeposit.value.amount,
        description: this.editdeposit.value.description,
        dateOfDeposit:this.showdate? this.editdeposit.value.dateOfDeposit:null,
        depositReceiveAs: this.editdeposit.value.depositReceiveAs,
        salaryMonth:this.salary? salarymonth:null,
        //  companyMasterID: this.editdeposit.value.companyMasterID,
        status: '1',
        updateBy: localStorage.getItem('id'),
        // depositPayAs: this.editdeposit.value.depositPayAs,
        // salaryMonthToPay: salaryMonthToPay,
      };
  
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.UPDATEDEPOSITDATA, body, 'POST', true, true, true).subscribe(
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
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  companyid(id: number) {

    this.category = [];
    this.user = [];

    if (!id) return;

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
          this.spinner.stop();
        }
      });
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
