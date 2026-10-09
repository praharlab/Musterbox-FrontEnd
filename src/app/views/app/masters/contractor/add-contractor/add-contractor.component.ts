import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { labelUtils } from '../../../../../constants/labelUtils';


@Component({
    selector: 'app-add-contractor',
    templateUrl: './add-contractor.component.html',
    styleUrls: ['./add-contractor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddContractorComponent implements OnInit {
  @ViewChild('adddata') adddata: NgForm;

  ipAddress: any;
  adminRoot = environment.adminRoot;
  buttonState = '';
  buttonDisabled: false;
  finalcityid: any;
  city: any;
  selectedcity: any;
  state: any;
  country: any;
  selectedstate: string;
  companyMasterID: string;
  company_id: any;
  company: any = [];
  comp: any;
  bankdata: any;
  bankIfscCodeLabel: string = labelUtils.bankIfscCodeLabel;

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.companyMasterID = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getallcountry();
    this.getcompany();
    this.getBankData();
  }


  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };

    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getBankData() {
    this.spinner.start();
    let filter = { page: '', limit: '' };
    this.api.callApi(this.constant.GETBANKDATA, filter, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.bankdata = res.data;
        this.spinner.stop();
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
    this.selectedcity = '';
    this.city = [];

    if (state) {
      this.api
        .callApi(this.constant.GETCITYBYSTATE + state.stateMasterID, {}, 'GET', false, false, false)
        .subscribe(
          (res: any) => {
            this.city = res.data;
          },
          (err) => {
            this.handleError(err.error.message);
          },
        );
    }
  }

  selectcity(city: any) {
    this.finalcityid = city.cityMasterID;
  }

  selectcountry(country: any) {
    this.selectedstate = '';
    this.selectedcity = '';
    this.city = [];
    this.state = [];

    if (!country) return

    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country.countryMasterID, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );

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
    if (!this.adddata.valid) {
      return;
    }
    this.spinner.start('start');
    const cityID = this.adddata.value.city1.cityMasterID
    const countryName = this.adddata.value.country1.countryName
    const stateName = this.adddata.value.state1.stateName
    const cityName = this.adddata.value.city1.cityName
    let body = {
      companyMasterID: +this.adddata.value.company,
      contractorName: this.adddata.value.OrgName,
      shortName: this.adddata.value.short,
      contractorCode: this.adddata.value.orgcode,
      contactPersonName: this.adddata.value.cpn,
      contactNo: this.adddata.value.cno,
      dateofIncorporation: this.adddata.value.doi,
      email: this.adddata.value.email,
      cityMasterID: +cityID,
      website: this.adddata.value.website ? this.adddata.value.website : null,
      registrationNo: this.adddata.value.RegistrationNo ? this.adddata.value.RegistrationNo : null,
      aboutContractor: this.adddata.value.aboutorg ? this.adddata.value.aboutorg : null,
      bankAccountNo: this.adddata.value.bankAccountNo ? this.adddata.value.bankAccountNo : null,
      bankIFSC: this.adddata.value.bankIFSC ? this.adddata.value.bankIFSC : null,
      bankMasterID: this.adddata.value.bankMasterID ? this.adddata.value.bankMasterID : null,
      gstNumber: this.adddata.value.gstNumber ? this.adddata.value.gstNumber : null,
      pancard: this.adddata.value.pancard ? this.adddata.value.pancard : null,
      contractorAddress: this.adddata.value.contractorAddress ? this.adddata.value.contractorAddress : null,
      contractorFullAddress: this.adddata.value.contractorAddress ? `${this.adddata.value.contractorAddress} , ${cityName}, ${stateName}, ${countryName}` : `${cityName}, ${stateName}, ${countryName}`,
      createBy: +localStorage.getItem('id'),
    };


    this.api.callApi(this.constant.ADDCONTRACTOR, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/cotractor']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('start');
          }, 3000);
        } else {
          this.handleError(res.message);

          this.spinner.stop('start');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('start');
      },
    );
  }



  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
