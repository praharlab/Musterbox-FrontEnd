import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { attendanceBranchTypeRule } from 'src/app/constants/commonVariables';
import { CommonUtils } from 'src/app/utils/common.utils';
@Component({
    selector: 'app-add-attendancepolicy',
    templateUrl: './add-attendancepolicy.component.html',
    styleUrls: ['./add-attendancepolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAttendancepolicyComponent implements OnInit {
  @ViewChild('addattendancepolicy') addattendancepolicy: NgForm;
  company_id: any;
  allcomp: any;
  childcompany: any;
  company: any;
  sandwichleave: any;
  datashow: boolean;
  coffval: any;
  coffvaluecheck: any;
  leaveshow: boolean;
  normalDayOvertimeShow: boolean;
  salaryovertimeshow: boolean;
  showPFESIC: boolean = false;
  adminRoot = environment.adminRoot;
  showMissPunch: boolean = false;
  showSelfieWithFaceDetection: boolean = false;
  autoApproveOT: any = '0';
  showAutoAppOT: boolean = false;
  formValue: any;
  cofffullday: any;
  coffhalfday: any;
  overtimesalary: boolean;
  cons: string;
  nets: string;
  seletedmisspunchradio: string;
  seletedmisspunchminutes: number;
  // coffvaluecheck: boolean;
  companyId: any;
  extraOtValue: boolean = false;
  attendanceBranchTypeRuleData: any = attendanceBranchTypeRule;
  attendancepolicydata = {
    attendancePolicyID: null,
    attendancePolicyName: null,
    selfieAttendance: null,
    outsidePunchInPunchOut: null,
    singleMultiplePunchInPunchOut: null,
    automaticAssignShift: null,
    sandwichLeave: false,
    BeforeAfterLeave: false,
    HFDBeforeAfterLeave: false,
    weekoffsandwichLeave: false,
    holidaysandwichLeave: false,
    considerWorkingHours: null,
    considerOvertimeAfter: null,
    overtimeEntryAfterMin: null,
    attendanceInMobile: null,
    coff: null,
    coffhalfday: null,
    cofffullday: null,
    coffOneAndHalfDay: null,
    coffTwoFullDay: null,
    overtimeHrs: null,
    status: null,
    showinsalaryslip: null,
    consider: null,
    pfApplicable: null,
    esicApplicable: null,
    missPunchMinutes: null,
    selfieWithFaceDetection: null,
    autoApprove: null,
    payType: 'grossSalary',
    payAmount: null,
    skipMinutesInOvertime: null,
    overtimeType: 'actual',
    typeValue: null,
    monthDays: null,
    companyMasterID: null,
    show: null,
    toShowOT: null,
    payheadMasterId: null,
    employeeESICPer: 0.75,
    employerESICPer: 3.25,
    preShiftHrsConsideration: 1,
    showShift: false,
    extraOt: false,
    min_extra_ot_mins: null,
    extra_ot_mins: null,
    giveOTAs: null,
    halfdayCoffEday: null,
    fulldayCoffEday: null,
    oneAndHalfDayCoffEday: null,
    twoDayCoffEday: null,
    WHPHPriority: null,
    setCorrLimit: false,
    attBrType: this.attendanceBranchTypeRuleData.ALL,
    attBranch: [],
    preShiftMin: null,
  };
  selectedPayhead: any;
  Allpayhead: any = [];
  employeeESICPercentage: number = 0.75;
  employerESICPercentage: number = 3.25;
  toShowInSalarySlip: boolean;
  allBranches: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.getcompany();

    if (
      this.formValue &&
      this.formValue.attendance_policy_cloneData &&
      this.formValue.attendance_policy_cloneData.id
    ) {
      this.editdata();
    }
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;

          this.spinner.stop('company');
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

  editdata() {
    let id = this.formValue.attendance_policy_cloneData.id;
    this.spinner.start('getData');
    this.api
      .callApi(this.constant.VIEWATTENDENCEPOLICY + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.attendancepolicydata = res.data;
          // this.attendancepolicydata.companyMasterID = this.attendancepolicydata ? this.attendancepolicydata.companyMasterID : null
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
            this.salaryovertimeshow = false;
            this.showPFESIC = false;
            this.toShowInSalarySlip = false;
          } else {
            this.attendancepolicydata.showinsalaryslip = true;
            this.salaryovertimeshow = true;
            this.toShowInSalarySlip = true;
            if (this.attendancepolicydata.consider == 'gross') {
              this.showPFESIC = true;
            }
          }
          if (this.attendancepolicydata.show == 'show') {
            this.cons = 'show';
            this.nets = 'show';
          } else {
            this.cons = 'net';
            this.nets = 'net';
          }

          if (this.attendancepolicydata.toShowOT == 'addInPayhead') {
            this.selectedPayhead = this.attendancepolicydata.payheadMasterId;
            this.showPFESIC = true;
          } else {
            this.selectedPayhead = null;
          }

          if (this.attendancepolicydata.missPunchMinutes) {
            this.seletedmisspunchradio = '1';
            this.attendancepolicydata.missPunchMinutes = Number(
              this.attendancepolicydata.missPunchMinutes,
            );
            this.showMissPunch = true;
          } else {
            this.seletedmisspunchradio = '0';
          }

          // if (this.attendancepolicydata.showinsalaryslip == true) {
          //   this.toShowInSalarySlip = true;
          // } else {
          //   this.toShowInSalarySlip = false;
          // }

          if (this.attendancepolicydata.esicApplicable == 'true') {
            this.attendancepolicydata.esicApplicable = true;
            this.employeeESICPercentage = this.attendancepolicydata.employeeESICPer;
            this.employerESICPercentage = this.attendancepolicydata.employerESICPer;
          } else {
            this.employeeESICPercentage = null;
            this.employerESICPercentage = null;
          }
          if (this.attendancepolicydata.attBranch && this.attendancepolicydata.attBranch.length) {
            this.attendancepolicydata.attBranch = this.attendancepolicydata.attBranch.map(
              (id) => +id,
            );
          }
          this.getPayheadData(this.attendancepolicydata.companyMasterID);
          this.getAllBranches(this.attendancepolicydata.companyMasterID);

          this.spinner.stop('getData');
        },
        (err) => {
          this.spinner.stop('getData');
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
    } else {
      this.datashow = false;
    }
  }

  callPayType(event) {
    if (this.datashow == true || this.datashow == false) {
      if (!event) {
        this.addattendancepolicy.value.payAmount == null;
        this.addattendancepolicy.value.overtimeHrs == null;
        this.attendancepolicydata.payType == null;
      }
      if (event == 'grossSalary' || event == 'basicSalary' || event == 'ctcSalary') {
        this.addattendancepolicy.value.payAmount == null;
      }
      if (event == 'fixedAmount') {
        this.addattendancepolicy.value.overtimeHrs == null;
      }
    }
  }

  callOvertimeType(event) {
    if (this.datashow == true || this.datashow == false) {
      if (!event) {
        this.addattendancepolicy.value.overtimeType == null;
        this.addattendancepolicy.value.typeValue == null;
        this.attendancepolicydata.overtimeType == null;
      }
      if (event && event.target.value == 'actual') {
        this.addattendancepolicy.value.typeValue == null;
      }
    }
  }

  salaryovertime(event) {
    if (event.target.checked == true) {
      this.salaryovertimeshow = true;
    } else {
      this.attendancepolicydata.toShowOT = null;
      this.attendancepolicydata.consider = null;
      this.salaryovertimeshow = false;
      this.showPFESIC = false;
    }
  }

  applicablePFESIC(event) {
    if (event.target.value == 'gross') {
      this.showPFESIC = true;
    } else {
      this.showPFESIC = false;
      this.attendancepolicydata.esicApplicable = false;
      this.attendancepolicydata.pfApplicable = false;
    }
  }

  onSubmit() {
    if (!this.addattendancepolicy.valid) {
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
      (Number(this.addattendancepolicy.value.missPunchMinutes) < 0 ||
        Number(this.addattendancepolicy.value.missPunchMinutes) > 1320)
    ) {
      return this.commonNotificationService.handleWarning(
        'Invalid minutes for Punch-out skip after <br>(Range: 0-1320)',
      );
    }

    if (
      this.addattendancepolicy.value.autoAppOT &&
      this.addattendancepolicy.value.autoAppOT <
        this.addattendancepolicy.value.overtimeEntryAfterMin
    ) {
      return this.commonNotificationService.handleWarning(
        'Auto approve overtime minutes should be greater than Minimum Minutes To Consider For Over Time!',
      );
    }

    if (
      +this.addattendancepolicy.value.overtimeEntryAfterMin < 0 ||
      +this.addattendancepolicy.value.overtimeHrs < 0 ||
      +this.addattendancepolicy.value.autoAppOT < 0 ||
      +this.addattendancepolicy.value.coffhalf < 0 ||
      +this.addattendancepolicy.value.coffFull < 0 ||
      +this.addattendancepolicy.value.coffOneAndHalfDay < 0 ||
      +this.addattendancepolicy.value.coffTwoFullDay < 0 ||
      +this.addattendancepolicy.value.halfdayCoffEday < 0 ||
      +this.addattendancepolicy.value.fulldayCoffEday < 0 ||
      +this.addattendancepolicy.value.oneAndHalfDayCoffEday < 0 ||
      +this.addattendancepolicy.value.twoDayCoffEday < 0 ||
      +this.addattendancepolicy.value.skipMinutesInOvertime < 0
    ) {
      return this.commonNotificationService.handleWarning('Minutes should be Positive!');
    }

    if (this.addattendancepolicy.value.payAmount && +this.addattendancepolicy.value.payAmount < 0) {
      return this.commonNotificationService.handleWarning('Pay Amount should be Positive!');
    }

    if (
      this.addattendancepolicy.value.typeValue &&
      +this.addattendancepolicy.value.typeValue <= 0
    ) {
      return this.commonNotificationService.handleWarning(
        'Type Value should be greater than Zero!',
      );
    }

    if (
      this.addattendancepolicy.value.monthDays &&
      +this.addattendancepolicy.value.monthDays <= 0
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

    if (this.addattendancepolicy.value.coff == '') {
      this.addattendancepolicy.value.coff == null;
    }
    if (this.showPFESIC == false) {
      this.addattendancepolicy.value.pfApplicable = null;
      this.addattendancepolicy.value.esicApplicable = null;
    }

    if (this.addattendancepolicy.value.pfApplicable == '') {
      this.addattendancepolicy.value.pfApplicable = null;
    }

    if (this.addattendancepolicy.value.esicApplicable == '') {
      this.addattendancepolicy.value.esicApplicable = null;
    }

    if (this.addattendancepolicy.value.setCorrLimit) {
      if (+this.addattendancepolicy.value.attCorrLimit < 0) {
        return this.commonNotificationService.handleWarning(
          'Attendance Correction Limit Can not be negative',
        );
      } else if (+this.addattendancepolicy.value.attCorrLimit > 31) {
        return this.commonNotificationService.handleWarning(
          'Attendance Correction Limit Can not be greater than 31',
        );
      }
    }
    if (
      this.attendancepolicydata.preShiftHrsConsideration &&
      this.addattendancepolicy.value.considerOvertimeAfter == 'totalworkinghours' &&
      this.addattendancepolicy.value.preShiftMin &&
      this.addattendancepolicy.value.preShiftMin < 0
    ) {
      return this.commonNotificationService.handleWarning(
        'Minimum Pre-Shift Minutes should be Positive!',
      );
    }
    const body = {
      attendancePolicyName: this.addattendancepolicy.value.attendancePolicyName,
      selfieAttendance: this.addattendancepolicy.value.selfieAttendance,
      selfieWithFaceDetection: this.showSelfieWithFaceDetection
        ? this.addattendancepolicy.value.selfieAttendancewithFaceDetection
        : 0,
      outsidePunchInPunchOut: this.addattendancepolicy.value.outsidePunchInPunchOut,
      singleMultiplePunchInPunchOut: this.addattendancepolicy.value.singleMultiplePunchInPunchOut,
      automaticAssignShift: this.addattendancepolicy.value.automaticAssignShift,
      companyMasterID: this.addattendancepolicy.value.company,
      sandwichLeave: this.attendancepolicydata.sandwichLeave,
      BeforeAfterLeave: this.attendancepolicydata.BeforeAfterLeave,
      HFDBeforeAfterLeave: this.attendancepolicydata.HFDBeforeAfterLeave,
      weekoffsandwichLeave: this.attendancepolicydata.weekoffsandwichLeave,
      holidaysandwichLeave: this.attendancepolicydata.holidaysandwichLeave,
      considerWorkingHours: this.addattendancepolicy.value.considerWorkingHours,
      considerOvertimeAfter: this.addattendancepolicy.value.considerOvertimeAfter,
      overtimeEntryAfterMin: this.addattendancepolicy.value.overtimeEntryAfterMin,
      attendanceInMobile: this.addattendancepolicy.value.attendanceInMobile,
      showinsalaryslip: this.salaryovertimeshow ? this.salaryovertimeshow : 'false',
      consider: this.addattendancepolicy.value.show,
      pfApplicable: this.addattendancepolicy.value.pfApplicable,
      esicApplicable: this.addattendancepolicy.value.esicApplicable,
      missPunchMinutes: this.showMissPunch
        ? Number(this.addattendancepolicy.value.missPunchMinutes)
        : null,
      coff: this.addattendancepolicy.value.coff1,
      coffhalfday: this.addattendancepolicy.value.coffhalf,
      cofffullday: this.addattendancepolicy.value.coffFull,
      coffOneAndHalfDay: this.addattendancepolicy.value.coffOneAndHalfDay,
      coffTwoFullDay: this.addattendancepolicy.value.coffTwoFullDay,
      overtimeHrs: this.addattendancepolicy.value.overtimeHrs,
      autoApprove: this.addattendancepolicy.value.autoAppOT,
      payType: this.addattendancepolicy.value.payType,
      payAmount: this.addattendancepolicy.value.payAmount,
      skipMinutesInOvertime: this.addattendancepolicy.value.skipMinutesInOvertime,
      overtimeType: this.addattendancepolicy.value.overtimeType,
      typeValue: this.addattendancepolicy.value.typeValue,
      monthDays: this.addattendancepolicy.value.monthDays,
      toShowOT: this.addattendancepolicy.value.toShowOT,
      payheadMasterId:
        this.addattendancepolicy.value.toShowOT == 'addInPayhead' ? this.selectedPayhead : null,
      employeeESICPer: this.addattendancepolicy.value.esicApplicable
        ? this.employeeESICPercentage
        : null,
      employerESICPer: this.addattendancepolicy.value.esicApplicable
        ? this.employerESICPercentage
        : null,
      preShiftHrsConsideration:
        this.addattendancepolicy.value.considerOvertimeAfter == 'totalworkinghours'
          ? this.attendancepolicydata.preShiftHrsConsideration
          : null,
      preShiftMin:
        this.addattendancepolicy.value.considerOvertimeAfter == 'totalworkinghours' &&
        this.attendancepolicydata.preShiftHrsConsideration &&
        this.addattendancepolicy.value.preShiftMin
          ? this.attendancepolicydata.preShiftMin
          : null,
      showShift: this.addattendancepolicy.value.showShift,
      extraOt: this.extraOtValue,
      min_extra_ot_mins: this.extraOtValue ? this.attendancepolicydata.min_extra_ot_mins : null,
      extra_ot_mins: this.extraOtValue ? this.attendancepolicydata.extra_ot_mins : null,
      giveOTAs: this.addattendancepolicy.value.giveOTAs,
      halfdayCoffEday: this.addattendancepolicy.value.halfdayCoffEday,
      fulldayCoffEday: this.addattendancepolicy.value.fulldayCoffEday,
      oneAndHalfDayCoffEday: this.addattendancepolicy.value.oneAndHalfDayCoffEday,
      twoDayCoffEday: this.addattendancepolicy.value.twoDayCoffEday,
      WHPHPriority: this.addattendancepolicy.value.WHPHPriority,
      setCorrLimit: this.addattendancepolicy.value.setCorrLimit,
      attCorrLimit: this.addattendancepolicy.value.setCorrLimit
        ? this.addattendancepolicy.value.attCorrLimit
        : null,
      attBrType: this.addattendancepolicy.value.attBrType,
      attBranch:
        this.addattendancepolicy.value.attBrType == this.attendanceBranchTypeRuleData.SELECTED
          ? this.addattendancepolicy.value.attBranch
          : [],
    };

    this.spinner.start('add');
    this.api
      .callApi(this.constant.CREATEATTENDENCEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/attendance_policy']);

              this.spinner.stop('add');
            }, 3000);
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('add');
          }
        },
        (err) => {
          this.commonNotificationService.handleSuccess(err.error.message);
          this.spinner.stop('add');
        },
      );
  }
  miss_punch(event: any) {
    if (event == '1') {
      this.showMissPunch = true;
    } else {
      this.showMissPunch = false;
    }
  }

  getselfiePermission(event: any) {
    if (event.target.value == '1') this.showSelfieWithFaceDetection = true;
    if (event.target.value == '0') this.showSelfieWithFaceDetection = false;
  }

  changeAUtoApprove(event: any) {
    if (+event == 1) this.showAutoAppOT = true;
    else this.showAutoAppOT = false;
  }
}
