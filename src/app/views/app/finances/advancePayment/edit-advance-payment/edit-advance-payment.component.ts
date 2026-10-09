import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-advance-payment',
    templateUrl: './edit-advance-payment.component.html',
    styleUrls: ['./edit-advance-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAdvancePaymentComponent implements OnInit {
  @ViewChild('editadvancepayment') editadvancepayment: NgForm;
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
  advanceData: any;

  formValue: any;
  minMonth: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private datepipe: DatePipe,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
    this.editdata();
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

  editdata() {
    let advanceid = this.formValue.ListAdvancePaymentComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETADVANCEBYID + '/' + advanceid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.advanceData = res.data;
          this.advanceData.companyMasterID = parseInt(this.advanceData.companyMasterID);
          this.advanceData.userMasterID = parseInt(this.advanceData.userMasterID);
          this.advanceData.advanceDate = this.datepipe.transform(
            this.advanceData.advanceDate,
            'yyyy-MM-dd',
          );

          this.selectAdvanceDate(false)

          if (this.advanceData.referenceDate) {
            this.advanceData.referenceDate = this.datepipe.transform(
              this.advanceData.referenceDate,
              'yyyy-MM-dd',
            );
          }

          this.advanceData.paymentYearMonth =
            JSON.stringify(this.advanceData.paymentYearMonth).slice(0, 4) +
            '-' +
            JSON.stringify(this.advanceData.paymentYearMonth).slice(4);
          let bb = {
            page: '',
            limit: '',
            companyMasterID: this.advanceData.companyMasterID,
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
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.editadvancepayment.valid) {
      return;
    }
    let body = {};
    if (this.childcompany == 'true') {
      body = {
        advancePaymentID: this.formValue.ListAdvancePaymentComponent.id,
        userMasterID: this.editadvancepayment.value.userMasterId,
        companyMasterID: this.editadvancepayment.value.company,
        description: this.editadvancepayment.value.Description,
        amount: this.editadvancepayment.value.advanceAmount,
        advanceDate: this.editadvancepayment.value.advanceDate,
        paymentYearMonth: this.editadvancepayment.value.PaymentYearMonth.replace('-', ''),
        paymentmode: this.editadvancepayment.value.paymentmode,
        referenceNO: this.editadvancepayment.value.referenceNo,
        referenceDate: this.editadvancepayment.value.referencedate,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    } else {
      body = {
        advancePaymentID: this.formValue.ListAdvancePaymentComponent.id,
        userMasterID: this.editadvancepayment.value.userMasterId,
        companyMasterID: this.editadvancepayment.value.company,
        description: this.editadvancepayment.value.Description,
        amount: this.editadvancepayment.value.advanceAmount,
        advanceDate: this.editadvancepayment.value.advanceDate,
        paymentYearMonth: this.editadvancepayment.value.PaymentYearMonth.replace('-', ''),
        paymentmode: this.editadvancepayment.value.paymentmode,
        referenceNO: this.editadvancepayment.value.referenceNo,
        referenceDate: this.editadvancepayment.value.referencedate,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    }
    this.api.callApi(this.constant.UPDATEADVANCEPAYMENT, body, 'POST', true, true, true).subscribe(
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

  selectAdvanceDate(resetValue:boolean = true) {
    if(resetValue)
    this.advanceData.paymentYearMonth = '';
    const selectedDate = new Date(this.advanceData?.advanceDate);

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
