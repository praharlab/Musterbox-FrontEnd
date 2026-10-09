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
    selector: 'app-edit-contractor',
    templateUrl: './edit-contractor.component.html',
    styleUrls: ['./edit-contractor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditContractorComponent implements OnInit {
  @ViewChild('Editdata') Editdata: NgForm;

  adminRoot = environment.adminRoot;
  ipAddress: any;
  buttonState = '';
  buttonDisabled: Boolean = false;
  formValue: any;
  constrctordata: any;
  company_id: any;
  company: any = [];
  editData: any = [];
  finalcityid: any;
  countryid: any;
  state: any = [];
  city: any[];
  stateid: any;
  cityid: any;
  branchdata: any;
  country: any;
  allcomp: any;
  usertype: any;
  bankdata: any;
  bankMasterID: number;
  bankIfscCodeLabel: string = labelUtils.bankIfscCodeLabel;

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
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.getIPAddress();
    this.getEditData();
    this.getcompany();
    this.getallcountry();
    this.getBankData();

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



  onSubmit() {
    if (!this.Editdata.valid) {
      return;
    }

    const body = {
      companyMasterID: +this.Editdata.value.company,
      contractorName: this.Editdata.value.contractorName,
      shortName: this.Editdata.value.shortName,
      contractorCode: this.Editdata.value.contractorCode,
      contactPersonName: this.Editdata.value.contactPersonName,
      contactNo: this.Editdata.value.contactNo,
      dateofIncorporation: this.Editdata.value.dateofIncorporation,
      email: this.Editdata.value.email,
      cityMasterID: this.finalcityid ? +this.finalcityid : +this.cityid,
      website: this.Editdata.value.website ? this.Editdata.value.website : null,
      registrationNo: this.Editdata.value.aboutContractor ? this.Editdata.value.aboutContractor : null,
      aboutContractor: this.Editdata.value.aboutorg ? this.Editdata.value.aboutorg : null,
      bankAccountNo: this.Editdata.value.bankAccountNo ? this.Editdata.value.bankAccountNo : null,
      bankIFSC: this.Editdata.value.bankIFSC ? this.Editdata.value.bankIFSC : null,
      bankMasterID: this.Editdata.value.bankMasterID ? this.Editdata.value.bankMasterID : null,
      gstNumber: this.Editdata.value.gstNumber ? this.Editdata.value.gstNumber : null,
      pancard: this.Editdata.value.pancard ? this.Editdata.value.pancard : null,
      contractorAddress: this.Editdata.value.contractorAddress ? this.Editdata.value.contractorAddress : null,
      updateByIp: this.ipAddress,
    };

    if (!body.cityMasterID) {
      this.countryid(() => this.onSubmit());
      return;
    }

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.EDITDATA + this.formValue.ListContractorComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
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

            }, 3000);
          } else {
            this.handleError(res.message);
            this.buttonDisabled = false;
            this.buttonState = '';
          }
          this.spinner.stop('start');

        },
        (err) => {
          this.buttonDisabled = false;
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
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

  getEditData() {
    const id = this.formValue.ListContractorComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.GETIDDATA + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.constrctordata = res.data;

          this.countryid = +this.constrctordata['cityMaster.stateMaster.countryMasterID'];
          this.selectcountry(+this.countryid);

          this.selectstate(+this.constrctordata['cityMaster.stateMaster.stateMasterID']);

          this.stateid = +this.constrctordata['cityMaster.stateMaster.stateMasterID'];
          this.cityid = +this.constrctordata['cityMaster.cityMasterID'];

          this.bankMasterID = +this.constrctordata['bankMaster.bankMasterID'];

          this.spinner.stop('start');
        },
        (err) => {
          this.spinner.stop('start');
          this.handleError(err.error.message);
        },
      );
  }

  getcompany() {

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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

}
