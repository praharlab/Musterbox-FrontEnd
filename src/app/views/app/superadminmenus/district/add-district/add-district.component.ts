import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-add-district',
    templateUrl: './add-district.component.html',
    styleUrls: ['./add-district.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddDistrictComponent implements OnInit {

  @ViewChild('adddesignation') adddesignation: NgForm;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  stateData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.getState();
  }

  getState() {
    const body = {
      page: '',
      limit: ''
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLSTATE, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.stateData = res.data;
          this.spinner.stop('company');
        } else {
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.spinner.stop('company');
      },
    );
  }




  onSubmit() {
    if (!this.adddesignation.valid) {
      return;
    }
    let body;
    body = {
      districtName: this.adddesignation.value.districtName,
      stateMasterID: this.adddesignation.value.stateMasterID,
    };
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.ADDDISTRICT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/district/']);
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

  // getIPAddress() {
  //   this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
  //     this.ipAddress = res.ip;
  //   });
  // }
}
