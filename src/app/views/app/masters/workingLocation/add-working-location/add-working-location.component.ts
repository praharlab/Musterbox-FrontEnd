import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-working-location',
    templateUrl: './add-working-location.component.html',
    styleUrls: ['./add-working-location.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddWorkingLocationComponent implements OnInit {
  @ViewChild('addworkinglocation') addworkinglocation: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;
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
  // branch: any;
  buttonDisabled = false;
  buttonState = '';
  selectedstate: any;
  selectedcity: any;
  // allbranch: any;
  employeedata: any;
  // branchfilter: boolean = false;
  alluser: any;
  selected: any[];
  // selectedBranch: any;
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
    this.usertype = localStorage.getItem('usertype');
    this.company_id = Number(localStorage.getItem('company_id'));
    this.getcompany();
    this.getallcountry();
    this.getIPAddress();
    // this.selectcompany(this.company_id, 0);
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
    if (!this.addworkinglocation.valid) {
      return;
    }
    this.spinner.start();
    let body;
    if (this.addworkinglocation.value.latitude == '') {
      this.addworkinglocation.value.latitude = null;
    }
    if (this.addworkinglocation.value.longitude == '') {
      this.addworkinglocation.value.longitude = null;
    }
    if (this.addworkinglocation.value.radius == '') {
      this.addworkinglocation.value.radius = null;
    }

    body = {
      companyMasterID: this.addworkinglocation.value.company,
      // branchMasterID: this.addworkinglocation.value.branch,
      workingLocationName: this.addworkinglocation.value.workingLocationName,
      workingLocationAddress: this.addworkinglocation.value.workingLocationAddress,
      cityMasterID: this.finalcityid,
      latitude: this.addworkinglocation.value.latitude,
      longitude: this.addworkinglocation.value.longitude,
      radius: this.addworkinglocation.value.radius,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEWORKINGLOCATION, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/workingLocation']);
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

  // selectcompany(id: any, flag: any) {
  //   this.allbranch = [];
  //   this.selectedBranch = '';
  //   if (id) {
  //     this.spinner.start('branch');
  //     this.api
  //       .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
  //       .subscribe((res: any) => {
  //         this.allbranch = res;
  //         this.spinner.stop('branch');
  //       });

  //     const body = {
  //       page: '',
  //       limit: '',
  //       company_id: id,
  //     };
  //   }
  // }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
