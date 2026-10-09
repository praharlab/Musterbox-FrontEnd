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
    selector: 'app-add-advance-payment',
    templateUrl: './add-advance-payment.component.html',
    styleUrls: ['./add-advance-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAdvancePaymentComponent implements OnInit {
  @ViewChild('addadvancepayment') addadvancepayment: NgForm;
  adminRoot = environment.adminRoot;
  isdisabled = false;
  ipAddress: any;
  usertype: any;
  company_id: any;
  allcomp: any;
  childcompany: any;
  company: any;
  yearmonth: any;
  employee: any;
  userMaster: any;
  selectedAdvanceDate: string = '';
  minMonth: any;
  selectedYearMonth: any;
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
    this.getIPAddress();
    if (this.childcompany == 'true') {
      let bb = {
        page: '',
        limit: '',
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.employee = res.data;
            this.spinner.stop();
          }
        });
    }
  }

  getcompany() {
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
            this.allcomp = res.data;
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
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  selectcompany(ev: any) {
    this.company = ev;
    let bb = {
      page: '',
      limit: '',
      companyMasterID: this.company,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.userMaster = '';
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.addadvancepayment.valid) {
      return;
    }

    if (this.childcompany == 'true') {
      var body = {
        userMasterID: this.addadvancepayment.value.userMasterID,
        companyMasterID: this.company_id,
        description: this.addadvancepayment.value.Description,
        amount: this.addadvancepayment.value.advanceAmount,
        advanceDate: this.addadvancepayment.value.advanceDate,
        paymentYearMonth: this.addadvancepayment.value.PaymentYearMonth.replace('-', ''),
        paymentmode: this.addadvancepayment.value.paymentmode,
        referenceNO: this.addadvancepayment.value.referenceNo,
        referenceDate: this.addadvancepayment.value.referencedate,
        AdvanceStatus: 1,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      var body = {
        userMasterID: this.addadvancepayment.value.userMasterID,
        companyMasterID: this.company,
        description: this.addadvancepayment.value.Description,
        amount: this.addadvancepayment.value.advanceAmount,
        advanceDate: this.addadvancepayment.value.advanceDate,
        paymentYearMonth: this.addadvancepayment.value.PaymentYearMonth.replace('-', ''),
        paymentmode: this.addadvancepayment.value.paymentmode,
        referenceNO: this.addadvancepayment.value.referenceNo,
        referenceDate: this.addadvancepayment.value.referencedate,
        AdvanceStatus: 1,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }
    this.api.callApi(this.constant.CREATEADVANCEPAYMENT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/advancePayment']);
            this.isdisabled = false;
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.isdisabled = false;
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.isdisabled = false;
        this.spinner.stop();
      },
    );


  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  selectAdvanceDate(event: any) {
    this.selectedYearMonth = '';
    this.selectedAdvanceDate = event.target.value;
    const selectedDate = new Date(this.selectedAdvanceDate);

    // Set minMonth to next month (or same month if you prefer)
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    // Format to yyyy-MM (which is what <input type="month"> expects)
    const year = nextMonth.getFullYear();
    const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0');
    this.minMonth = `${year}-${month}`;
  }

  preventBackMonth(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value; // 'YYYY-MM'

    // Only act if a value is selected
    if (!currentValue || !this.minMonth) return;

    if (event.key === 'ArrowDown') {
      // Check if already at minMonth
      if (currentValue <= this.minMonth) {
        event.preventDefault();
      }
    }

    if (event.key === 'ArrowUp') {
      if (+currentValue.substring(5) > 11) {
        event.preventDefault();
      }
    }
  }
}
