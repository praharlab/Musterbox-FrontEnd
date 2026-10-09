import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { PolicyData } from '../model/policyData'
import { labelUtils } from 'src/app/constants/labelUtils';
@Component({
    selector: 'app-edit-employee-leave-policy',
    templateUrl: './edit-employee-leave-policy.component.html',
    styleUrls: ['./edit-employee-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeeLeavePolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  ipAddress: any;
  comp: any;
  company_id: any;
  childcompany: string;
  company: any;
  leave: any;
  hrleave_id: any;
  selectedOption: any;
  selectedOption1: any;
  selectedOption2: any;
  selectedOption3: any;
  halfday1: any;
  isdisabled: boolean = false;
  empleavedata: any;
  empLeave: any;
  showData: any;
  leavedata: any;
  selectedCityIds1 = [];
  isEarnBasisSelected: boolean = false;
  isDropdownOpen: boolean = false;
  employmentTypes: string[] = labelUtils.EmployementType;
  selectedEmploymentTypes: string[] = [];
  leaveoperation: any;
  selectedLeave: any;
  adminRoot = environment.adminRoot;
  selectedMinimumDays: number;

  numberRange: number[] = Array.from({ length: 45 }, (_, i) => i + 1);
  numberRange1: number[] = Array.from({ length: 45 }, (_, i) => i + 1);
  numberRange2: number[] = Array.from({ length: 45 }, (_, i) => i + 1);

  numberRange3: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
  minAttachmentArray: number[] = Array.from({ length: 15 }, (_, i) => i + 1);
  hide: boolean;
  showallowMaxInMonth: string;
  showallowMinInMonth: string;
  showallowFutureApplyDays: string;
  showallowPastApplyDays: string;
  showallowHalfDays: string;
  editDataLeaveID: number;
  formValue: any;
  minLeaveforAttachment: any;
  leaveEncashment: any;
  cappingLeaveEncashment: any;
  selectedPriority: any = [];
  monthly_PolicyArray: any = [];
  quarterly_PolicyArray: any = [];
  halfYearly_PolicyArray: any = [];
  yearly_PolicyArray: any = [];
  limitArray: number[] = [];

  selectedmonthly_CF_ENC_LPS: boolean = false;
  selectedquarterly_CF_ENC_LPS: boolean = false;
  selectedhalfYearly_CF_ENC_LPS: boolean = false;
  selectedyearly_CF_ENC_LPS: boolean = false;
  selectedMinimumDays1: number;
  selectedMinimumDays2: number;
  disabled: boolean = true;
  toShow_ENC: boolean = false;
  fixAmount_ENC: any
  Allpayhead: any = [];
  ratioAmount: any;
  allowMaxInQuarter_value: any;
  allowMaxInHalfYear_value: any;
  allowMaxInYear_value: any;
  amountTypeData: any
  selectedPayhead: any = [];
  yearlyMaxLeave: any;
  quarterlyMaxLeave: any;
  halfYearlyMaxLeave: any;
  monthlyMaxLeave: any;
  pastDisabled: boolean = false;
  futureDisabled: boolean = false;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.minAttachmentArray.unshift(0.5);

    for (let i = 0.5; i <= 60; i += 0.5) {
      this.limitArray.push(i);
    }

    this.formValue = this.formValueStorageService.getData();

    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
    this.editdata();
    this.getCompany();
    this.getIPAddress();
  }

  isLastElement(i: number): boolean {
    return i === this.yearly_PolicyArray.length - 1;
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

  getCompany() {
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
      this.selectedMinimumDays = null;
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

  changeDays2(event) {
    if (this.selectedMinimumDays2 < 0) {
      this.notifications.create('Error', 'Leave days should be positive value', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      this.selectedMinimumDays2 = null;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  isSelected(option: string) {
    return this.selectedEmploymentTypes.includes(option);
  }

  toggleOption(option: string) {
    const index = this.selectedEmploymentTypes.indexOf(option);
    if (index > -1) {
      this.selectedEmploymentTypes.splice(index, 1);
    } else {
      this.selectedEmploymentTypes.push(option);
    }
  }

  selectCompany(event: any) {
    this.showData = false;

    if (!event) {
      return;
    }


    this.spinner.start('get');
    this.api.callApi(this.constant.LISTLEAVETYPESWITHOUTOUTDOORDUTY + event, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        this.leavedata = res.data;

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
      // policyArray[i].limit = null
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

  setPolicyChild(data: any, i: any) {
    if (!data.setPolicy) data.setPolicy_category = '', data.limit = null;

    const check_ENC = [...this.monthly_PolicyArray, ...this.quarterly_PolicyArray, ...this.halfYearly_PolicyArray, ...this.yearly_PolicyArray].find(e => e.type == 'encashment' && e.setPolicy);
    this.toShow_ENC = check_ENC ? true : false;

    if (i == (this.monthly_PolicyArray.length - 1) && data.setPolicy) data.setPolicy_category = 'allLeave', data.limit = null;


  }

  // // Update data
  // updatePolicyData(data: any, setPolicyFlag: boolean, limit: any) {
  //   data.setPolicy = setPolicyFlag;
  //   data.setPolicy_category = setPolicyFlag ? limit > 0 ? 'setLimit' : 'allLeave' : '';
  //   data.limit = limit;
  // }

  // updateArrayPolicyData(policyArray: any, empleavedata: any, type: String) {
  //   let type1 = '';
  //   if (type == 'HalfYearly') type = 'Half', type1 = 'Yearly';
  //   for (let i = 0; i < policyArray.length; i++) {
  //     const setPolicyFlag = policyArray[i].type == 'carryForward' ? empleavedata[`is${type + type1}_CF`] : policyArray[i].type == 'encashment' ? empleavedata[`is${type + type1}_ENC`] : empleavedata[`is${type + type1}_LPS`];
  //     const limit = policyArray[i].type == 'carryForward' ? empleavedata[`${type.toLowerCase() + type1}_CF_limit`] : policyArray[i].type == 'encashment' ? empleavedata[`${type.toLowerCase() + type1}_ENC_limit`] : empleavedata[`${type.toLowerCase() + type1}_LPS_limit`];
  //     this.updatePolicyData(policyArray[i], setPolicyFlag, limit);

  //     if (policyArray[i].setPolicy_category == 'allLeave') {
  //       this.setRemainingObjDisable(i, 'allLeave', `${type.toLowerCase() + type1}`);

  //     }

  //   }
  // }

  updateArrayPolicyData(policyArray: any, empleavedata: any, type: String) {
    let type1 = '';
    if (type == 'HalfYearly') type = 'Half', type1 = 'Yearly';
    for (let i = 0; i < policyArray.length; i++) {
      const setPolicyFlag = policyArray[i].type == 'carryForward' ? empleavedata[`is${type + type1}_CF`] : policyArray[i].type == 'encashment' ? empleavedata[`is${type + type1}_ENC`] : empleavedata[`is${type + type1}_LPS`];
      const limit = policyArray[i].type == 'carryForward' ? empleavedata[`${type.toLowerCase() + type1}_CF_limit`] : policyArray[i].type == 'encashment' ? empleavedata[`${type.toLowerCase() + type1}_ENC_limit`] : empleavedata[`${type.toLowerCase() + type1}_LPS_limit`];

      policyArray[i].setPolicy = setPolicyFlag;
      policyArray[i].setPolicy_category = setPolicyFlag ? limit > 0 ? 'setLimit' : 'allLeave' : '';
      policyArray[i].limit = limit;

      this.setRemainingObjDisable(i, policyArray[i].setPolicy_category, `${type.toLowerCase() + type1}`);



    }

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

      if (this.showallowMaxInMonth == '1') {
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

      if (this.showallowMaxInMonth == '1') {
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
      if (this.showallowMaxInMonth == '1') {
        if (+this.monthlyMaxLeave >= +leave) {
          this.yearlyMaxLeave = null;
          this.sendNotification('Yearly', 'Monthly', 'greater');

          return
        }
      }

      if (this.allowMaxInQuarter_value == '1') {
        if (+this.quarterlyMaxLeave >= +leave) {
          this.yearlyMaxLeave = null;
          this.sendNotification('Yearly', 'Quarterly', 'greater');

          return
        }
      }

      if (this.allowMaxInHalfYear_value == '1') {
        if (+this.halfYearlyMaxLeave >= +leave) {
          this.yearlyMaxLeave = null;
          this.sendNotification('Yearly', 'HalfYearly', 'greater');
          return
        }
      }
    }

  }



  editdata() {
    let empLeavePolicyID = this.formValue.ListEmployeeLeavePolicyComponent.id;
    this.spinner.start('getData');
    this.api
      .callApi(
        this.constant.GETEMPLOYEELEAVEPOLICYBYID + empLeavePolicyID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.empleavedata = res.data;
          this.editDataLeaveID = Number(this.empleavedata.LeaveID);
          this.empleavedata.allowFutureApplyDays =
            this.empleavedata.allowFutureApplyDays.toString();
          this.empleavedata.allowPastApplyDays = this.empleavedata.allowPastApplyDays.toString();
          this.empleavedata.allowMinInMonth = this.empleavedata.allowMinInMonth.toString();
          this.empleavedata.allowMaxInMonth = this.empleavedata.allowMaxInMonth.toString();
          this.empleavedata.allowHalfDays = this.empleavedata.allowHalfDays.toString();

          this.spinner.start();
          this.api
            .callApi(
              this.constant.GETHRLEAVEDATA + this.empleavedata.companyMasterId,
              {},
              'GET',
              true,
              false,
              true,
            )
            .subscribe(
              (res: any) => {
                this.leavedata = res.data;

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


          const body = {
            page: '',
            limit: '',
            companyMasterID: this.empleavedata.companyMasterId
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

          if (this.empleavedata.leaveType == 'Pro Rata basis') {
            this.hide = false;
          } else {
            this.hide = true;
          }
          if (this.empleavedata.allowMaxInMonth == 0) {
            this.showallowMaxInMonth = '0';
          } else {
            this.showallowMaxInMonth = '1';
            this.monthlyMaxLeave = this.empleavedata.allowMaxInMonth
          }



          if (this.empleavedata.allowMinInMonth == 0) {
            this.showallowMinInMonth = '0';
          } else {
            this.showallowMinInMonth = '1';
          }

          if (this.empleavedata.allowFutureApplyDays == 0) {
            this.showallowFutureApplyDays = '0';
          } else {
            this.showallowFutureApplyDays = '1';
            this.pastDisabled = true;
            this.showallowPastApplyDays = '0';

          }

          if (this.empleavedata.allowPastApplyDays == 0) {
            this.showallowPastApplyDays = '0';
          } else {
            this.showallowPastApplyDays = '1';
            this.futureDisabled = true;
            this.showallowFutureApplyDays = '0';
          }
          if (this.empleavedata.allowHalfDays == 0) {
            this.showallowHalfDays = '0';
          } else {
            this.showallowHalfDays = '1';
          }

          this.minLeaveforAttachment = +this.empleavedata.min_leave_attachment > 0 ? '1' : '0'

          this.leaveEncashment = this.empleavedata.leaveEncashment
          this.cappingLeaveEncashment = this.leaveEncashment == 1 ? this.empleavedata.cappingLeaveEncashment : null;

          this.selectedPriority = this.empleavedata.priority;
          this.selectedmonthly_CF_ENC_LPS = this.empleavedata.monthly_CF_ENC_LPS;
          this.selectedquarterly_CF_ENC_LPS = this.empleavedata.quarterly_CF_ENC_LPS;
          this.selectedhalfYearly_CF_ENC_LPS = this.empleavedata.halfYearly_CF_ENC_LPS;
          this.selectedyearly_CF_ENC_LPS = this.empleavedata.yearly_CF_ENC_LPS;
          // For Max limit
          this.allowMaxInQuarter_value = +this.empleavedata.allowMaxInQuarter > 0 ? '1' : '0'
          this.allowMaxInHalfYear_value = +this.empleavedata.allowMaxInHalfYear > 0 ? '1' : '0'
          this.allowMaxInYear_value = +this.empleavedata.allowMaxInYear > 0 ? '1' : '0';

          this.quarterlyMaxLeave = this.allowMaxInQuarter_value == '1' ? this.empleavedata.allowMaxInQuarter : null;
          this.halfYearlyMaxLeave = this.allowMaxInHalfYear_value == '1' ? this.empleavedata.allowMaxInHalfYear : null;
          this.yearlyMaxLeave = this.allowMaxInYear_value == '1' ? this.empleavedata.allowMaxInYear : null;


          if (this.selectedPriority && this.selectedPriority.length > 0) {
            this.onPriorityChange(this.selectedPriority);
          }

          if (this.selectedmonthly_CF_ENC_LPS && this.monthly_PolicyArray.length > 0) this.updateArrayPolicyData(this.monthly_PolicyArray, this.empleavedata, 'Monthly');
          if (this.selectedquarterly_CF_ENC_LPS && this.quarterly_PolicyArray.length > 0) this.updateArrayPolicyData(this.quarterly_PolicyArray, this.empleavedata, 'Quarterly');
          if (this.selectedhalfYearly_CF_ENC_LPS && this.halfYearly_PolicyArray.length > 0) this.updateArrayPolicyData(this.halfYearly_PolicyArray, this.empleavedata, 'HalfYearly');
          if (this.selectedyearly_CF_ENC_LPS && this.yearly_PolicyArray.length > 0) this.updateArrayPolicyData(this.yearly_PolicyArray, this.empleavedata, 'Yearly');


          this.amountTypeData = this.toShow_ENC ? +this.empleavedata.fixedAmount_ENC > 0 ? 'fixAmount' : 'payhead' : '';
          this.fixAmount_ENC = this.amountTypeData == 'fixAmount' ? this.empleavedata.fixedAmount_ENC : null;
          this.selectedPayhead = this.amountTypeData == 'payhead' ? this.empleavedata.payheadIds : [];
          this.ratioAmount = this.amountTypeData == 'payhead' ? this.empleavedata.ratio : null;

          this.spinner.stop('getData');
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
          this.spinner.stop('getData');
        },
      );
  }



  selectLeave(envt) {
    this.hrleave_id = this.addcomp.value.leave;
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
      creditType: this.addcomp.value.credittype,
      carryForward: this.addcomp.value.carryForward,
      carryForwardLimit: this.addcomp.value.carryForward == 'Y' ? this.addcomp.value.carryForwardLimit : null,
      leavesToCarryForward: (this.addcomp.value.carryForward == 'Y' && this.addcomp.value.carryForwardLimit == 'setLimit') ? this.addcomp.value.leavesToCarryForward : null,
      leaveLapse: this.addcomp.value.carryForward == 'N' ? this.addcomp.value.leaveLapse : null,
      allowFutureApplyDays:
        this.showallowFutureApplyDays == '1' ? this.addcomp.value.selectedNumber : 0,
      allowPastApplyDays:
        this.showallowPastApplyDays == '1' ? this.addcomp.value.selectedNumber1 : 0,
      allowMinInMonth:
        this.addcomp.value.allowMinInMonth == 1 ? this.addcomp.value.selectedNumber2 : 0,
      allowMaxInMonth:
        this.addcomp.value.allowMaxInMonth == 1 ? this.monthlyMaxLeave : 0,
      allowHalfDays: this.addcomp.value.halfday,
      employementType: this.addcomp.value.employementtype,
      leaveEncashment: this.leaveEncashment,
      cappingLeaveEncashment: this.leaveEncashment == 1 ? this.cappingLeaveEncashment : null,
      min_leave_attachment: this.minLeaveforAttachment == 1 ? this.addcomp.value.min_leave_attachment1 : null,
      priority: this.selectedPriority,
      monthly_CF_ENC_LPS: this.selectedmonthly_CF_ENC_LPS,
      quarterly_CF_ENC_LPS: this.selectedquarterly_CF_ENC_LPS,
      halfYearly_CF_ENC_LPS: this.selectedhalfYearly_CF_ENC_LPS,
      yearly_CF_ENC_LPS: this.selectedyearly_CF_ENC_LPS,
      fixedAmount_ENC: (this.toShow_ENC && this.amountTypeData == 'fixAmount') ? this.fixAmount_ENC : null,
      payheadIds: (this.toShow_ENC && this.amountTypeData == 'payhead') ? this.selectedPayhead : null,
      ratio: (this.toShow_ENC && this.amountTypeData == 'payhead') ? this.ratioAmount : null,
      allowMaxInQuarter: this.allowMaxInQuarter_value == 1 ? this.quarterlyMaxLeave : null,
      allowMaxInHalfYear: this.allowMaxInHalfYear_value == 1 ? this.halfYearlyMaxLeave : null,
      allowMaxInYear: this.allowMaxInYear_value == 1 ? this.yearlyMaxLeave : null,
      companyMasterID: this.addcomp.value.company,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };





    // monthly
    if (this.selectedmonthly_CF_ENC_LPS) body = { ...body, ...this.getStructuredData(this.monthly_PolicyArray, 'Monthly') };
    // quarterly
    if (this.selectedquarterly_CF_ENC_LPS) body = { ...body, ...this.getStructuredData(this.quarterly_PolicyArray, 'Quarterly') };
    // Half-Yearly
    if (this.selectedhalfYearly_CF_ENC_LPS) body = { ...body, ...this.getStructuredData(this.halfYearly_PolicyArray, 'HalfYearly') };
    // Yearly
    if (this.selectedyearly_CF_ENC_LPS) body = { ...body, ...this.getStructuredData(this.yearly_PolicyArray, 'Yearly') };


    this.spinner.start('update');
    this.api
      .callApi(
        this.constant.EDITEMPLOYEELEAVEPOLICY + this.formValue.ListEmployeeLeavePolicyComponent.id,
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
            this.isdisabled = false;
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/employee_leave_policy']);
              this.spinner.stop('update');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.isdisabled = false;
            this.spinner.stop('update');
          }

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
          this.spinner.stop('update');
        },
      );
  }

  onLeaveTypeChange() {
    if (this.addcomp.value.leavetype == 'Pro Rata basis') {
      this.hide = false;
    } else {
      this.hide = true;
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
