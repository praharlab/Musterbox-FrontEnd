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
import { labelUtils } from 'src/app/constants/labelUtils';
import { attendanceBranchTypeRule } from 'src/app/constants/commonVariables';
import { CommonUtils } from 'src/app/utils/common.utils';

@Component({
    selector: 'app-edit-attendancepolicy',
    templateUrl: './edit-attendancepolicy.component.html',
    styleUrls: ['./edit-attendancepolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAttendancepolicyComponent implements OnInit {
  @ViewChild('editattendancepolicy') editattendancepolicy: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  attendancepolicydata: any = [];
  allcomp: any;
  childcompany: string;
  sandwichleave: any;
  datashow: boolean;
  coffvaluecheck: any;
  nocoff: any;
  leaveshow: boolean;
  cofffullday: any;
  coffhalfday: any;
  cons: string;
  nets: string;
  overtimesalary: boolean;
  showPFESIC: boolean;
  pfApplicable: any;
  esicApplicable: any;
  adminRoot = environment.adminRoot;
  seletedmisspunchradio: string;
  seletedmisspunchminutes: any;
  showMissPunch: boolean = false;
  showSelfieWithFaceDetection: boolean;
  formValue: any;
  autoApproveOT: any = '0';
  showAutoAppOT: boolean = false;
  Allpayhead: any;
  employeeESICPercentage: number = 0.75;
  employerESICPercentage: number = 3.25;
  salaryovertimeshow: boolean;
  selectedPayhead: any;
  toShowInSalarySlip: boolean;
  toShowOT: boolean;
  defaultPolicy: any = labelUtils.defaultPolicy;
  extraOtValue: boolean = false;
  normalDayOvertimeShow: boolean;
  attendanceBranchTypeRuleData: any = attendanceBranchTypeRule;
  allBranches: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.editdata();
    this.getcompany();
  }

  getPayheadData(id) {
    const body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('getPayhead');
    this.api
      .callApi(this.constant.GETCOMPANYPAYHEAD, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.Allpayhead = res.data
            .filter(
              (s) =>
                s.salaryFieldSrNo == 'A' &&
                s.payheadMasterId != 1 &&
                s.payheadMasterId != 9 &&
                s.payheadMasterId != 16 &&
                s.payheadMasterId != 17 &&
                s.payheadMasterId != 24 &&
                s.payheadMasterId != 34 &&
                s.payheadMasterId != 43 &&
                s.payheadMasterId != 78 &&
                s.payheadMasterId != 83 &&
                s.payheadMasterId != 50,
            )
            .map((e) => {
              return {
                payheadMasterID: e.payheadMasterId,
                payheadName: e.payheadDisplayName
                  ? e.payheadDisplayName
                  : e.Payheadmaster.payheadName,
              };
            });
          this.spinner.stop('getPayhead');
        }
      });
  }

  selectCompany(event: any) {
    this.selectedPayhead = null;
    this.getPayheadData(event);
    this.getAllBranches(event);
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
          this.allcomp = res.data;

          this.spinner.stop();
        }
      });
  }
  getAllBranches(id?: any) {
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allBranches = res;
        CommonUtils.selectAllForDropdownItems(this.allBranches);
        this.spinner.stop('branch');
      });
  }
  editdata() {
    let id = this.formValue.ListAttendancepolicyComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWATTENDENCEPOLICY + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.attendancepolicydata = res.data;

          if (this.attendancepolicydata.extraOt) this.extraOtValue = true;

          if (this.attendancepolicydata.selfieAttendance == 1)
            this.showSelfieWithFaceDetection = true;
          else this.showSelfieWithFaceDetection = false;

          if (this.attendancepolicydata.autoApprove) {
            this.autoApproveOT = '1';
            this.showAutoAppOT = true;
          }

          if (
            this.attendancepolicydata.considerOvertimeAfter == 'totalworkinghours' &&
            this.attendancepolicydata.preShiftHrsConsideration == null
          ) {
            this.attendancepolicydata.preShiftHrsConsideration = 1;
          }

          this.attendancepolicydata.automaticAssignShift =
            this.attendancepolicydata.automaticAssignShift.toString();
          this.attendancepolicydata.selfieAttendance =
            this.attendancepolicydata.selfieAttendance.toString();
          this.attendancepolicydata.selfieWithFaceDetection =
            this.attendancepolicydata.selfieWithFaceDetection.toString();
          this.attendancepolicydata.outsidePunchInPunchOut =
            this.attendancepolicydata.outsidePunchInPunchOut.toString();
          this.sandwichleave = this.attendancepolicydata.sandwichLeave;
          this.cofffullday = this.attendancepolicydata.cofffullday;
          this.coffhalfday = this.attendancepolicydata.coffhalfday;

          this.spinner.stop();
          if (this.attendancepolicydata.considerWorkingHours == 'includingouthours') {
            this.datashow = false;
          } else {
            this.datashow = true;
          }
          if (this.attendancepolicydata.coff == 'NULL') {
            this.coffvaluecheck = false;
            this.leaveshow = false;
          } else if (this.attendancepolicydata.coff == '') {
            this.coffvaluecheck = false;
            this.leaveshow = false;
          } else if (this.attendancepolicydata.coff == 'EMPTY') {
            this.coffvaluecheck = false;
            this.leaveshow = false;
          } else if (this.attendancepolicydata.coff == null) {
            this.coffvaluecheck = false;
            this.leaveshow = false;
          } else if (this.attendancepolicydata.coff == 'Overtime') {
            this.coffvaluecheck = true;
            this.leaveshow = false;
          } else {
            this.coffvaluecheck = true;
          }

          if (this.attendancepolicydata.coff == 'AddLeave') {
            if (
              this.attendancepolicydata.cofffullday == '' &&
              this.attendancepolicydata.coffhalfday == ''
            ) {
              this.leaveshow = false;
            } else if (
              this.attendancepolicydata.cofffullday == 0 &&
              this.attendancepolicydata.coffhalfday == 0
            ) {
              this.leaveshow = false;
            } else {
              this.leaveshow = true;
            }
          }
          if (this.attendancepolicydata.coff == 'AddExtraDays') {
            if (
              this.attendancepolicydata.cofffullday == '' &&
              this.attendancepolicydata.coffhalfday == ''
            ) {
              this.leaveshow = false;
            } else if (
              this.attendancepolicydata.cofffullday == 0 &&
              this.attendancepolicydata.coffhalfday == 0
            ) {
              this.leaveshow = false;
            } else {
              this.leaveshow = true;
            }
          }

          if (
            this.attendancepolicydata.giveOTAs == 'NULL' ||
            this.attendancepolicydata.giveOTAs == '' ||
            this.attendancepolicydata.giveOTAs == 'EMPTY' ||
            this.attendancepolicydata.giveOTAs == null ||
            this.attendancepolicydata.giveOTAs == 'Overtime'
          ) {
            this.normalDayOvertimeShow = false;
          } else {
            this.normalDayOvertimeShow = true;
          }

          if (this.attendancepolicydata.giveOTAs == 'AddLeave') {
            if (
              this.attendancepolicydata.cofffullday == '' &&
              this.attendancepolicydata.coffhalfday == ''
            ) {
              this.normalDayOvertimeShow = false;
            } else if (
              this.attendancepolicydata.cofffullday == 0 &&
              this.attendancepolicydata.coffhalfday == 0
            ) {
              this.normalDayOvertimeShow = false;
            } else {
              this.normalDayOvertimeShow = true;
            }
          }
          if (this.attendancepolicydata.giveOTAs == 'AddExtraDays') {
            if (
              this.attendancepolicydata.cofffullday == '' &&
              this.attendancepolicydata.coffhalfday == ''
            ) {
              this.normalDayOvertimeShow = false;
            } else if (
              this.attendancepolicydata.cofffullday == 0 &&
              this.attendancepolicydata.coffhalfday == 0
            ) {
              this.normalDayOvertimeShow = false;
            } else {
              this.normalDayOvertimeShow = true;
            }
          }

          if (
            this.attendancepolicydata.showinsalaryslip == 'false' ||
            !this.attendancepolicydata.showinsalaryslip
          ) {
            this.attendancepolicydata.showinsalaryslip = false;
            this.overtimesalary = false;
            this.showPFESIC = false;
            this.toShowInSalarySlip = false;
          } else {
            this.attendancepolicydata.showinsalaryslip = true;
            this.toShowInSalarySlip = true;
            this.overtimesalary = true;

            this.toShowOT = this.attendancepolicydata.toShowOT;
            if (this.attendancepolicydata.toShowOT == 'addInPayhead') {
              this.showPFESIC = true;
            } else {
              if (this.attendancepolicydata.consider == 'gross') {
                this.showPFESIC = true;
              }
            }
          }
          if (this.attendancepolicydata.show == 'show') {
            this.cons = 'show';
            this.nets = 'show';
          } else {
            this.cons = 'net';
            this.nets = 'net';
          }

          if (this.attendancepolicydata.missPunchMinutes) {
            this.seletedmisspunchradio = '1';
            this.seletedmisspunchminutes = Number(this.attendancepolicydata.missPunchMinutes);
            this.showMissPunch = true;
          } else {
            this.seletedmisspunchradio = '0';
          }

          if (this.attendancepolicydata.esicApplicable == 'true') {
            this.attendancepolicydata.esicApplicable = true;
            this.employeeESICPercentage = this.attendancepolicydata.employeeESICPer
              ? this.attendancepolicydata.employeeESICPer
              : 0.75;
            this.employerESICPercentage = this.attendancepolicydata.employerESICPer
              ? this.attendancepolicydata.employerESICPer
              : 3.25;
          }

          this.selectedPayhead = this.attendancepolicydata.payheadMasterId;
          if (this.attendancepolicydata.attBranch && this.attendancepolicydata.attBranch.length) {
            this.attendancepolicydata.attBranch = this.attendancepolicydata.attBranch.map(
              (id) => +id,
            );
          }
          this.getPayheadData(this.attendancepolicydata.companyMasterID);
          this.getAllBranches(this.attendancepolicydata.companyMasterID);
        },
        (err) => {
          console.log('error', err);
        },
      );
  }

  selectShowOT(event) {
    if (event.target.value) {
      this.attendancepolicydata.consider = null;
      if (event.target.value == 'asOT') {
        this.salaryovertimeshow = true;
        this.showPFESIC = false;
      } else {
        this.showPFESIC = true;
        this.salaryovertimeshow = false;
      }
    }
  }

  coffcheck1(event) {
    this.attendancepolicydata.coffhalfday = null;
    this.attendancepolicydata.cofffullday = null;
    this.attendancepolicydata.coffOneAndHalfDay = null;
    this.attendancepolicydata.coffTwoFullDay = null;
    this.attendancepolicydata.coff == null;
    this.coffvaluecheck = event.target.checked;
  }

  leavecheck(event) {
    this.attendancepolicydata.coffhalfday = null;
    this.attendancepolicydata.cofffullday = null;
    this.attendancepolicydata.coffOneAndHalfDay = null;
    this.attendancepolicydata.coffTwoFullDay = null;
    if (event.target.value == 'AddLeave' || event.target.value == 'AddExtraDays') {
      this.leaveshow = true;
    } else {
      this.leaveshow = false;
    }
  }
  overtimeCheck(event) {
    this.attendancepolicydata.halfdayCoffEday = null;
    this.attendancepolicydata.fulldayCoffEday = null;
    this.attendancepolicydata.oneAndHalfDayCoffEday = null;
    this.attendancepolicydata.twoDayCoffEday = null;
    if (event.target.value == 'AddLeave' || event.target.value == 'AddExtraDays') {
      this.normalDayOvertimeShow = true;
    } else {
      this.normalDayOvertimeShow = false;
    }
  }
  punchInPunchOutBranch(event) {
    this.attendancepolicydata.attBranch = [];
    this.attendancepolicydata.attBrType = event.target.value;
  }
  sandwich(event) {
    this.attendancepolicydata.holidaysandwichLeave = false;
    this.attendancepolicydata.BeforeAfterLeave = false;
    this.attendancepolicydata.HFDBeforeAfterLeave = false;
    this.attendancepolicydata.weekoffsandwichLeave = false;
    this.sandwichleave = event.target.checked;
  }

  calltoshow(event) {
    if (event.target.value == 'notincludingouthours') {
      this.datashow = true;
      this.attendancepolicydata.preShiftHrsConsideration = 1;
    } else {
      this.datashow = false;
    }
  }

  callPayType(event) {
    if (this.datashow == true || this.datashow == false) {
      if (!event) {
        this.attendancepolicydata.payAmount == null;
        this.attendancepolicydata.overtimeHrs == null;
        this.attendancepolicydata.payType == null;
      }
      if (event == 'grossSalary' || event == 'basicSalary' || event == 'ctcSalary') {
        this.attendancepolicydata.payAmount == null;
      }
      if (event == 'fixedAmount') {
        this.editattendancepolicy.value.overtimeHrs == null;
      }
    }
  }

  callOvertimeType(event) {
    if (this.datashow == true || this.datashow == false) {
      if (!event) {
        this.editattendancepolicy.value.overtimeType == null;
        this.editattendancepolicy.value.typeValue == null;
        this.attendancepolicydata.overtimeType == null;
      }
      if (event && event.target.value == 'actual') {
        this.editattendancepolicy.value.typeValue == null;
      }
    }
  }

  salaryovertime(event) {
    if (event.target.checked == true) {
      this.overtimesalary = true;
    } else {
      this.overtimesalary = false;
      this.attendancepolicydata.consider = null;
      this.showPFESIC = false;

      this.attendancepolicydata.pfApplicable = null;

      this.attendancepolicydata.esicApplicable = null;
    }
  }

  applicablePFESIC(event) {
    if (event.target.value == 'gross') {
      this.showPFESIC = true;
    } else {
      this.showPFESIC = false;
      this.attendancepolicydata.pfApplicable = null;

      this.attendancepolicydata.esicApplicable = null;
    }
  }

  onSubmit() {
    if (!this.editattendancepolicy.valid) {
      return;
    }

    if (
      this.employeeESICPercentage < 0 ||
      this.employeeESICPercentage > 100 ||
      this.employerESICPercentage < 0 ||
      this.employerESICPercentage > 100
    ) {
      return this.commonNotificationService.handleWarning(
        'Please enter an ESIC percentage between 0 and 100 for both employee and employer contributions.',
      );
    }
    if (
      this.showMissPunch &&
      (Number(this.editattendancepolicy.value.missPunchMinutes) < 0 ||
        Number(this.editattendancepolicy.value.missPunchMinutes) > 1320)
    ) {
      return this.commonNotificationService.handleWarning(
        'Invalid minutes for Punch-out skip after <br>(Range: 0-1320)',
      );
    }

    if (
      this.editattendancepolicy.value.autoAppOT &&
      this.editattendancepolicy.value.autoAppOT <
        this.editattendancepolicy.value.overtimeEntryAfterMin
    ) {
      return this.commonNotificationService.handleWarning(
        'Auto approve overtime minutes should be greater than Minimum Minutes To Consider For Over Time!',
      );
    }

    if (
      +this.editattendancepolicy.value.overtimeEntryAfterMin < 0 ||
      +this.editattendancepolicy.value.overtimeHrs < 0 ||
      +this.editattendancepolicy.value.autoAppOT < 0 ||
      +this.editattendancepolicy.value.coffhalf < 0 ||
      +this.editattendancepolicy.value.coffFull < 0 ||
      +this.editattendancepolicy.value.coffOneAndHalfDay < 0 ||
      +this.editattendancepolicy.value.coffTwoFullDay < 0 ||
      +this.editattendancepolicy.value.halfdayCoffEday < 0 ||
      +this.editattendancepolicy.value.fulldayCoffEday < 0 ||
      +this.editattendancepolicy.value.oneAndHalfDayCoffEday < 0 ||
      +this.editattendancepolicy.value.twoDayCoffEday < 0 ||
      +this.editattendancepolicy.value.skipMinutesInOvertime < 0
    ) {
      return this.commonNotificationService.handleWarning('Minutes should be Positive!');
    }

    if (
      this.editattendancepolicy.value.payAmount &&
      +this.editattendancepolicy.value.payAmount < 0
    ) {
      return this.commonNotificationService.handleWarning('Pay Amount should be Positive!');
    }

    if (
      this.editattendancepolicy.value.typeValue &&
      +this.editattendancepolicy.value.typeValue <= 0
    ) {
      return this.commonNotificationService.handleWarning(
        'Type Value should be greater than Zero!',
      );
    }

    if (
      this.editattendancepolicy.value.monthDays &&
      +this.editattendancepolicy.value.monthDays <= 0
    ) {
      return this.commonNotificationService.handleWarning(
        'Month Days should be greater than Zero!',
      );
    }

    if (
      this.extraOtValue &&
      (+this.attendancepolicydata.min_extra_ot_mins <= 0 ||
        +this.attendancepolicydata.extra_ot_mins <= 0)
    ) {
      return this.commonNotificationService.handleWarning(
        'Extra overtime value should be greater than zero!',
      );
    }
    // Overtime
    if (this.normalDayOvertimeShow == true) {
      if (this.attendancepolicydata.halfdayCoffEday > this.attendancepolicydata.fulldayCoffEday) {
        return this.commonNotificationService.handleWarning(
          'Normal Day Coff 1 Day Minutes Can Not be Less Then 0.5 Day Minutes',
        );
      }

      if (this.attendancepolicydata.oneAndHalfDayCoffEday) {
        if (
          this.attendancepolicydata.fulldayCoffEday >
          this.attendancepolicydata.oneAndHalfDayCoffEday
        ) {
          return this.commonNotificationService.handleWarning(
            'Normal Day Coff 1.5 Day Minutes Can Not be Less Then 1 Day Minutes',
          );
        }
      }

      if (this.attendancepolicydata.twoDayCoffEday) {
        if (!this.attendancepolicydata.oneAndHalfDayCoffEday) {
          if (
            this.attendancepolicydata.fulldayCoffEday > this.attendancepolicydata.twoDayCoffEday
          ) {
            return this.commonNotificationService.handleWarning(
              'Normal Day Coff 2 Day Minutes Can Not be Less Then 0.5 Day Minutes',
            );
          }
        }
        if (
          this.attendancepolicydata.oneAndHalfDayCoffEday > this.attendancepolicydata.twoDayCoffEday
        ) {
          return this.commonNotificationService.handleWarning(
            'Normal Day Coff 2 Day Minutes Can Not be Less Then 1.5 Day Minutes',
          );
        }
      }
    }

    // Coff
    if (this.leaveshow == true && this.coffvaluecheck == true) {
      if (this.attendancepolicydata.coffhalfday > this.attendancepolicydata.cofffullday) {
        return this.commonNotificationService.handleWarning(
          'Coff 1 Day Minutes Can Not be Less Then 0.5 Day Minutes',
        );
      }

      if (this.attendancepolicydata.coffOneAndHalfDay) {
        if (this.attendancepolicydata.cofffullday > this.attendancepolicydata.coffOneAndHalfDay) {
          return this.commonNotificationService.handleWarning(
            'Coff 1.5 Day Minutes Can Not be Less Then 1 Day Minutes',
          );
        }
      }

      if (this.attendancepolicydata.coffTwoFullDay) {
        if (!this.attendancepolicydata.coffOneAndHalfDay) {
          if (this.attendancepolicydata.cofffullday > this.attendancepolicydata.coffTwoFullDay) {
            return this.commonNotificationService.handleWarning(
              'Coff 2 Day Minutes Can Not be Less Then 0.5 Day Minutes',
            );
          }
        }
        if (
          this.attendancepolicydata.coffOneAndHalfDay > this.attendancepolicydata.coffTwoFullDay
        ) {
          return this.commonNotificationService.handleWarning(
            'Coff 2 Day Minutes Can Not be Less Then 1.5 Day Minutes',
          );
        }
      }
    }

    if (this.editattendancepolicy.value.coff == '') {
      this.editattendancepolicy.value.coff == null;
    }
    if (this.showPFESIC == false) {
      this.editattendancepolicy.value.pfApplicable = null;
      this.editattendancepolicy.value.esicApplicable = null;
    }

    if (this.editattendancepolicy.value.pfApplicable == '') {
      this.editattendancepolicy.value.pfApplicable = null;
    }

    if (this.editattendancepolicy.value.esicApplicable == '') {
      this.editattendancepolicy.value.esicApplicable = null;
    }

    if (this.editattendancepolicy.value.setCorrLimit) {
      if (+this.editattendancepolicy.value.attCorrLimit < 0) {
        return this.commonNotificationService.handleWarning(
          'Attendance Correction Limit Can not be negative',
        );
      } else if (+this.editattendancepolicy.value.attCorrLimit > 31) {
        return this.commonNotificationService.handleWarning(
          'Attendance Correction Limit Can not be greater than 31',
        );
      }
    }
    if (
      this.attendancepolicydata.preShiftHrsConsideration &&
      this.editattendancepolicy.value.considerOvertimeAfter == 'totalworkinghours' &&
      this.editattendancepolicy.value.preShiftMin &&
      this.editattendancepolicy.value.preShiftMin < 0
    ) {
      return this.commonNotificationService.handleWarning(
        'Minimum Pre-Shift Minutes should be Positive!',
      );
    }
    const body = {
      attendancePolicyID: this.formValue.ListAttendancepolicyComponent.id,
      attendancePolicyName: this.editattendancepolicy.value.attendancePolicyName,
      selfieAttendance: this.editattendancepolicy.value.selfieAttendance,
      selfieWithFaceDetection: this.showSelfieWithFaceDetection
        ? this.editattendancepolicy.value.selfieAttendancewithFaceDetection
        : 0,
      outsidePunchInPunchOut: this.editattendancepolicy.value.outsidePunchInPunchOut,
      singleMultiplePunchInPunchOut: this.editattendancepolicy.value.singleMultiplePunchInPunchOut,
      automaticAssignShift: this.editattendancepolicy.value.automaticAssignShift,
      companyMasterID: this.editattendancepolicy.value.company,
      sandwichLeave: this.editattendancepolicy.value.sandwichLeave,
      BeforeAfterLeave: this.editattendancepolicy.value.BeforeAfterLeave,
      HFDBeforeAfterLeave: this.editattendancepolicy.value.HFDBeforeAfterLeave,
      weekoffsandwichLeave: this.editattendancepolicy.value.weekoffsandwichLeave,
      holidaysandwichLeave: this.editattendancepolicy.value.holidaysandwichLeave,
      considerWorkingHours: this.editattendancepolicy.value.considerWorkingHours,
      considerOvertimeAfter: this.editattendancepolicy.value.considerOvertimeAfter,
      overtimeEntryAfterMin: this.editattendancepolicy.value.overtimeEntryAfterMin,
      attendanceInMobile: this.editattendancepolicy.value.attendanceInMobile,
      coff: this.coffvaluecheck ? this.attendancepolicydata.coff : null,
      showinsalaryslip: this.editattendancepolicy.value.showinsalaryslip,
      consider: this.editattendancepolicy.value.show,
      pfApplicable: this.editattendancepolicy.value.pfApplicable,
      esicApplicable: this.editattendancepolicy.value.esicApplicable,
      missPunchMinutes: this.showMissPunch
        ? Number(this.editattendancepolicy.value.missPunchMinutes)
        : null,
      coffhalfday: this.coffvaluecheck ? this.editattendancepolicy.value.coffhalf : null,
      cofffullday: this.coffvaluecheck ? this.editattendancepolicy.value.coffFull : null,
      coffOneAndHalfDay: this.coffvaluecheck
        ? this.editattendancepolicy.value.coffOneAndHalfDay
        : null,
      coffTwoFullDay: this.coffvaluecheck ? this.editattendancepolicy.value.coffTwoFullDay : null,
      overtimeHrs:
        this.attendancepolicydata.payType == 'grossSalary' ||
        this.attendancepolicydata.payType == 'basicSalary' ||
        this.attendancepolicydata.payType == 'ctcSalary'
          ? this.attendancepolicydata.overtimeHrs
          : null,
      autoApprove: this.showAutoAppOT ? this.editattendancepolicy.value.autoAppOT : null,
      payAmount:
        this.attendancepolicydata.payType == 'fixedAmount'
          ? this.attendancepolicydata.payAmount
          : null,
      payType: this.editattendancepolicy.value.payType,
      skipMinutesInOvertime: this.editattendancepolicy.value.skipMinutesInOvertime,
      overtimeType: this.editattendancepolicy.value.overtimeType,
      typeValue:
        this.attendancepolicydata.overtimeType == 'slotwise' ||
        this.attendancepolicydata.overtimeType == 'roundoff'
          ? this.editattendancepolicy.value.typeValue
          : null,
      monthDays:
        this.attendancepolicydata.payType == 'grossSalary' ||
        this.attendancepolicydata.payType == 'basicSalary' ||
        this.attendancepolicydata.payType == 'ctcSalary'
          ? this.attendancepolicydata.monthDays
          : null,
      toShowOT: this.editattendancepolicy.value.toShowOT,
      payheadMasterId:
        this.editattendancepolicy.value.toShowOT == 'addInPayhead' ? this.selectedPayhead : null,
      employeeESICPer: this.editattendancepolicy.value.esicApplicable
        ? this.employeeESICPercentage
        : null,
      employerESICPer: this.editattendancepolicy.value.esicApplicable
        ? this.employerESICPercentage
        : null,
      preShiftHrsConsideration:
        this.editattendancepolicy.value.considerOvertimeAfter == 'totalworkinghours'
          ? this.attendancepolicydata.preShiftHrsConsideration
          : null,
      preShiftMin:
        this.editattendancepolicy.value.considerOvertimeAfter == 'totalworkinghours' &&
        this.attendancepolicydata.preShiftHrsConsideration &&
        this.editattendancepolicy.value.preShiftMin
          ? this.attendancepolicydata.preShiftMin
          : null,
      showShift: this.editattendancepolicy.value.showShift,
      extraOt: this.extraOtValue,
      min_extra_ot_mins: this.extraOtValue ? this.attendancepolicydata.min_extra_ot_mins : null,
      extra_ot_mins: this.extraOtValue ? this.attendancepolicydata.extra_ot_mins : null,
      giveOTAs: this.editattendancepolicy.value.giveOTAs,
      halfdayCoffEday: this.editattendancepolicy.value.halfdayCoffEday,
      fulldayCoffEday: this.editattendancepolicy.value.fulldayCoffEday,
      oneAndHalfDayCoffEday: this.editattendancepolicy.value.oneAndHalfDayCoffEday,
      twoDayCoffEday: this.editattendancepolicy.value.twoDayCoffEday,
      WHPHPriority: this.editattendancepolicy.value.WHPHPriority,
      setCorrLimit: this.editattendancepolicy.value.setCorrLimit,
      attCorrLimit: this.editattendancepolicy.value.setCorrLimit
        ? this.editattendancepolicy.value.attCorrLimit
        : null,
      attBrType: this.editattendancepolicy.value.attBrType,
      attBranch:
        this.editattendancepolicy.value.attBrType == this.attendanceBranchTypeRuleData.SELECTED
          ? this.editattendancepolicy.value.attBranch
          : [],
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEATTENDENCE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);

          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/attendance_policy']);

            this.spinner.stop();
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);

          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleSuccess(err.error.message);

        this.spinner.stop();
      },
    );
  }

  miss_punch(event: any) {
    if (event == '1') {
      this.showMissPunch = true;
    } else {
      this.showMissPunch = false;
      this.seletedmisspunchminutes = null;
    }
  }
  getselfiePermission(event: any) {
    if (event.target.value == '1') this.showSelfieWithFaceDetection = true;
    if (event.target.value == '0') this.showSelfieWithFaceDetection = false;
  }
  changeAUtoApprove(event: any) {
    this.editattendancepolicy.value.autoAppOT = null;
    if (+event == 1) this.showAutoAppOT = true;
    else this.showAutoAppOT = false;
  }
}
