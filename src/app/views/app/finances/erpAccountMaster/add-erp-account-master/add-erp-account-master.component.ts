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
    selector: 'app-add-erp-account-master',
    templateUrl: './add-erp-account-master.component.html',
    styleUrls: ['./add-erp-account-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddErpAccountMasterComponent implements OnInit {
  @ViewChild('adderpaccountmaster') adderpaccountmaster: NgForm;
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
  erpdata1: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.companyid();
    this.erpdata();
  }


  erpdata() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
    };

    this.api.callApi(this.constant.GETERP, filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.erpdata1 = res.data;
            this.spinner.stop();
          } else {
            // Handle non-success HTTP status
            this.notifications.create('Error', 'Something went wrong', NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          }
        },
        (error) => {
          // Handle errors from the API call
          if (error.status === 0) {
            // Handle network errors or timeout
            this.notifications.create('Error', 'Request timed out. Please try again later.', NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          } else {
            // Handle other HTTP errors
            this.notifications.create('Error', 'Something went wrong', NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          }
        }
      );
  }



  onSubmit() {
    if (!this.adderpaccountmaster.valid) {
      return;
    }
    let body;

    body = {
      userMasterID: this.adderpaccountmaster.value.userMasterID,
      erpAcountID: this.adderpaccountmaster.value.erpAcountID,
      companyMasterID: localStorage.getItem('company_id'),
      status: '1',
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEERPMASTERDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/erpAccountMaster']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
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
          this.spinner.stop();
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
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  companyid() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
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


}