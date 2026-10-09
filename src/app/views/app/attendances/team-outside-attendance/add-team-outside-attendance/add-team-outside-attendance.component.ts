import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'app-add-team-outside-attendance',
    templateUrl: './add-team-outside-attendance.component.html',
    styleUrls: ['./add-team-outside-attendance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTeamOutsideAttendanceComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  adminRoot = environment.adminRoot;

  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;

  employee: any;
  attendancepolicy1: any;
  fileselected?: Blob;
  pdfUrl?: string;
  base64: string;
  comp: any;
  usertype: any;
  company_id: any;
  childcompany: string;
  users: any;
  selectedCompanyData: any;
  copersonlist: any;
  selectedfromDate: any;
  selectedToDate: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private sant: DomSanitizer,
  ) {}

  ngOnInit(): void {
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
  }
  fromDateChange() {
    this.selectedToDate = ''
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    this.spinner.start();

    let body = {
      userMasterID: this.addcomp.value.user,
      fromDate: this.addcomp.value.fromDate,
      ToDate: this.addcomp.value.ToDate,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEDATEEWISEATTENDANCEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              'Date wise Atttendancepolicy Added Successfully.',
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            );
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/attendances/Team-Outside-Attendance']);
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
}
