import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-view-late-early-policy',
    templateUrl: './view-late-early-policy.component.html',
    styleUrls: ['./view-late-early-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewLateEarlyPolicyComponent implements OnInit {
  lateEarlyPolicyMasterID: any;
  PolicyData: any;
  onlylatecoming: boolean;
  onlyearlygoing: boolean;
  policyType: any;
  setOnComp_Working_Hours: boolean;


  allCompanyData: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  combinedLabelName: string = 'combined'
  seperatedLabelName: string = 'seperated'
  noLcEgPolicyLabelName: string = 'noLcEgPolicy'
  lateTypeName: string = 'late'
  earlyTypeName: string = 'early'
  countwiseLabelName: string = 'countwise'
  slotwiseLabelName: string = 'slotwise'
  minutewiseLabelName: string = 'minutewise'
  fixAmountLabel: string = 'fixamount'
  perminuteLabelName: string = 'perminute'
  percentLabelName: string = 'percent'
  minLabelName: string = 'min'
  dayLabelName: string = 'day'
  salaryLabelName: string = 'salary'
  attendanceLabelName: string = 'attendance'
  daywiseLabelName: string = 'daywise'
  monthwiseLabelName: string = 'monthwise'
  minuteLabelName: string = 'minute'

  @Input()
  set getLateEarlyPolicyID(getLateEarlyPolicyID: any) {
    this.lateEarlyPolicyMasterID = getLateEarlyPolicyID;
  }

  @ViewChild('editattendancepolicy') editlateearlypolicy: NgForm;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
    if (this.lateEarlyPolicyMasterID) {
      this.editdata();
      this.getcompany();
    }
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allCompanyData = res.data;
          this.spinner.stop('company');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }
  

  editdata() {
    this.spinner.start('getData');
    this.api
      .callApi(
        this.constant.GETBYIDEARLYPOLICY + this.lateEarlyPolicyMasterID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.PolicyData = res.data;
          if (this.PolicyData.lateEarlyPolicyType == this.seperatedLabelName) {
            if (this.PolicyData.latedeductionfrom) this.onlylatecoming = true;
            if (this.PolicyData.earlydeductionfrom) this.onlyearlygoing = true;
          }
          this.spinner.stop('getData');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('getData');
        },
      );
  }
  

  
  onSubmit() { 
    if (!this.editlateearlypolicy.valid) {
      return;
    }

    if (
      this.PolicyData.lateEarlyPolicyType == this.seperatedLabelName &&
      !this.onlyearlygoing &&
      !this.onlylatecoming
    ) {
      return this.commonNotificationService.handleWarning('Please select atleast one type')
    }



    let body = {
      lateEarlyPolicyMasterID: this.formValue.ListLateEarlyPolicyComponent.id,
      companyMasterID: this.editlateearlypolicy.value.company,
      lateEarlyPolicyName: this.editlateearlypolicy.value.lateEarlyPolicyName,
      lateEarlyPolicyType: this.PolicyData.lateEarlyPolicyType,
      combineddeductionfrom: null,
      combineddeductioncycle: null,
      combineddeductioncategory: null,
      combinednoof: null,
      combinedmaxminute: null,
      combineddeductiontype: null,
      combinedvalue: null,
      graceInTime: null,
      latedeductionfrom: null,
      latedeductioncycle: null,
      latedeductioncategory: null,
      latenoof: null,
      latemaxminute: null,
      latedeductiontype: null,
      latevalue: null,
      earlydeductionfrom: null,
      earlydeductioncycle: null,
      earlydeductioncategory: null,
      earlynoof: null,
      earlymaxminute: null,
      earlydeductiontype: null,
      earlyvalue: null,
      earlyRecurring: false,
      lateRecurring: false,
      combinedRecurring: false,
      onWorkingHours: this.editlateearlypolicy.value.onWorkingHours,
      combinedSlab1: this.PolicyData.combinedSlab1,
      combinedSlab2: this.PolicyData.combinedSlab2,
      combineddeductionfrom1: null,
      combineddeductionfrom2: null,
      combineddeductiontype1: null,
      combineddeductiontype2: null,
      combinedvalue1: null,
      combinedvalue2: null,
      combinedmaxminute1: null,
      combinedmaxminute2: null,
      lateComeSlab1: this.PolicyData.lateComeSlab1,
      lateComeSlab2: this.PolicyData.lateComeSlab2,
      latedeductionfrom1: null,
      latedeductionfrom2: null,
      latedeductiontype1: null,
      latedeductiontype2: null,
      latevalue1: null,
      latevalue2: null,
      latemaxminute1: null,
      latemaxminute2: null,

      earlyGoSlab1: false,
      earlyGoSlab2: false,
      earlydeductionfrom1: null,
      earlydeductionfrom2: null,
      earlydeductiontype1: null,
      earlydeductiontype2: null,
      earlyvalue1: null,
      earlyvalue2: null,
      earlymaxminute1: null,
      earlymaxminute2: null,
    };

    // let body:any;
    if (this.PolicyData.lateEarlyPolicyType == this.combinedLabelName) {
      if (
        Number(this.editlateearlypolicy.value.combinednoof) < 0 ||
        Number(this.editlateearlypolicy.value.combinedmaxminute) < 0 ||
        Number(this.editlateearlypolicy.value.combinedvalue) < 0
      ) {
        return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
      }

      if (this.editlateearlypolicy.value.combineddeductioncategory == this.minutewiseLabelName)
        this.editlateearlypolicy.value.combinedmaxminute = null;
      body.combinedmaxminute = this.editlateearlypolicy.value.combinedmaxminute;
      body.combineddeductionfrom = this.editlateearlypolicy.value.combineddeductionfrom
        ? this.editlateearlypolicy.value.combineddeductionfrom
        : this.salaryLabelName;


      body.combineddeductioncycle = this.editlateearlypolicy.value.combineddeductioncycle
        ? this.editlateearlypolicy.value.combineddeductioncycle
        : this.daywiseLabelName;

      body.combineddeductioncategory = this.editlateearlypolicy.value.combineddeductioncategory;

      body.combinednoof = this.editlateearlypolicy.value.combinednoof;

      body.combineddeductiontype = this.editlateearlypolicy.value.combineddeductiontype;



      body.combinedvalue = this.editlateearlypolicy.value.combinedvalue;

      body.graceInTime = this.editlateearlypolicy.value.graceInCombined;

      body.combinedRecurring = this.PolicyData.combinedRecurring;

      if (this.PolicyData.combinedSlab1) {
        body.combineddeductionfrom1 = this.editlateearlypolicy.value.combineddeductionfrom1
          ? this.editlateearlypolicy.value.combineddeductionfrom1
          : this.salaryLabelName;
        body.combineddeductiontype1 = this.editlateearlypolicy.value.combineddeductiontype1;
        body.combinedvalue1 = this.editlateearlypolicy.value.combinedvalue1;
        body.combinedmaxminute1 = this.editlateearlypolicy.value.combinedmaxminute1;
        if (
          (body.combinedvalue1 && Number(body.combinedvalue1) < 0) ||
          (body.combinedmaxminute1 && Number(body.combinedmaxminute1) < 0)
        ) {
          return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
        }
      }

      if (this.PolicyData.combinedSlab2) {
        body.combineddeductionfrom2 = this.editlateearlypolicy.value.combineddeductionfrom2
          ? this.editlateearlypolicy.value.combineddeductionfrom2
          : this.salaryLabelName;
        body.combineddeductiontype2 = this.editlateearlypolicy.value.combineddeductiontype2;
        body.combinedvalue2 = this.editlateearlypolicy.value.combinedvalue2;
        body.combinedmaxminute2 = this.editlateearlypolicy.value.combinedmaxminute2;
        if (
          (body.combinedvalue2 && Number(body.combinedvalue2) < 0) ||
          (body.combinedmaxminute2 && Number(body.combinedmaxminute2) < 0)
        ) {
          return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
        }
      }
    } else if (this.PolicyData.lateEarlyPolicyType == this.seperatedLabelName) {
      // Seperate Late
      if (this.editlateearlypolicy.value.deductioncategorylate == this.minutewiseLabelName)
        this.editlateearlypolicy.value.latemaxminute = null;

      body.latemaxminute = this.editlateearlypolicy.value.latemaxminute;

      body.latedeductionfrom = this.editlateearlypolicy.value.deductioncategorylate
        ? this.editlateearlypolicy.value.latedeductionfrom
          ? this.editlateearlypolicy.value.latedeductionfrom
          : this.salaryLabelName
        : null;

      body.latedeductioncycle = this.editlateearlypolicy.value.deductioncategorylate
        ? this.editlateearlypolicy.value.latedeductioncycle
          ? this.editlateearlypolicy.value.latedeductioncycle
          : this.daywiseLabelName
        : null;

      body.latedeductioncategory = this.editlateearlypolicy.value.deductioncategorylate;

      body.latenoof = this.editlateearlypolicy.value.latenoof;

      body.latedeductiontype = this.editlateearlypolicy.value.latedeductiontype;

      body.latevalue = this.editlateearlypolicy.value.lateValue;
      body.graceInTime = this.editlateearlypolicy.value.graceInTime;
      body.lateRecurring = this.PolicyData.lateRecurring;
      if (this.PolicyData.lateComeSlab1) {
        body.latedeductionfrom1 = this.editlateearlypolicy.value.latedeductionfrom1
          ? this.editlateearlypolicy.value.latedeductionfrom1
          : this.salaryLabelName;
        body.latedeductiontype1 = this.editlateearlypolicy.value.latedeductiontype1;
        body.latevalue1 = this.editlateearlypolicy.value.latevalue1;
        body.latemaxminute1 = this.editlateearlypolicy.value.latemaxminute1;
        if (
          (body.latevalue1 && Number(body.latevalue1) < 0) ||
          (body.latemaxminute1 && Number(body.latemaxminute1) < 0)
        ) {
          return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
        }
      }

      if (this.PolicyData.lateComeSlab2) {
        body.latedeductionfrom2 = this.editlateearlypolicy.value.latedeductionfrom2
          ? this.editlateearlypolicy.value.latedeductionfrom2
          : this.salaryLabelName;
        body.latedeductiontype2 = this.editlateearlypolicy.value.latedeductiontype2;
        body.latevalue2 = this.editlateearlypolicy.value.latevalue2;
        body.latemaxminute2 = this.editlateearlypolicy.value.latemaxminute2;
        if (
          (body.latevalue2 && Number(body.latevalue2) < 0) ||
          (body.latemaxminute2 && Number(body.latemaxminute2) < 0)
        ) {
          return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
        }
      }
      // Seperate Early
      if (this.editlateearlypolicy.value.deductioncategoryearly == this.minutewiseLabelName)
        this.editlateearlypolicy.value.earlymaxminute = null;

      body.earlydeductionfrom = this.editlateearlypolicy.value.deductioncategoryearly
        ? this.editlateearlypolicy.value.earlydeductionfrom
          ? this.editlateearlypolicy.value.earlydeductionfrom
          : this.salaryLabelName
        : null;

      body.earlydeductioncycle = this.editlateearlypolicy.value.deductioncategoryearly
        ? this.editlateearlypolicy.value.earlydeductioncycle
          ? this.editlateearlypolicy.value.earlydeductioncycle
          : this.daywiseLabelName
        : null;

      body.earlydeductioncategory = this.editlateearlypolicy.value.deductioncategoryearly;

      body.earlynoof = this.editlateearlypolicy.value.earlycountNo;

      body.earlymaxminute = this.editlateearlypolicy.value.earlymaxminute;

      body.earlydeductiontype = this.editlateearlypolicy.value.deductiontypeearly;

      body.earlyvalue = this.editlateearlypolicy.value.earlyValue;
      body.earlyRecurring = this.PolicyData.earlyRecurring;

      if (this.PolicyData.earlyGoSlab1) {
        body.earlydeductionfrom1 = this.editlateearlypolicy.value.earlydeductionfrom1
          ? this.editlateearlypolicy.value.earlydeductionfrom1
          : this.salaryLabelName;
        body.earlydeductiontype1 = this.editlateearlypolicy.value.earlydeductiontype1;
        body.earlyvalue1 = this.editlateearlypolicy.value.earlyvalue1;
        body.earlymaxminute1 = this.editlateearlypolicy.value.earlymaxminute1;
        if (
          (body.earlyvalue1 && Number(body.earlyvalue1) < 0) ||
          (body.earlymaxminute1 && Number(body.earlymaxminute1) < 0)
        ) {
          return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
        }
      }

      if (this.PolicyData.earlyGoSlab2) {
        body.earlydeductionfrom2 = this.editlateearlypolicy.value.earlydeductionfrom2
          ? this.editlateearlypolicy.value.earlydeductionfrom2
          : this.salaryLabelName;
        body.earlydeductiontype2 = this.editlateearlypolicy.value.earlydeductiontype2;
        body.earlyvalue2 = this.editlateearlypolicy.value.earlyvalue2;
        body.earlymaxminute2 = this.editlateearlypolicy.value.earlymaxminute2;
        if (
          (body.earlyvalue2 && Number(body.earlyvalue2) < 0) ||
          (body.earlymaxminute2 && Number(body.earlymaxminute2) < 0)
        ) {
          return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
        }
      }

      if (
        (body.latenoof && Number(body.latenoof) < 0) ||
        (body.latemaxminute && Number(body.latemaxminute) < 0) ||
        (body.latevalue && Number(body.latevalue) < 0) ||
        (body.graceInTime && +body.graceInTime < 0)
      ) {
        return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
      }

      if (
        (body.earlynoof && Number(body.earlynoof) < 0) ||
        (body.earlymaxminute && Number(body.earlymaxminute) < 0) ||
        (body.earlyvalue && Number(body.earlyvalue) < 0)
      ) {
        return this.commonNotificationService.handleWarning('Oops! Please make sure to enter a positive value')
      }
    }


    this.spinner.start('submit');
    this.api.callApi(this.constant.UPDATEEARLYPOLICY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/lateComeEarlyGo']);
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
      },
    );
  }

  setRecurring(event, type) {
    if (type == this.combinedLabelName) this.PolicyData.combinedRecurring = event;
    if (type == this.lateTypeName) this.PolicyData.lateRecurring = event;
    if (type == this.earlyTypeName) this.PolicyData.earlyRecurring = event;
  }

  setPolicyType(event: any) {
    this.PolicyData.earlyRecurring = false;
    this.PolicyData.lateRecurring = false;
    this.PolicyData.combinedRecurring = false;

    this.PolicyData.latedeductionfrom = null;
    this.PolicyData.latedeductioncycle = null;
    this.PolicyData.latedeductioncategory = null;
    this.PolicyData.latenoof = null;
    this.PolicyData.latemaxminute = null;
    this.PolicyData.latedeductiontype = null;
    this.PolicyData.latevalue = null;
    this.PolicyData.lateComeSlab1 = false;
    this.PolicyData.lateComeSlab2 = false;
    this.PolicyData.latedeductionfrom1 = null;
    this.PolicyData.latedeductionfrom2 = null;
    this.PolicyData.latedeductiontype1 = null;
    this.PolicyData.latedeductiontype2 = null;
    this.PolicyData.latevalue1 = null;
    this.PolicyData.latevalue2 = null;
    this.PolicyData.latemaxminute1 = null;
    this.PolicyData.latemaxminute2 = null;

    this.PolicyData.earlydeductionfrom = null;
    this.PolicyData.earlydeductioncycle = null;
    this.PolicyData.earlydeductioncategory = null;
    this.PolicyData.earlynoof = null;
    this.PolicyData.earlymaxminute = null;
    this.PolicyData.earlydeductiontype = null;
    this.PolicyData.earlyvalue = null;
    this.PolicyData.combinedSlab1 = false;
    this.PolicyData.combinedSlab2 = false;
    this.PolicyData.combineddeductionfrom1 = null;
    this.PolicyData.combineddeductionfrom2 = null;
    this.PolicyData.combineddeductiontype1 = null;
    this.PolicyData.combineddeductiontype2 = null;
    this.PolicyData.combinedvalue1 = null;
    this.PolicyData.combinedvalue2 = null;
    this.PolicyData.combinedmaxminute1 = null;
    this.PolicyData.combinedmaxminute2 = null;


    this.PolicyData.combinedSlab1 = false;
    this.PolicyData.combinedSlab2 = false;
    this.PolicyData.combineddeductionfrom1 = null;
    this.PolicyData.combineddeductionfrom2 = null;
    this.PolicyData.combineddeductiontype1 = null;
    this.PolicyData.combineddeductiontype2 = null;
    this.PolicyData.combinedvalue1 = null;
    this.PolicyData.combinedvalue2 = null;
    this.PolicyData.combinedmaxminute1 = null;
    this.PolicyData.combinedmaxminute2 = null;

    if (event) {
      this.PolicyData.lateEarlyPolicyType = event;
      if (event == this.seperatedLabelName || event == this.noLcEgPolicyLabelName) {
        this.onlylatecoming = false;
        this.onlyearlygoing = false;
      }
    } else {
      this.PolicyData.lateEarlyPolicyType = null;
    }
  }

  setonlyLatecoming(event: any) {
    this.PolicyData.combinedSlab1 = false;
    this.PolicyData.combinedSlab2 = false;
    this.PolicyData.combineddeductionfrom1 = null;
    this.PolicyData.combineddeductionfrom2 = null;
    this.PolicyData.combineddeductiontype1 = null;
    this.PolicyData.combineddeductiontype2 = null;
    this.PolicyData.combinedvalue1 = null;
    this.PolicyData.combinedvalue2 = null;
    this.PolicyData.combinedmaxminute1 = null;
    this.PolicyData.combinedmaxminute2 = null;

    this.PolicyData.latedeductionfrom = null;
    this.PolicyData.latedeductioncycle = null;
    this.PolicyData.latedeductioncategory = null;
    this.PolicyData.latenoof = null;
    this.PolicyData.latemaxminute = null;
    this.PolicyData.latedeductiontype = null;
    this.PolicyData.latevalue = null;
    this.PolicyData.lateComeSlab1 = false;
    this.PolicyData.lateComeSlab2 = false;
    this.PolicyData.latedeductionfrom1 = null;
    this.PolicyData.latedeductionfrom2 = null;
    this.PolicyData.latedeductiontype1 = null;
    this.PolicyData.latedeductiontype2 = null;
    this.PolicyData.latevalue1 = null;
    this.PolicyData.latevalue2 = null;
    this.PolicyData.latemaxminute1 = null;
    this.PolicyData.latemaxminute2 = null;

    this.PolicyData.lateRecurring = false;
    this.PolicyData.combinedRecurring = false;

    if (event) this.onlylatecoming = true;
    else this.onlylatecoming = false;
  }

  setonlyEarlygoing(event: any) {
    this.PolicyData.combinedSlab1 = false;
    this.PolicyData.combinedSlab2 = false;
    this.PolicyData.combineddeductionfrom1 = null;
    this.PolicyData.combineddeductionfrom2 = null;
    this.PolicyData.combineddeductiontype1 = null;
    this.PolicyData.combineddeductiontype2 = null;
    this.PolicyData.combinedvalue1 = null;
    this.PolicyData.combinedvalue2 = null;
    this.PolicyData.combinedmaxminute1 = null;
    this.PolicyData.combinedmaxminute2 = null;

    this.PolicyData.earlydeductionfrom = null;
    this.PolicyData.earlydeductioncycle = null;
    this.PolicyData.earlydeductioncategory = null;
    this.PolicyData.earlynoof = null;
    this.PolicyData.earlymaxminute = null;
    this.PolicyData.earlydeductiontype = null;
    this.PolicyData.earlyvalue = null;
    this.PolicyData.earlyGoSlab1 = false;
    this.PolicyData.earlyGoSlab2 = false;
    this.PolicyData.earlydeductionfrom1 = null;
    this.PolicyData.earlydeductionfrom2 = null;
    this.PolicyData.earlydeductiontype1 = null;
    this.PolicyData.earlydeductiontype2 = null;
    this.PolicyData.earlyvalue1 = null;
    this.PolicyData.earlyvalue2 = null;
    this.PolicyData.earlymaxminute1 = null;
    this.PolicyData.earlymaxminute2 = null;

    this.PolicyData.earlyRecurring = false;
    this.PolicyData.combinedRecurring = false;

    if (event) this.onlyearlygoing = true;
    else this.onlyearlygoing = false;
  }

  changecombined() {
    this.PolicyData.combineddeductiontype = null
    this.PolicyData.combinedvalue = null
    this.PolicyData.combinedRecurring = false;
    if (!this.PolicyData.combineddeductioncategory || this.PolicyData.combineddeductioncategory != this.countwiseLabelName) {
      this.PolicyData.combinedSlab1 = false;
      this.PolicyData.combinedSlab2 = false;
      this.PolicyData.combineddeductionfrom1 = null;
      this.PolicyData.combineddeductionfrom2 = null;
      this.PolicyData.combineddeductiontype1 = null;
      this.PolicyData.combineddeductiontype2 = null;
      this.PolicyData.combinedvalue1 = null;
      this.PolicyData.combinedvalue2 = null;
      this.PolicyData.combinedmaxminute1 = null;
      this.PolicyData.combinedmaxminute2 = null;
    }
  }

  changecombined1() {
    this.PolicyData.combineddeductiontype1 = null
    this.PolicyData.combinedvalue1 = null;
    this.PolicyData.combinedRecurring = false;
  }

  changecombined2() {
    this.PolicyData.combineddeductiontype2 = null
    this.PolicyData.combinedvalue2 = null;
    this.PolicyData.combinedRecurring = false;
  }

  changeSeperateLateCome() {
    this.PolicyData.latedeductiontype = null
    this.PolicyData.lateRecurring = false;
  }

  changeSeperateLateCome1() {
    this.PolicyData.latedeductiontype1 = null
    this.PolicyData.lateRecurring = false;
  }

  changeSeperateLateCome2() {
    this.PolicyData.latedeductiontype2 = null
    this.PolicyData.lateRecurring = false;
  }

  changeSeperateEarlyGo() {
    this.PolicyData.earlydeductiontype = null
    this.PolicyData.earlyRecurring = false;
  }

  changeSeperateEarlyGo1() {
    this.PolicyData.earlydeductiontype1 = null
    this.PolicyData.earlyRecurring = false;
  }

  changeSeperateEarlyGo2() {
    this.PolicyData.earlydeductiontype2 = null
    this.PolicyData.earlyRecurring = false;
  }


  selectDeductionType(event, type) {
    if (type == this.combinedLabelName) this.PolicyData.combinedvalue = null;
    if (type == this.lateTypeName) this.PolicyData.latevalue = null;
    if (type == this.earlyTypeName) this.PolicyData.earlyvalue = null;
  }

  selectDeductionType1(event, type) {
    if (type == this.combinedLabelName) this.PolicyData.combinedvalue1 = null;
    if (type == this.lateTypeName) this.PolicyData.latevalue1 = null;
    if (type == this.earlyTypeName) this.PolicyData.earlyvalue1 = null;
  }

  selectDeductionType2(event, type) {
    if (type == this.combinedLabelName) this.PolicyData.combinedvalue2 = null;
    if (type == this.lateTypeName) this.PolicyData.latevalue2 = null;
    if (type == this.earlyTypeName) this.PolicyData.earlyvalue2 = null;
  }

  addCombineSlab() {
    if (this.PolicyData.combinedSlab1) {
      this.PolicyData.combinedSlab2 = true
    } else {
      this.PolicyData.combinedSlab1 = true
    }
  }

  addLateComeSlab() {
    if (this.PolicyData.lateComeSlab1) {
      this.PolicyData.lateComeSlab2 = true
    } else {
      this.PolicyData.lateComeSlab1 = true
    }
  }

  addEarlyGoSlab() {
    if (this.PolicyData.earlyGoSlab1) {
      this.PolicyData.earlyGoSlab2 = true
    } else {
      this.PolicyData.earlyGoSlab1 = true
    }
  }

  removeCombineSlabRow(slot) {
    if (slot == 1) {
      if (this.PolicyData.combinedSlab2) {
        this.PolicyData.combinedSlab1 = true;
        this.PolicyData.combinedSlab2 = false;
        this.PolicyData.combineddeductionfrom1 = this.PolicyData.combineddeductionfrom2;
        this.PolicyData.combineddeductionfrom2 = null;
        this.PolicyData.combineddeductiontype1 = this.PolicyData.combineddeductiontype2;
        this.PolicyData.combineddeductiontype2 = null;
        this.PolicyData.combinedvalue1 = this.PolicyData.combinedvalue2;
        this.PolicyData.combinedvalue2 = null;
        this.PolicyData.combinedmaxminute1 = this.PolicyData.combinedmaxminute2;
        this.PolicyData.combinedmaxminute2 = null;
      } else {
        this.PolicyData.combinedSlab1 = false;
        this.PolicyData.combinedSlab2 = false;
        this.PolicyData.combineddeductionfrom1 = null;
        this.PolicyData.combineddeductionfrom2 = null;
        this.PolicyData.combineddeductiontype1 = null;
        this.PolicyData.combineddeductiontype2 = null;
        this.PolicyData.combinedvalue1 = null;
        this.PolicyData.combinedvalue2 = null;
        this.PolicyData.combinedmaxminute1 = null;
        this.PolicyData.combinedmaxminute2 = null;
      }
    } else {
      this.PolicyData.combinedSlab2 = false;
      this.PolicyData.combineddeductionfrom2 = null;
      this.PolicyData.combineddeductiontype2 = null;
      this.PolicyData.combinedvalue2 = null;
      this.PolicyData.combinedmaxminute2 = null;
    }
  }

  removeLateComeSlabRow(slot) {
    if (slot == 1) {
      if (this.PolicyData.lateComeSlab2) {
        this.PolicyData.lateComeSlab1 = true;
        this.PolicyData.lateComeSlab2 = false;
        this.PolicyData.latedeductionfrom1 = this.PolicyData.latedeductionfrom2;
        this.PolicyData.latedeductionfrom2 = null;
        this.PolicyData.latedeductiontype1 = this.PolicyData.latedeductiontype2;
        this.PolicyData.latedeductiontype2 = null;
        this.PolicyData.latevalue1 = this.PolicyData.latevalue2;
        this.PolicyData.latevalue2 = null;
        this.PolicyData.latemaxminute1 = this.PolicyData.latemaxminute2;
        this.PolicyData.latemaxminute2 = null;
      } else {
        this.PolicyData.lateComeSlab1 = false;
        this.PolicyData.lateComeSlab2 = false;
        this.PolicyData.latedeductionfrom1 = null;
        this.PolicyData.latedeductionfrom2 = null;
        this.PolicyData.latedeductiontype1 = null;
        this.PolicyData.latedeductiontype2 = null;
        this.PolicyData.latevalue1 = null;
        this.PolicyData.latevalue2 = null;
        this.PolicyData.latemaxminute1 = null;
        this.PolicyData.latemaxminute2 = null;
      }
    } else {
      this.PolicyData.lateComeSlab2 = false;
      this.PolicyData.latedeductionfrom2 = null;
      this.PolicyData.latedeductiontype2 = null;
      this.PolicyData.latevalue2 = null;
      this.PolicyData.latemaxminute2 = null;
    }
  }

  removeEarlyGoSlabRow(slot: Number) {
    if (slot == 1) {
      if (this.PolicyData.earlyGoSlab2) {
        this.PolicyData.earlyGoSlab1 = true;
        this.PolicyData.earlyGoSlab2 = false;
        this.PolicyData.earlydeductionfrom1 = this.PolicyData.earlydeductionfrom2;
        this.PolicyData.earlydeductionfrom2 = null;
        this.PolicyData.earlydeductiontype1 = this.PolicyData.earlydeductiontype2;
        this.PolicyData.earlydeductiontype2 = null;
        this.PolicyData.earlyvalue1 = this.PolicyData.earlyvalue2;
        this.PolicyData.earlyvalue2 = null;
        this.PolicyData.earlymaxminute1 = this.PolicyData.earlymaxminute2;
        this.PolicyData.earlymaxminute2 = null;
      } else {
        this.PolicyData.earlyGoSlab1 = false;
        this.PolicyData.earlyGoSlab2 = false;
        this.PolicyData.earlydeductionfrom1 = null;
        this.PolicyData.earlydeductionfrom2 = null;
        this.PolicyData.earlydeductiontype1 = null;
        this.PolicyData.earlydeductiontype2 = null;
        this.PolicyData.earlyvalue1 = null;
        this.PolicyData.earlyvalue2 = null;
        this.PolicyData.earlymaxminute1 = null;
        this.PolicyData.earlymaxminute2 = null;
      }
    } else {
      this.PolicyData.earlyGoSlab2 = false;
      this.PolicyData.earlydeductionfrom2 = null;
      this.PolicyData.earlydeductiontype2 = null;
      this.PolicyData.earlyvalue2 = null;
      this.PolicyData.earlymaxminute2 = null;
    }
  }
}
