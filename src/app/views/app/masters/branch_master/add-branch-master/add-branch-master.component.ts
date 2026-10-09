import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { labelUtils } from '../../../../../constants/labelUtils';

@Component({
    selector: 'app-add-branch-master',
    templateUrl: './add-branch-master.component.html',
    styleUrls: ['./add-branch-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddBranchMasterComponent implements OnInit {
  @ViewChild('addbranch') addbranch: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  ipAddress: any;
  usertype: any;
  company_id: any;
  allcomp: any = [];
  childcompany: any;
  company: any;
  buttonDisabled = false;
  buttonState = '';
  selectedstate: any;
  selectedcity: any;
  adminRoot = environment.adminRoot;
  pfNumberlabel = labelUtils.pfNumber;
  esicNumberlabel = labelUtils.esicNumber;

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
    this.company_id = Number(localStorage.getItem('company_id'));
    this.getcompany();
    this.getallcountry();
    this.getIPAddress();
  }

  getcompany() {
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
            this.allcomp = res.data;
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
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }
  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.country = res.data;
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.addbranch.valid) {
      return;
    }
    this.spinner.start();
    let body;
    if (this.addbranch.value.latitude == '') {
      this.addbranch.value.latitude = null;
    }
    if (this.addbranch.value.longitude == '') {
      this.addbranch.value.longitude = null;
    }
    if (this.addbranch.value.radius == '') {
      this.addbranch.value.radius = null;
    }

    body = {
      companyMasterID: this.addbranch.value.company,
      branchName: this.addbranch.value.branchName,
      branchCode: this.addbranch.value.branchCode,
      branchAddress: this.addbranch.value.branchAddress,
      cityMasterID: this.finalcityid,
      latitude: this.addbranch.value.latitude,
      longitude: this.addbranch.value.longitude,
      radius: this.addbranch.value.radius,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      gstNumber: this.addbranch.value.gstNumber,
      lwfNumber: this.addbranch.value.lwfNumber,
      professionaltaxNumber: this.addbranch.value.professionaltaxNumber,
      pfNumber: this.addbranch.value.pfNumber,
      esicNumber: this.addbranch.value.esicNumber,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEBRANCH, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/branch']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
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
  selectcountry(country: any) {
    this.selectedstate = '';
    this.state = [];
    this.selectedcity = '';
    this.city = [];
    if (!country) {
      return;
    }
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
        },
        (err) => {
          console.log('error', err);
        },
      );
  }
  selectstate(state: any) {
    this.selectedcity = '';
    this.city = [];

    if (!state) {
      return;
    }
    this.api
      .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.city = res.data;
        },
        (err) => {
          console.log('error', err);
        },
      );
  }
  selectcity(city: any) {
    if (city) {
      this.finalcityid = city;
    } else {
      this.finalcityid = null;
    }
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  selectcompany(ev: any) {
    this.company = ev;
  }
}
