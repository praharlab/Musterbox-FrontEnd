import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-add-req-adv-pay',
    templateUrl: './add-req-adv-pay.component.html',
    styleUrls: ['./add-req-adv-pay.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddReqAdvPayComponent implements OnInit {
  @ViewChild('addreqadvancepay') addreqadvancepay: NgForm;
  adminRoot = environment.adminRoot;
  isdisabled = false;
  ipAddress: any;
  usertype: any;
  company_id: any;
  allcomp: any;
  childcompany: any;
  company: any;
  employee: any;
  userMaster: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private modalService: ModalService

  ) { }

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
    if (!this.addreqadvancepay.valid) {
      return;
    }
    var body = {
      userMasterID: localStorage.getItem('id'),
      companyMasterID: this.company_id,
      description: this.addreqadvancepay.value.Description,
      amount: this.addreqadvancepay.value.advanceAmount,
      AdvanceStatus: 0,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.api
      .callApi(this.constant.CREATEREQUESTADVANCEPAYMENT, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
              this.router.navigate([this.adminRoot + '/finances/advancePaymentNew']);
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
