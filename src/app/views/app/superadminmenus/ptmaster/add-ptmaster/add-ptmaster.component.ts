import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-add-ptmaster',
    templateUrl: './add-ptmaster.component.html',
    styleUrls: ['./add-ptmaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddPtmasterComponent implements OnInit {
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
  usertype: any;
  company_id: any;
  allcomp: any;
  final_date: string;
  adminRoot = environment.adminRoot;
  corporation: any[] = [];

  months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  ptCalculationType: any;
  selectedMonths: any[] = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getallcountry();
    var date1 = new Date();
    date1.setDate(0);
    this.final_date = date1.getFullYear() + '-' + String(date1.getMonth() + 1).padStart(2, '0');
  }

  selectMonth() {
    if (this.selectedMonths.length > 2) {
      this.selectedMonths = this.selectedMonths.slice(0, 2);
      return this.commonNotificationService.handleWarning('can not select more than two months.');
    }
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

    const obj = {
      fromAmount: this.addcomp.value.fromAmount,
      toAmount: this.addcomp.value.toAmount,
      maleTax: this.addcomp.value.maleTax,
      femaleTax: this.addcomp.value.femaleTax,
      applicableFromYYYYMM: this.addcomp.value.applicableFromYYYYMM.replace('-', ''),
      stateMasterID: this.addcomp.value.state1,
      corporationId: this.addcomp.value.corp || null,
      ptCalculation: this.addcomp.value.ptcalculation,
    };

    const body = [];

    console.log(this.selectedMonths, 'this.selectedMonths');

    if (obj.ptCalculation == 'halfYearly') {
      for (let i = 0; i < this.selectedMonths.length; i++) {
        body.push({
          ...obj,
          month: +this.selectedMonths[i],
        });
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        body.push({
          ...obj,
          month: i,
        });
      }
    }

    this.spinner.start('add');
    this.api.callApi(this.constant.CREATEPT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/ptmaster']);
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('add');
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
  selectstate(state: any) {
    this.corporation = [];

    if (!state) return;

    this.spinner.start('corporation');

    this.api
      .callApi(this.constant.GETCORPORATIONBYSTATEID + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.corporation = res.data;
          this.spinner.stop('corporation');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('corporation');
        },
      );
  }
}
