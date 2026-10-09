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
    selector: 'app-edit-customer',
    templateUrl: './edit-customer.component.html',
    styleUrls: ['./edit-customer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditCustomerComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  companytype: any = [];
  ctype: any;
  companydata: any;
  countryid: any;
  stateid: any;
  cityid: any;
  usertype: any;
  company_id: any;
  allcomp: any;
  childcompany: string;
  comp: any;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getallcountry();
    this.getIPAddress();
    this.editdata();
    this.getcompany();
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
          this.comp = res.data;
          this.spinner.stop();
        }
      },(err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
      });
  }

  editdata() {
    let companyid = this.formValue.ViewCustomerComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCUSTOMER + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          this.countryid = this.companydata.cityMaster.stateMaster.countryMaster.countryMasterID;
          this.selectcountry(this.countryid);
          this.stateid = this.companydata.cityMaster.stateMasterID;
          this.selectstate(this.stateid);
          this.cityid = this.companydata.cityMaster.cityMasterID;
          this.spinner.stop();
          // this.selectcity(this.stateid)
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.country = res.data;
        }
      },(err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
      });
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    const body = {
      customerID: this.formValue.ViewCustomerComponent.id,
      companyMasterID: localStorage.getItem('company_id'),
      customerName: this.addcomp.value.customerName,
      companyName: this.addcomp.value.companyName,
      currentLocation: this.addcomp.value.currentLocation,
      cityMasterID: this.finalcityid,
      latitude: this.addcomp.value.latitude ? this.addcomp.value.latitude : null,
      longitude: this.addcomp.value.longitude ? this.addcomp.value.longitude : null,
      mobileNumber1: this.addcomp.value.mobileNumber1,
      mobileNumber2: this.addcomp.value.mobileNumber2,
      email: this.addcomp.value.email,
      website: this.addcomp.value.website,
      address: this.addcomp.value.address,
      zipcode: this.addcomp.value.zipcode,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    if (this.childcompany == 'false') {
      this.company_id = this.addcomp.value.company;
    } else {
      this.company_id = localStorage.getItem('company_id');
    }

    this.spinner.start();
    this.api.callApi(this.constant.UPDATECUSTOMER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/customer']);
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }
  selectcountry(country: any) {
    this.stateid = [];
    this.cityid = [];

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
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }
  selectstate(state: any) {
    this.cityid = [];
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
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }
  selectcity(city: any) {
    this.finalcityid = city;
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
