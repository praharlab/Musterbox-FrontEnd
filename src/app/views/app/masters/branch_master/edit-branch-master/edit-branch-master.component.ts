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
import { labelUtils } from '../../../../../constants/labelUtils';

@Component({
    selector: 'app-edit-branch-master',
    templateUrl: './edit-branch-master.component.html',
    styleUrls: ['./edit-branch-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditBranchMasterComponent implements OnInit {
  @ViewChild('editbranch') editbranch: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  ipAddress: any;
  company: any;
  branchdata: any;
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
  formValue: any;
  pfNumberlabel = labelUtils.pfNumber;
  esicNumberlabel = labelUtils.esicNumber;

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getallcountry();
    this.getIPAddress();
    this.editdata();
    this.getcompany();
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start('company');
      this.api.callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true).subscribe(
        (res: any) => {
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
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('company');
      this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
        (res: any) => {
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
  }
  editdata() {
    let branchid = this.formValue.ListBranchMasterComponent.id;
    this.spinner.start('edit');
    this.api.callApi(this.constant.VIEWBRANCH + branchid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.branchdata = res.data;
        this.countryid = this.branchdata['cityMaster.stateMaster.countryMaster.countryMasterID'];
        this.selectcountry(this.countryid);

        this.selectstate(this.branchdata['cityMaster.stateMasterID']);
        this.stateid = this.branchdata['cityMaster.stateMasterID'];
        this.cityid = this.branchdata['cityMaster.cityMasterID'];

        this.company = this.branchdata.companyTypeid;
        this.spinner.stop('edit');
      },
      (err) => {
        this.spinner.stop('edit');
        this.handleError(err.error.message);
      },
    );
  }

  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start('country');
    this.api.callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.country = res.data;
          this.spinner.stop('country');
        } else {
          this.handleError(res.message);
          this.spinner.stop('country');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('country');
      },
    );
  }

  onSubmit() {
    if (!this.editbranch.valid) {
      return;
    }
    let body = {};

    body = {
      branchMasterID: this.formValue.ListBranchMasterComponent.id,
      companyMasterID: this.editbranch.value.company,
      branchName: this.editbranch.value.branchName,
      branchCode: this.editbranch.value.branchCode,
      branchAddress: this.editbranch.value.branchAddress,
      cityMasterID: this.finalcityid,
      latitude: this.editbranch.value.latitude,
      longitude: this.editbranch.value.longitude,
      radius: this.editbranch.value.radius,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
      gstNumber: this.editbranch.value.gstNumber,
      lwfNumber: this.editbranch.value.lwfNumber,
      professionaltaxNumber: this.editbranch.value.professionaltaxNumber,
      pfNumber: this.editbranch.value.pfNumber,
      esicNumber: this.editbranch.value.esicNumber,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEBRANCH, body, 'POST', true, true, true).subscribe(
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
          this.handleError(res.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
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
          this.handleError(err.error.message);
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
          this.handleError(err.error.message);
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

  selectcompany(ev: any) {
    this.company = ev;
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
