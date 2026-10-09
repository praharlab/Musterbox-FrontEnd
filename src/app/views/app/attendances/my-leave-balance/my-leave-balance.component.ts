import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';


@Component({
    selector: 'app-my-leave-balance',
    templateUrl: './my-leave-balance.component.html',
    styleUrls: ['./my-leave-balance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyLeaveBalanceComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;

  rows = [];
  rows2 = [];
  company_id: any;
  branch_id: any;
  company: any;
  body1 = {
    companyid: '',
    branch_id: '',
    date: '',
  };
  bName: any;
  employeedata: any;
  allbranch: any;
  employee: any;
  permissionview: any;
  balance: any;
  visible: Boolean = false;
  rows3: any;
  visible1: boolean = false;
  visible2: boolean = false;
  latebyData: any;
  earlybyData: any;
  showData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
    this.company_id = localStorage.getItem('company_id');
    this.getdashboardData();
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
              permissionval.formName == 'MyLeaveBalance' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }
  showdata(data: any) {
    this.showData = data;
  }

  getdashboardData() {
    const id = localStorage.getItem('company_id');
    const userid = localStorage.getItem('id');

    if (id && userid) {
      const queryString = `?companyMasterID=${id}&userMasterID=${userid}`;

      this.spinner.start('oninit');
      this.api
        .callApi(this.constant.GETUSERLEAVEBALANCE + queryString, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.visible = true;
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
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

}
