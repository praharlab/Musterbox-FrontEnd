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
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-ediit-ptmaster',
    templateUrl: './ediit-ptmaster.component.html',
    styleUrls: ['./ediit-ptmaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EdiitPtmasterComponent implements OnInit {
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
  month1: any;
  applicableFromYYYYMM1: any = '';
  adminRoot = environment.adminRoot;
  formValue: any;
  corporation: any[] = [];
  ptCalculationType: any;
  corporationName: any;

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getallcountry();
    this.editdata();
  }

  editdata() {
    let companyid = this.formValue.ListPtmasterComponent.id;
    this.spinner.start('edit');
    this.api.callApi(this.constant.VIEWPT + companyid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.companydata = res.data;
          this.countryid = this.companydata.stateMaster.countryMaster.countryMasterID;
          this.ptCalculationType = this.companydata.ptCalculation;
          this.corporationName = this.companydata.corporation?.corporationName || ''
          this.selectcountry(this.countryid);
          this.stateid = this.companydata.stateMasterID;
          this.cityid = this.stateid;
          this.month1 = String(this.companydata.month);
          if (this.companydata.applicableFromYYYYMM) {
            this.applicableFromYYYYMM1 =
              String(this.companydata.applicableFromYYYYMM).slice(0, 4) +
              '-' +
              String(this.companydata.applicableFromYYYYMM).slice(4, 6);
          }
        } else {
          this.commonNotificationService.handleWarning(res.message);
        }


        this.spinner.stop('edit');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('edit');
      },
    );
  }

  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api.callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.country = res.data;
          this.spinner.stop();
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    const body = {
      professionalTaxID: this.formValue.ListPtmasterComponent.id,
      fromAmount: this.addcomp.value.fromAmount,
      toAmount: this.addcomp.value.toAmount,
      maleTax: this.addcomp.value.maleTax,
      femaleTax: this.addcomp.value.femaleTax,
    };

    this.spinner.start('edit');
    this.api.callApi(this.constant.UPDATEPT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {

          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/ptmaster']);
            this.spinner.stop('edit');
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('edit');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('edit');
      },
    );
  }

  selectcountry(country: any) {
    if (!country) {
      return;
    }
    this.spinner.start();
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
          this.spinner.stop();
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  // selectstate(state: any) {
  //   this.corporation = [];

  //   if (!state) return;

  //   this.spinner.start('corporation');

  //   this.api
  //     .callApi(this.constant.GETCORPORATIONBYSTATEID + state, {}, 'GET', false, false, false)
  //     .subscribe(
  //       (res: any) => {
  //         this.corporation = res.data;
  //         this.spinner.stop('corporation');
  //       },
  //       (err) => {
  //         this.commonNotificationService.handleError(err.error.message);
  //         this.spinner.stop('corporation');
  //       },
  //     );
  // }

}
