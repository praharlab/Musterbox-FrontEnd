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
    selector: 'app-addleave-types',
    templateUrl: './addleave-types.component.html',
    styleUrls: ['./addleave-types.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddleaveTypesComponent implements OnInit {
  @ViewChild('addleavetype') addleavetype: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  leaveMaster: any;
  isdisabled: boolean = false;
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
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getCompany();
    this.getLeaveMaster();
  }

  getLeaveMaster() {
    this.spinner.start();
    const bb = {
      limit: '',
      page: '',
    };
    this.api.callApi(this.constant.GETALLLEAVEMASTER, bb, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.leaveMaster = res.data;
        this.spinner.stop();
      },
      (err) => {
        this.spinner.stop();
      },
    );
  }

  getCompany() {
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
            this.company = res.data;
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
            this.company = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  onSubmit() {
    if (!this.addleavetype.valid) {
      return;
    }
    this.isdisabled = true;
    let body = {
      LeaveID: this.addleavetype.value.LeaveID,
      SortIndex: this.addleavetype.value.SortIndex,
      // Allow_On_H:this.addleavetype.value.Allow_On_H,
      Leave_Max_Days: this.addleavetype.value.Leave_Max_Days,
      // Leave_Elegibility_Days:this.addleavetype.value.Leave_Elegibility_Days,
      // Leave_per_Days:this.addleavetype.value.Leave_per_Days,
      Leave_CF: this.addleavetype.value.Leave_CF,
      Leave_Allow: this.addleavetype.value.Leave_Allow,
      // Eff_Total: this.addleavetype.value.Eff_Total,
      // Allow_Field_Entry: this.addleavetype.value.Allow_Field_Entry,
      companyMasterID: this.addleavetype.value.companyMasterID,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start('submit');
    this.api.callApi(this.constant.CREATELEAVETYPES, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          setTimeout(() => {
            this.isdisabled = false;
            this.router.navigate([this.adminRoot + '/masters/leavetypes']);
            this.spinner.stop('submit');
          }, 3000);

        } else {
          this.isdisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.isdisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
