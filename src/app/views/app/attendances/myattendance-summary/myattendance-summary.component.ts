import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-myattendance-summary',
    templateUrl: './myattendance-summary.component.html',
    styleUrls: ['./myattendance-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyattendanceSummaryComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  permissionview: any = [];
  scrollBarHorizontal = window.innerWidth < 1201;

  body = {
    companyMasterID: localStorage.getItem('company_id'),
    userMasterID: localStorage.getItem('id'),
    month: '',
    createBy: localStorage.getItem('id'),
    createByIp: '',
  };

  ipAddress: any;
  rows: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.rows = [];
    this.body = {
      companyMasterID: localStorage.getItem('company_id'),
      userMasterID: localStorage.getItem('id'),
      month: '',
      createBy: localStorage.getItem('id'),
      createByIp: '',
    };
    this.checkpermission();
    this.getIPAddress();
    this.getAlldata();
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyAttendanceSummary' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getAlldata() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
      userMasterID: localStorage.getItem('id'),
      month: '',
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.spinner.start('oninit');
    this.api
      .callApi(this.constant.GETMYATTENDANCESUMMARY, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.spinner.stop('oninit');
        } else {
          this.handleError(res.message);
          this.spinner.stop('oninit');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('oninit');
      },
    );
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.body.month = this.datefilter.value.YearMM.replace('-', '');
    this.body.createByIp = this.ipAddress;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETMYATTENDANCESUMMARY, this.body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.spinner.stop();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
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

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 200);
  }

  
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  
}
