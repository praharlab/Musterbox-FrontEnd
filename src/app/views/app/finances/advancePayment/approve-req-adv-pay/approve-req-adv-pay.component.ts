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
import { ModalService } from 'src/app/services/modal.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';


@Component({
    selector: 'app-approve-req-adv-pay',
    templateUrl: './approve-req-adv-pay.component.html',
    styleUrls: ['./approve-req-adv-pay.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ApproveReqAdvPayComponent implements OnInit {
  @ViewChild('approvereqadvancepayment') approvereqadvancepayment: NgForm;
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


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private datepipe: DatePipe,
    private modalService: ModalService,
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

    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('comp');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
        }
        this.spinner.stop('comp');
      });

  }

  editdata() {
    let advanceid = this.formValue.ListAdvancePaymentComponent.id;
    this.spinner.start('editdata');
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
          if (this.advanceData.paymentYearMonth) {
            this.advanceData.paymentYearMonth =
              JSON.stringify(this.advanceData.paymentYearMonth).slice(0, 4) +
              '-' +
              JSON.stringify(this.advanceData.paymentYearMonth).slice(4);
          }

          let bb = {
            page: '',
            limit: '',
            companyMasterID: this.advanceData.companyMasterID,
          };

          this.api
            .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.employee = res.data;
                this.spinner.stop('editdata');
              } else {
                this.spinner.stop('editdata');
              }
            });
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('editdata');
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
    this.spinner.start('comp');
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop('comp');
        }
      });
  }

  onSubmit() {
    if (!this.approvereqadvancepayment.valid) {
      return;
    }
    let body = {};
    if (this.childcompany == 'true') {
      body = {
        advancePaymentID: this.formValue.ListAdvancePaymentComponent.id,
        userMasterID: this.approvereqadvancepayment.value.userMasterId1,
        companyMasterID: this.approvereqadvancepayment.value.company1,
        description: this.approvereqadvancepayment.value.Description,
        amount: this.approvereqadvancepayment.value.advanceAmount,
        advanceDate: this.approvereqadvancepayment.value.advanceDate,
        paymentYearMonth: this.approvereqadvancepayment.value.PaymentYearMonth1.replace('-', ''),
        paymentmode: this.approvereqadvancepayment.value.paymentmode,
        referenceNO: this.approvereqadvancepayment.value.referenceNo,
        referenceDate: this.approvereqadvancepayment.value.referencedate,
        AdvanceStatus: '1,',
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    } else {
      body = {
        advancePaymentID: this.formValue.ListAdvancePaymentComponent.id,
        userMasterID: this.approvereqadvancepayment.value.userMasterId1,
        companyMasterID: this.approvereqadvancepayment.value.company1,
        description: this.approvereqadvancepayment.value.Description,
        amount: this.approvereqadvancepayment.value.advanceAmount,
        advanceDate: this.approvereqadvancepayment.value.advanceDate,
        paymentYearMonth: this.approvereqadvancepayment.value.PaymentYearMonth1.replace('-', ''),
        paymentmode: this.approvereqadvancepayment.value.paymentmode,
        referenceNO: this.approvereqadvancepayment.value.referenceNo,
        referenceDate: this.approvereqadvancepayment.value.referencedate,
        AdvanceStatus: '1',
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    }

    this.api.callApi(this.constant.UPDATEADVANCEPAYMENT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.advanceData.AdvanceStatus = '1';
          this.notifications.create(
            'Success',
            'Advance payment Request Approved',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              showProgressBar: true,
              timeOut: 3000,
            },
          );
          this.modalService.refreshUserRequestStatus();
          this.router.navigate([this.adminRoot + '/finances/advancePayment']);
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
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
}
