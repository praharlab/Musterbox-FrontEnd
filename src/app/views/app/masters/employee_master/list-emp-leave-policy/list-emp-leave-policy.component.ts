import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { PolicyData } from '../../employeeLeavePolicy/model/policyData';
import { labelUtils } from 'src/app/constants/labelUtils';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-emp-leave-policy',
    templateUrl: './list-emp-leave-policy.component.html',
    styleUrls: ['./list-emp-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmpLeavePolicyComponent implements OnInit {

  @Output() EmployeeLeavePolicyVerify = new EventEmitter<object>();

  @ViewChild('addleavepolicy') addleavepolicy: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  apiURL = environment.apiUrl;
  ownerList: string[] = labelUtils.EmployementType;

  @ViewChild('myInput')
  myInputVariable: ElementRef;
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  editbyid: any;
  company_id: any;
  allshift: any = [];



  userdata: any;
  allLeavePolicy: any;
  empleavedata: any;
  editDataLeaveID: number;
  leavedata: any;
  hide: boolean;
  showallowMaxInMonth: string;
  showallowMinInMonth: string;
  showallowFutureApplyDays: string;
  showallowPastApplyDays: string;
  showallowHalfDays: string;
  comp: any;
  formValue: any;
  minLeaveforAttachment: string;
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

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.getIPAddress();
    this.getLeavePolicyData();

  }
  getLeavePolicyData() {
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start('get');
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {

          this.userdata = res.data;

          this.api
            .callApi(this.constant.GETEMPLOYEELEAVEPOLICYBYCOMPNAYID + this.userdata.companyMasterId, {}, 'GET', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allLeavePolicy = res.data;

                this.spinner.stop('get');
              }
              this.spinner.stop('get');
            });

          const body1 = {
            page: '',
            limit: '',
            companyMasterID: this.userdata.companyMasterId
          };
          this.spinner.start('getPayhead');
          this.api
            .callApi(this.constant.GETCOMPANYPAYHEAD, body1, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.Allpayhead = res.data.filter(s => s.salaryFieldSrNo == 'A' && s.payheadMasterId != 1 && s.payheadMasterId != 9 && s.payheadMasterId != 16 && s.payheadMasterId != 17 && s.payheadMasterId != 24 && s.payheadMasterId != 34 && s.payheadMasterId != 43 && s.payheadMasterId != 78 && s.payheadMasterId != 83).map(e => {
                  return {
                    payheadMasterID: e.payheadMasterId,
                    payheadName: e.payheadDisplayName ? e.payheadDisplayName : e.Payheadmaster.payheadName
                  }
                });
                this.spinner.stop('getPayhead');
              }

            });
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop('get');
        },
      );



  }

  resetModel() {
    this.addleavepolicy.resetForm();
  }

  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLEAVEPOLICYDATABYUSERID + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          let display = true;

          for (let item of this.rows) {
            if (item.endDate === null && item.leavePolicyStatus === 'active') {
              display = false;
              break;
            }
          }

          this.EmployeeLeavePolicyVerify.emit({
            tabname: 'LEAVEPOLICY',
            display: display,
          });


          // this.temp = [...this.rows];
          // this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onSubmit() {

    if (!this.addleavepolicy.valid) {
      return;
    }

    let body = {
      userMasterID: [+this.formValue.ListEmployeeMasterComponent.id],
      employeeLeavePolicyID: this.addleavepolicy.value.employeeLeavePolicyID,
      month: this.addleavepolicy.value.applicableDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start('add');
    this.api.callApi(this.constant.ADDEMPLEAVEPOLICYDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.addleavepolicy.reset();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('add');
      },
    );
  }


  getLeavePolicy(item: any) {

    this.editdata(item);
    this.getcompany();
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

  setPolicyChild(data: any) {
    if (!data.setPolicy) data.setPolicy_category = '', data.limit = null;

    const check_ENC = [...this.monthly_PolicyArray, ...this.quarterly_PolicyArray, ...this.halfYearly_PolicyArray, ...this.yearly_PolicyArray].find(e => e.type == 'encashment' && e.setPolicy);
    this.toShow_ENC = check_ENC ? true : false;



  }

  // Update data
  updatePolicyData(data: any, setPolicyFlag: boolean, limit: any) {
    data.setPolicy = setPolicyFlag;
    data.setPolicy_category = setPolicyFlag ? limit > 0 ? 'setLimit' : 'allLeave' : '';
    data.limit = limit;
  }

  updateArrayPolicyData(policyArray: any, empleavedata: any, type: String) {
    let type1 = '';
    if (type == 'HalfYearly') type = 'Half', type1 = 'Yearly';
    for (let i = 0; i < policyArray.length; i++) {
      const setPolicyFlag = policyArray[i].type == 'carryForward' ? empleavedata[`is${type + type1}_CF`] : policyArray[i].type == 'encashment' ? empleavedata[`is${type + type1}_ENC`] : empleavedata[`is${type + type1}_LPS`];
      const limit = policyArray[i].type == 'carryForward' ? empleavedata[`${type.toLowerCase() + type1}_CF_limit`] : policyArray[i].type == 'encashment' ? empleavedata[`${type.toLowerCase() + type1}_ENC_limit`] : empleavedata[`${type.toLowerCase() + type1}_LPS_limit`];
      this.updatePolicyData(policyArray[i], setPolicyFlag, limit);

      if (policyArray[i].setPolicy_category == 'allLeave') {
        this.setRemainingObjDisable(i, 'allLeave', `${type.toLowerCase() + type1}`);

      }

    }
  }



  editdata(item: any) {
    let empLeavePolicyID = item;
    this.spinner.start();
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

          if (this.empleavedata.leaveType == 'Pro Rata basis') {
            this.hide = false;
          } else {
            this.hide = true;
          }
          if (this.empleavedata.allowMaxInMonth == 0) {
            this.showallowMaxInMonth = '0';
          } else {
            this.showallowMaxInMonth = '1';
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
          }

          if (this.empleavedata.allowPastApplyDays == 0) {
            this.showallowPastApplyDays = '0';
          } else {
            this.showallowPastApplyDays = '1';
          }
          if (this.empleavedata.allowHalfDays == 0) {
            this.showallowHalfDays = '0';
          } else {
            this.showallowHalfDays = '1';
          }

          this.minLeaveforAttachment = +this.empleavedata.min_leave_attachment > 0 ? '1' : '0'

          this.selectedPriority = this.empleavedata.priority;
          this.selectedmonthly_CF_ENC_LPS = this.empleavedata.monthly_CF_ENC_LPS;
          this.selectedquarterly_CF_ENC_LPS = this.empleavedata.quarterly_CF_ENC_LPS;
          this.selectedhalfYearly_CF_ENC_LPS = this.empleavedata.halfYearly_CF_ENC_LPS;
          this.selectedyearly_CF_ENC_LPS = this.empleavedata.yearly_CF_ENC_LPS;
          // For Max limit
          this.allowMaxInQuarter_value = +this.empleavedata.allowMaxInQuarter > 0 ? '1' : '0'
          this.allowMaxInHalfYear_value = +this.empleavedata.allowMaxInHalfYear > 0 ? '1' : '0'
          this.allowMaxInYear_value = +this.empleavedata.allowMaxInYear > 0 ? '1' : '0'



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

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
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


}
