import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-working-location',
    templateUrl: './edit-working-location.component.html',
    styleUrls: ['./edit-working-location.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditWorkingLocationComponent implements OnInit {
  @ViewChild('editworkinglocation') editworkinglocation: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;

  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  ipAddress: any;
  company: any;
  item: any;
  workinglocationdata: any;
  countryid: any;
  stateid: any;
  cityid: any;
  usertype: any;
  company_id: any;
  allcomp: any;
  childcompany: any;
  buttonDisabled = false;
  buttonState = '';
  adminRoot = environment.adminRoot;
  // allbranch: any;
  alluser: any;
  selected: any[];
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

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getallcountry();
    this.getIPAddress();
    this.editdata();
    this.getcompany();
    //  this.selectcompany(this.company_id, 0);
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;

          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  editdata() {
    let wID = this.formValue.ListWorkingLocationComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWWORKINGLOCATION + wID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.workinglocationdata = res.data;
          this.countryid = this.workinglocationdata['cityMaster.stateMaster.countryMasterID'];
          this.selectcountry(this.countryid);

          this.selectstate(this.workinglocationdata['cityMaster.stateMasterID']);
          this.stateid = this.workinglocationdata['cityMaster.stateMasterID'];
          this.cityid = this.workinglocationdata['cityMaster.cityMasterID'];
          this.company = this.workinglocationdata.companyTypeid;

          // let temp = this.workinglocationdata.branchMasterID;
          // this.selectcompany(this.workinglocationdata.companyMasterID, 0);
          // this.workinglocationdata.branchMasterID = temp;

          this.spinner.stop();
        },
        (err) => {
          this.handleError(err.error.message);
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
      });
  }

  onSubmit() {
    if (!this.editworkinglocation.valid) {
      return;
    }
    let body = {};

    body = {
      workingLocationID: this.formValue.ListWorkingLocationComponent.id,
      // branchMasterID: this.editworkinglocation.value.branch,
      companyMasterID: this.editworkinglocation.value.company,
      workingLocationName: this.editworkinglocation.value.workingLocationName,
      workingLocationAddress: this.editworkinglocation.value.workingLocationAddress,
      cityMasterID: this.finalcityid,
      latitude: this.editworkinglocation.value.latitude,
      longitude: this.editworkinglocation.value.longitude,
      radius: this.editworkinglocation.value.radius,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEWORKINGLOCATION, body, 'POST', true, true, true).subscribe(
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
    this.city = [];
    this.state = [];
    this.stateid = '';
    this.cityid = '';

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
    this.city = [];
    this.cityid = '';

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
    this.finalcityid = city;
  }

  // selectcompany(id: any, flag: any) {
  //   this.allbranch = [];
  //   this.workinglocationdata.branchMasterID = '';
  //   if (!id) {
  //   } else {
  //     this.spinner.start('wl');
  //     this.api
  //       .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
  //       .subscribe((res: any) => {

  //         this.allbranch = res;
  //         this.spinner.stop('wl');
  //       });
  //   }
  // }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
