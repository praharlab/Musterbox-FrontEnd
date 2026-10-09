import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-addattendance-cal',
    templateUrl: './addattendance-cal.component.html',
    styleUrls: ['./addattendance-cal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddattendanceCalComponent implements OnInit {
  @ViewChild('addattendance') addattendance: NgForm;

  ipAddress: any;
  yearMonth: any = [];
  employee: any = [];
  companydata: any = [];
  isdisebled: boolean = false;
  company_id: any;
  childcompany: any;
  company: any = [];
  leavetypedata: any = [];
  monthdays: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
  }

  getLeavetype() {

    if (this.addattendance.value.AttnYearMon != '' && this.addattendance.value.userMasterID != '') {
      let month = this.addattendance.value.AttnYearMon.slice(-2);
      let year = this.addattendance.value.AttnYearMon.substr(0, 4);
      this.monthdays = new Date(parseInt(year), parseInt(month), 0).getDate();
      let body = {
        parameters: [
          this.addattendance.value.companyMasterID,
          this.addattendance.value.AttnYearMon.replace('-', ''),
          this.addattendance.value.userMasterID,
        ],
      };
      this.api
        .callApi(
          this.constant.commonfun + '/getHrLeaveMonthlyTrans',
          body,
          'POST',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.leavetypedata = res.data;
            this.spinner.stop();
          }
        });
    }
  }

  getCompanyUser() {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: this.addattendance.value.companyMasterID,
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

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.addattendance.valid) {
      return;
    }
    var body = [];
    this.leavetypedata.forEach((element) => {
      body.push({
        userMasterID: element.usermasterid,
        LeaveTranId: element.leavetranid,
        AttnYearMon: element.attnyearmon,
        MonDays: this.monthdays,
        MonWorkDays: element.monworkdays,
        AttnVal: element.attnval,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      });
    });
    this.spinner.start();
    this.isdisebled = true;
    this.api.callApi(this.constant.CREATEHRMONTHLYTRANS, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          // this.ngOnInit();
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/attendancecal']);
            this.spinner.stop();
            this.isdisebled = false;
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
          this.isdisebled = false;
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
        this.isdisebled = false;
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
