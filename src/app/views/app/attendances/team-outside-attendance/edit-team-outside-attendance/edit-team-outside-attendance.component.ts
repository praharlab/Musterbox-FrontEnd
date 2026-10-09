import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-team-outside-attendance',
    templateUrl: './edit-team-outside-attendance.component.html',
    styleUrls: ['./edit-team-outside-attendance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTeamOutsideAttendanceComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  adminRoot = environment.adminRoot;

  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  parentformdata: any = ['a', 'b', 'c', 'd'];
  employee: any;
  assetMaster: any;
  assetcategory: any;
  comp: any;
  usertype: any;
  company_id: any;
  users: any;
  getattendacepolicy: any;
  attendancepolicy1: any;
  datewiseAttendancePolicy: any;
  previous_attpol: any;

  previous_user: boolean = true;
  previous_cat: boolean = true;

  childcompany: string;
  copersonlist: any;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getIPAddress();

    let id = localStorage.getItem('id');
    this.spinner.start();
    this.api
      .callApi(this.constant.REPORTTO2 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.copersonlist = res.data;
          this.copersonlist = this.copersonlist.filter((e) => {
            return e.userMasterID != id;
          });

          this.spinner.stop();
        }
      });

    this.editdata();
  }
  fromDateChange() {
    this.datewiseAttendancePolicy.ToDate = ''
  }
  editdata() {
    let attendpol = this.formValue.TeamOutsideAttendanceComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETDATEWISEADDATABYID + attendpol, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.datewiseAttendancePolicy = res.data;

          this.datewiseAttendancePolicy.userMasterID = Number(
            this.datewiseAttendancePolicy.userMasterID,
          );

          this.spinner.stop();
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
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    this.spinner.start();

    let body = {
      datewiseAttendancepolicyID: this.formValue.TeamOutsideAttendanceComponent.id,
      companyMasterID: '',
      userMasterID: this.addcomp.value.user,
      fromDate: this.addcomp.value.fromDate,
      ToDate: this.addcomp.value.ToDate,
    };

    this.api
      .callApi(this.constant.UPDATEDATEEWISEATTENDANCEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              'Datewise AttendancePolicy Update Successfully.',
              NotificationType.Bare,
              { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
            );
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/attendances/Team-Outside-Attendance']);
              this.spinner.stop();
            }, 3000);
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
}
