import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-list-employee-leave-bal',
    templateUrl: './list-employee-leave-bal.component.html',
    styleUrls: ['./list-employee-leave-bal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeLeaveBalComponent implements OnInit {
  isdisabled = false;
  ipAddress: any;

  toda: boolean = false;
  index: any;
  LeaveType: any;
  UserLeaveBal: any = [];
  CompanyData: any;
  companyid: any;
  LeaveBalance: any;
  Leaveused: any;
  formValue: any;
	
  constructor(
    private spinner: NgxUiLoaderService,
    private datePipe: DatePipe,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getIPAddress();
    this.getLeaveType();
    this.profileStatusService.refreshProfileStatus();
  }

  getLeaveType() {
    this.spinner.start('LEAVE1');
    this.api
      .callApi(
        this.constant.GETLEAVEBAL + '/' + this.formValue.ListEmployeeMasterComponent.id,
        [],
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.LeaveType = res.data;

          this.UserLeaveBal = [];
          this.LeaveType.forEach((element) => {
            this.UserLeaveBal.push({
              LeaveBalTranId: element.LeaveBalTranId,
              LeaveTranId: element.LeaveTranId,
              userMasterID: element.userMasterID,
              leavename: element.leavename,
              leavedesc: element.leavedesc,
              leavebal: element.leavebal,
              YearMM: element.YearMM,
            });
          });

          this.spinner.stop('LEAVE1');
        }
      });

    this.spinner.start('LEAVE2');
    this.api
      .callApi(
        this.constant.GETLEAVEBALANCEADDED + this.formValue.ListEmployeeMasterComponent.id,
        [],
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.LeaveBalance = res.data;

          this.spinner.stop('LEAVE2');
        }
      });

    this.spinner.start('LEAVE3');
    this.api
      .callApi(
        this.constant.GETLEAVEBALANCEUSED + this.formValue.ListEmployeeMasterComponent.id,
        [],
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.Leaveused = res.data;

          this.spinner.stop('LEAVE3');
        }
      });
  }

  onSubmit() {
    var body = {
      leaveBalanceArray: this.UserLeaveBal,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    const result = this.UserLeaveBal.filter((s) => s.YearMM == '0000-00');
    if (result.length > 0) {
      this.notifications.create('Error', 'Please add all data.', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    this.api.callApi(this.constant.UPDATELEAVEBAL, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          //  this.isdisabled=false;
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.ngOnInit();
          this.spinner.stop();
          // this.isdisabled=false;
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
          // this.isdisabled=false;
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
        // this.isdisabled=false;
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
