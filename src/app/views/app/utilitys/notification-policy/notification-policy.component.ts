import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-notification-policy',
    templateUrl: './notification-policy.component.html',
    styleUrls: ['./notification-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NotificationPolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  adminRoot = environment.adminRoot;

  file: any;
  format: any;
  url: any;
  ipAddress: any;
  comp: any;
  usertype: any;
  company_id: any;
  childcompany: string;
  company: any;
  companydata: any;
  selectedCompanyData: any;
  showData: boolean = false;
  MailData: any = {
    email: '',
    password: '',
    port: null,
    hostmail: '',
    secure: true
  };
  defaultemail: any;
  permissiondelete: any;
  permissionedit: any;
  permissionview: any;
  permissioncreate: any;
  selectedcompany: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.selectedcompany = Number(this.company_id);
    this.childcompany = localStorage.getItem('childcompany');
    this.getIPAddress();
    this.getcompany();
    this.selectCompany(this.company_id);
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
              permissionval.formName == 'MailSetup' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MailSetup' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MailSetup' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MailSetup' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  checkEmail() {
    let body = {
      companyMasterID: this.addcomp.value.company,
      userMasterID: localStorage.getItem('id'),
    };
    this.spinner.start();
    this.api.callApi(this.constant.TESTMAIL, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/utilitys/notification_policy']);

            this.spinner.stop();
          }, 3000);
        } else {
          let message = 'Please provide proper information!';

          if (res.message.reason) {
            message = res.message.reason;
          } else if (res.message.response) {
            message = res.message.response.slice(0, 45);
          }

          this.notifications.create('Error', message, NotificationType.Bare, {
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
  selectCompany(event: any) {
    this.showData = false;

    if (!event) {
      return;
    }

    this.spinner.start();
    this.api
      .callApi(this.constant.GETNOTIFICATIONDATABYCOMPANYID + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.MailData = res.data;
          this.spinner.stop();
        }
      });

    this.showData = true;
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body;

    if (this.childcompany == 'false') {
      body = {
        email: this.addcomp.value.email,
        password: this.addcomp.value.password,
        port: this.addcomp.value.port,
        hostmail: this.addcomp.value.hostmail,
        companyMasterID: this.addcomp.value.company,
        secure:this.addcomp.value.secure,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        email: this.addcomp.value.email,
        password: this.addcomp.value.password,
        port: this.addcomp.value.port,
        hostmail: this.addcomp.value.hostmail,
        secure:this.addcomp.value.secure,
        companyMasterID: localStorage.getItem('company_id'),
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }

    this.spinner.start();
    this.api.callApi(this.constant.ADDNOTIFICATIONPOLICY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/utilitys/notification_policy']);

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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  
}
