import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PolicyData } from '../model/policyData'
import { retry } from 'rxjs/operators';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-add-employee-leave-policy',
    templateUrl: './add-employee-leave-policy.component.html',
    styleUrls: ['./add-employee-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeLeavePolicyComponent implements OnInit {


  @ViewChild('addcomp') addcomp: NgForm;
  ipAddress: any;
  comp: any;
  company_id: any;
  childcompany: string;
  company: any;
  leave: any;
  hrleave_id: any;
  selectedOption: any;
  carryForwardData: any;
  carryForwardLimitData: any;
  selectedOption1: any;
  selectedOption2: any;
  selectedOption3: any;
  halfday1: any;
  selectedEmploymentTypes: string[] = [];
  leaveoperation: any;
  yearly: any;
  selectedLeave: any;
  showData: any;
  leavedata: any;
  ownerList: any;
  selectedCityIds1 = [];
  isEarnBasisSelected: boolean = false;
  isdisabled: boolean = false;
  isDropdownOpen: boolean = false;
  employmentTypes: string[] = labelUtils.EmployementType;
  selectedMinimumDays: number;
  selectedMinimumDays1: number;
  encash: any;
  capping: any;
  finalbranch: string;
  selected: any = [];
  finalholidaypolicy: string;
  adminRoot = environment.adminRoot;
  allbranch: any;

  numberRange: number[] = Array.from({ length: 45 }, (_, i) => i + 1);
  numberRange1: number[] = Array.from({ length: 45 }, (_, i) => i + 1);
  numberRange2: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

  numberRange3: number[] = Array.from({ length: 45 }, (_, i) => i + 1);
  minAttachmentArray: number[] = Array.from({ length: 15 }, (_, i) => i + 1);
  limitArray: number[] = [];




  hide: boolean;
  addDataLeaveID: string;
  minLeaveforAttachment: any;
  selectedPriority: any = [];
  selectedmonthly_CF_ENC_LPS: boolean = false;
  priorityPolicies: { [key: string]: boolean } = {};
  leaveLimitOptions: { [key: string]: { allLeave: boolean; limit: number | null } } = {};
  monthly_PolicyData: PolicyData;
  quartely_PolicyData: PolicyData;
  halfYearly_PolicyData: PolicyData;
  yearly_PolicyData: PolicyData;
  policyObjects: any = [];
  monthly_PolicyArray: any = [];
  quarterly_PolicyArray: any = []
  halfYearly_PolicyArray: any = []
  yearly_PolicyArray: any = []
  selectedquarterly_CF_ENC_LPS: boolean = false;
  selectedhalfYearly_CF_ENC_LPS: boolean = false;
  selectedyearly_CF_ENC_LPS: boolean = false;
  disabled: boolean = true;
  toShow_ENC: boolean = false;
  fixAmount_ENC: any
  Allpayhead: any = [];
  ratioAmount: any;
  allowMaxInQuarter_value: any;
  allowMaxInHalfYear_value: any;
  allowMaxInYear_value: any;
  amountTypeData: any
  selectedPayhead: any;
  monthlyMaxLeave: any;
  quarterlyMaxLeave: any;
  halfYearlyMaxLeave: any;
  yearlyMaxLeave: any;
  creditType: any
  pastDisabled: boolean = false;
  futureDisabled: boolean = false;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {

  }

  ngOnInit(): void {
    this.minAttachmentArray.unshift(0.5);

    for (let i = 0.5; i <= 60; i += 0.5) {
      this.limitArray.push(i);
    }

    this.company_id = +localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
    this.selectCompany(this.company_id);

  }

  fixAmount(type: string) {
    const amount = type == 'Fix' ? this.fixAmount_ENC : this.ratioAmount;
    if (amount < 0) {
      this.notifications.create('Error', `${type} Amount Should be positive value.`, NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      this.fixAmount_ENC = null;
    }
  }

  // Handle adding and removing policies when selectedPriority changes
  onPriorityChange(selectedPriorities: string[]) {



    if (selectedPriorities.length == 3) this.disabled = false;
    else {
      this.toShow_ENC = false
      this.disabled = true;
      this.selectedmonthly_CF_ENC_LPS = false;
      this.selectedquarterly_CF_ENC_LPS = false;
      this.selectedhalfYearly_CF_ENC_LPS = false;
      this.selectedyearly_CF_ENC_LPS = false;

    }

    // Find newly added priorities
    selectedPriorities.forEach(priority => {
      if (!this.monthly_PolicyArray.find(p => p.type === priority)) this.monthly_PolicyArray.push(new PolicyData(priority));
      if (!this.quarterly_PolicyArray.find(p => p.type === priority)) this.quarterly_PolicyArray.push(new PolicyData(priority));
      if (!this.halfYearly_PolicyArray.find(p => p.type === priority)) this.halfYearly_PolicyArray.push(new PolicyData(priority));
      if (!this.yearly_PolicyArray.find(p => p.type === priority)) this.yearly_PolicyArray.push(new PolicyData(priority));
    });

    // Find and remove unselected priorities
    this.monthly_PolicyArray = this.monthly_PolicyArray.filter(policy => selectedPriorities.includes(policy.type));
    this.quarterly_PolicyArray = this.quarterly_PolicyArray.filter(policy => selectedPriorities.includes(policy.type));
    this.halfYearly_PolicyArray = this.halfYearly_PolicyArray.filter(policy => selectedPriorities.includes(policy.type));
    this.yearly_PolicyArray = this.yearly_PolicyArray.filter(policy => selectedPriorities.includes(policy.type));


  }

  setRemainingObjDisable(i: any, category: String, type: String) {
    let policyArray: any[] = []

    if (type == 'monthly') policyArray = this.monthly_PolicyArray;
    if (type == 'quarterly') policyArray = this.quarterly_PolicyArray;
    if (type == 'halfYearly') policyArray = this.halfYearly_PolicyArray;
    if (type == 'yearly') policyArray = this.yearly_PolicyArray;

    if (policyArray.length > 0) {

      policyArray[i].disable = false;
      policyArray[i].limit = null
      // Loop through the array starting from the index after 'i'
      for (let index = i + 1; index < policyArray.length; index++) {
        policyArray[index].disable = category == 'allLeave' ? true : false;  // Set disable to true
        if (category === 'allLeave') policyArray[index].setPolicy = false;

      }

    }

    const check_ENC = [...this.monthly_PolicyArray, ...this.quarterly_PolicyArray, ...this.halfYearly_PolicyArray, ...this.yearly_PolicyArray].find(e => e.type == 'encashment' && e.setPolicy);

    this.toShow_ENC = check_ENC ? true : false;

  }

  setPolicy(flag: boolean, type: String) {
    if (!flag && type == 'monthly') this.monthly_PolicyArray = [];
    if (!flag && type == 'quarterly') this.quarterly_PolicyArray = [];
    if (!flag && type == 'halfYearly') this.halfYearly_PolicyArray = [];
    if (!flag && type == 'yearly') this.yearly_PolicyArray = [];

    if (flag) {
      this.onPriorityChange(this.selectedPriority);
    }

    const check_ENC = [...this.monthly_PolicyArray, ...this.quarterly_PolicyArray, ...this.halfYearly_PolicyArray, ...this.yearly_PolicyArray].find(e => e.type == 'encashment' && e.setPolicy);

    this.toShow_ENC = check_ENC ? true : false;
  }

  isLastElement(i: number): boolean {
    return i === this.yearly_PolicyArray.length - 1;
  }


  setPolicyChild(data: any, i: any, type: any) {
    if (!data.setPolicy) {
      data.setPolicy_category = '', data.limit = null;
    }



    const check_ENC = [...this.monthly_PolicyArray, ...this.quarterly_PolicyArray, ...this.halfYearly_PolicyArray, ...this.yearly_PolicyArray].find(e => e.type == 'encashment' && e.setPolicy);

    this.toShow_ENC = check_ENC ? true : false;

    if (i == (this.monthly_PolicyArray.length - 1) && data.setPolicy) data.setPolicy_category = 'allLeave', data.limit = null;


  }

  sendNotification(type1: any, type2: any, type3: any) {
    return this.notifications.create('Error', `${type1} Max Leave Should be ${type3} than ${type2} Max Leave.`, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  checkLeaveLimit(leave: any, type: any) {
    if (type == 'monthly') {

      if (this.allowMaxInQuarter_value == '1') {
        if (+this.quarterlyMaxLeave <= +leave) {
          this.sendNotification('Monthly', 'Quarterly', 'less');
          this.monthlyMaxLeave = null;
          return
        }
      }

      if (this.allowMaxInHalfYear_value == '1') {
        if (+this.halfYearlyMaxLeave <= +leave) {
          this.sendNotification('Monthly', 'HalfYearly', 'less');
          this.monthlyMaxLeave = null;
          return
        }
      }

      if (this.allowMaxInYear_value == '1') {
        if (+this.yearlyMaxLeave <= +leave) {
          this.sendNotification('Monthly', 'Yearly', 'less');
          this.monthlyMaxLeave = null;
          return
        }
      }
    }

    if (type == 'quarterly') {

      if (this.selectedOption3 == '1') {
        if (+this.monthlyMaxLeave >= +leave) {
          this.sendNotification('Quarterly', 'Monthly', 'greater');
          this.quarterlyMaxLeave = null;
          return
        }
      }

      if (this.allowMaxInHalfYear_value == '1') {
        if (+this.halfYearlyMaxLeave <= +leave) {
          this.sendNotification('Quarterly', 'HalfYearly', 'less');
          this.quarterlyMaxLeave = null;
          return
        }
      }

      if (this.allowMaxInYear_value == '1') {
        if (+this.yearlyMaxLeave <= +leave) {
          this.sendNotification('Quarterly', 'Yearly', 'less');
          this.quarterlyMaxLeave = null;
          return
        }
      }
    }

    if (type == 'halfYearly') {

      if (this.selectedOption3 == '1') {
        if (+this.monthlyMaxLeave >= +leave) {
          this.sendNotification('HalfYearly', 'Monthly', 'greater');
          this.halfYearlyMaxLeave = null;
          return
        }
      }

      if (this.allowMaxInQuarter_value == '1') {
        if (+this.quarterlyMaxLeave >= +leave) {
          this.sendNotification('HalfYearly', 'Quarterly', 'greater');
          this.halfYearlyMaxLeave = null;
          return
        }
      }

      if (this.allowMaxInYear_value == '1') {
        if (+this.yearlyMaxLeave <= +leave) {
          this.sendNotification('Quarterly', 'Yearly', 'less');
          this.halfYearlyMaxLeave = null;
          return
        }
      }
    }

    if (type == 'yearly') {
      if (this.selectedOption3 == '1') {
        if (+this.monthlyMaxLeave >= +leave) {
          this.sendNotification('Yearly', 'Monthly', 'greater');
          this.yearlyMaxLeave = null;
          return
        }
      }

      if (this.allowMaxInQuarter_value == '1') {
        if (+this.quarterlyMaxLeave >= +leave) {
          this.sendNotification('Yearly', 'Quarterly', 'greater');
          this.yearlyMaxLeave = null;
          return
        }
      }

      if (this.allowMaxInHalfYear_value == '1') {
        if (+this.halfYearlyMaxLeave >= +leave) {
          this.sendNotification('Yearly', 'HalfYearly', 'greater');
          this.yearlyMaxLeave = null;
          return
        }
      }
    }

  }


  getcompany() {
    let body = {
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
      });
  }

  changeDays(event) {
    if (this.selectedMinimumDays < 1 || this.selectedMinimumDays > 365) {
      this.notifications.create('Error', 'Days value must be between 1 and 365.', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      this.selectedMinimumDays = 1;
    }
  }

  changeDays1(event) {
    if (this.selectedMinimumDays1 < 1 || this.selectedMinimumDays1 > 28) {
      this.notifications.create('Error', 'Maximum 28 days is valid', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      this.selectedMinimumDays1 = 1;
    }
  }


  selectCompany(event: any) {
    this.showData = false;

    if (!event) {
      return;
    }
    // let body = {
    //   id: event,
    // };

    this.spinner.start('get');
    this.api.callApi(this.constant.LISTLEAVETYPESWITHOUTOUTDOORDUTY + event, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        this.leavedata = res.data;
        if (this.leavedata.length == 0) {
          this.addDataLeaveID = '';
        }
        this.spinner.stop('get');
      },
      (err) => {
        this.notifications.create(
          'Error',
          err.error.message || 'Someting Went Wrong!',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
        this.spinner.stop('get');
      },
    );

    this.showData = true;

    const body = {
      page: '',
      limit: '',
      companyMasterID: event
    };
    this.spinner.start('getPayhead');
    this.api
      .callApi(this.constant.GETCOMPANYPAYHEAD, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.Allpayhead = res.data.filter(s => s.salaryFieldSrNo == 'A' && ![1, 9, 16, 17, 24, 34, 43, 78, 83, 99, 67, 96, 97,101].includes(s.payheadMasterId)).map(e => {
            return {
              payheadMasterID: e.payheadMasterId,
              payheadName: e.payheadDisplayName ? e.payheadDisplayName : e.Payheadmaster.payheadName
            }
          });
          this.spinner.stop('getPayhead');
        }
      });
  }

  selectLeave($envt) {
    this.hrleave_id = this.addcomp.value.leave;
    // this.getHrLeaveData();
  }

  getHrLeaveData() {
    let body1 = {
      id: this.hrleave_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETHRLEAVEDATA + this.hrleave_id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          // Assuming response format as described above, access the first leave object in data array
          this.selectedLeave = res.data[0];

          // Set values of other form fields based on selected leave
          this.addcomp.controls['leavetype'].setValue(this.selectedLeave.LeaveType);
          // Set other form fields as needed

          this.spinner.stop();
        },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop();
        },
      );
  }

  getStructuredData(policyDataArray: any, type: String) {
    let type1 = '';
    if (type == 'HalfYearly') type = 'Half', type1 = 'Yearly';

    const body = {};
    // For carry Forward
    const montly_CF = policyDataArray.find(e => e.type == 'carryForward');
    if (montly_CF && montly_CF.setPolicy) {
      body[`is${type + type1}_CF`] = true;
      if (montly_CF.setPolicy_category == 'setLimit') body[`${type.toLowerCase() + type1}_CF_limit`] = montly_CF.limit;
    }

    // For Encashment 
    const montly_ENC = policyDataArray.find(e => e.type == 'encashment');
    if (montly_ENC && montly_ENC.setPolicy) {
      body[`is${type + type1}_ENC`] = true;
      if (montly_ENC.setPolicy_category == 'setLimit') body[`${type.toLowerCase() + type1}_ENC_limit`] = montly_ENC.limit;
    }

    // For Lapse
    const montly_LPS = policyDataArray.find(e => e.type == 'lapse');
    if (montly_LPS && montly_LPS.setPolicy) {
      body[`is${type + type1}_LPS`] = true;
      if (montly_LPS.setPolicy_category == 'setLimit') body[`${type.toLowerCase() + type1}_LPS_limit`] = montly_LPS.limit;
    }

    return body;
  }

  onSubmit() {




    if (!this.addcomp.valid) {
      return;
    }

    if (this.selectedPriority.length != 3) {
      return this.notifications.create('Error', ` Select All Priority for Policy.`, NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }


    this.isdisabled = true;
    let body = {
      leaveId: this.addcomp.value.leave,
      leavePolicyName: this.addcomp.value.emppolicyname,
      leaveType: this.addcomp.value.leavetype,
      yearlyLeave: this.addcomp.value.yearly,
      leaveOperationalYear: this.addcomp.value.leaveoperation,
      minDaysRequire: this.addcomp.value.minday,
      earnBaseType: this.addcomp.value.earnbasistype,
      creditPeriod: this.addcomp.value.creditperiod,
      creditDate: this.addcomp.value.creditdate,
      creditType: this.creditType,
      carryForward: this.addcomp.value.carryForward,
      carryForwardLimit: this.addcomp.value.carryForwardLimit,
      leavesToCarryForward: this.addcomp.value.leavesToCarryForward,
      leaveLapse: this.addcomp.value.leaveLapse,
      allowFutureApplyDays:
        this.selectedOption == 1 ? this.addcomp.value.selectedNumber : 0,
      allowPastApplyDays:
        this.selectedOption1 == 1 ? this.addcomp.value.selectedNumber1 : 0,
      allowMinInMonth:
        this.addcomp.value.allowMinInMonth == 1 ? this.addcomp.value.selectedNumber2 : 0,
      allowMaxInMonth:
        this.addcomp.value.allowMaxInMonth == 1 ? this.addcomp.value.selectedNumber3 : 0,
      allowMaxInQuarter: this.allowMaxInQuarter_value == 1 ? this.addcomp.value.allowMaxInQuarter : null,
      allowMaxInHalfYear: this.allowMaxInHalfYear_value == 1 ? this.addcomp.value.allowMaxInHalfYear : null,
      allowMaxInYear: this.allowMaxInYear_value == 1 ? this.addcomp.value.allowMaxInYear : null,
      allowHalfDays: this.addcomp.value.halfday,
      employementType: this.addcomp.value.employementtype,
      leaveEncashment: this.addcomp.value.leaveencash,
      cappingLeaveEncashment: this.addcomp.value.leaveencash == 1 ? this.addcomp.value.capping : null,
      companyMasterID: this.addcomp.value.company,
      min_leave_attachment: this.minLeaveforAttachment == 1 ? this.addcomp.value.min_leave_attachment1 : null,
      priority: this.selectedPriority,
      monthly_CF_ENC_LPS: this.selectedmonthly_CF_ENC_LPS,
      quarterly_CF_ENC_LPS: this.selectedquarterly_CF_ENC_LPS,
      halfYearly_CF_ENC_LPS: this.selectedhalfYearly_CF_ENC_LPS,
      yearly_CF_ENC_LPS: this.selectedyearly_CF_ENC_LPS,
      fixedAmount_ENC: this.toShow_ENC && this.amountTypeData == 'fixAmount' ? this.fixAmount_ENC : null,
      payheadIds: this.toShow_ENC && this.amountTypeData == 'payhead' ? this.selectedPayhead : null,
      ratio: this.toShow_ENC && this.amountTypeData == 'payhead' ? this.ratioAmount : null,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };


    // monthly
    if (this.selectedmonthly_CF_ENC_LPS) body = { ...body, ...this.getStructuredData(this.monthly_PolicyArray, 'Monthly') };
    // quarterly
    if (this.selectedquarterly_CF_ENC_LPS) body = { ...body, ...this.getStructuredData(this.quarterly_PolicyArray, 'Quarterly') };
    // Half-Yearly
    if (this.selectedhalfYearly_CF_ENC_LPS) body = { ...body, ...this.getStructuredData(this.halfYearly_PolicyArray, 'HalfYearly') };
    // Yearly
    if (this.selectedyearly_CF_ENC_LPS) body = { ...body, ...this.getStructuredData(this.yearly_PolicyArray, 'Yearly') };


    this.spinner.start('add');
    this.api
      .callApi(this.constant.CREATEEMPLOYEELEAVEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/employee_leave_policy']);
              this.spinner.stop('add');
            }, 3000);

          } else {

            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('add');
          }

          this.isdisabled = false;
        },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('add');
        },
      );
  }

  onLeaveTypeChange() {
    if (this.addcomp.value.leavetype == 'Pro Rata basis') {
      this.hide = false;
    } else {
      this.hide = true;
      this.creditType = 'Post'
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }


  checkDisable(event: any, type: String) {
    this.pastDisabled = false;
    this.futureDisabled = false;

    if (type == 'future' && event.target.value == 1) {
      this.pastDisabled = true;
      this.selectedOption1 = '0'
    }

    if (type == 'past' && event.target.value == 1) {
      this.futureDisabled = true;
      this.selectedOption = '0'
    }

  }
}
