import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { attendanceBranchTypeRule } from 'src/app/constants/commonVariables';
import { CommonUtils } from 'src/app/utils/common.utils';

@Component({
    selector: 'app-view-attedance-policy',
    templateUrl: './view-attedance-policy.component.html',
    styleUrls: ['./view-attedance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewAttedancePolicyComponent implements OnInit {
  attendancePolicyID: any;
  selectedPayType: any;
  toShowInSalarySlip: boolean;
  toShowOT: any;
  employeeESICPercentage: any;
  employerESICPercentage: any;
  selectedPayhead: any;
  salaryovertimeshow: boolean;
  Allpayhead: any;
  normalDayOvertimeShow: boolean;

  @Input()
  set getAttendancePolicyID(getAttendancePolicyID: any) {
    this.attendancePolicyID = getAttendancePolicyID;
  }

  @ViewChild('editattendancepolicy') editattendancepolicy: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  attendancepolicydata: any = [];
  allcomp: any;
  childcompany: string;
  sandwichleave: any;
  datashow: boolean;
  coffvaluecheck: any;
  coffval: any;
  coffcheck: boolean;
  Overtime: any;
  AddLeave: any;
  nocoff: any;
  leaveshow: boolean;
  cofffullday: any;
  coffhalfday: any;
  Attinmobile: any;
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
  autoApproveOT: any = '0';
  showAutoAppOT: boolean = false;
  selectedOvertimeType: any;
  extraOtValue: boolean = false;
  attendanceBranchTypeRuleData: any = attendanceBranchTypeRule;
  allBranches: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    if (this.attendancePolicyID) {
      this.childcompany = localStorage.getItem('childcompany');
      this.getIPAddress();
      this.editdata();
      this.getcompany();
    }
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
  punchInPunchOutBranch(event) {
    this.attendancepolicydata.attBranch = [];
    this.attendancepolicydata.attBrType = event.target.value;
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

  editdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.VIEWATTENDENCEPOLICY + this.attendancePolicyID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.attendancepolicydata = res.data;
          if (this.attendancepolicydata.extraOt) this.extraOtValue = true;

          if (this.attendancepolicydata.autoApprove) {
            this.autoApproveOT = '1';
            this.showAutoAppOT = true;
          }

          if (this.attendancepolicydata.selfieAttendance == 1)
            this.showSelfieWithFaceDetection = true;
          else this.showSelfieWithFaceDetection = false;

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
          this.Attinmobile = this.attendancepolicydata.attendanceInMobile;
          this.selectedPayType = this.attendancepolicydata.payType;
          this.selectedOvertimeType = this.attendancepolicydata.overtimeType;

          this.spinner.stop();
          if (this.attendancepolicydata.considerWorkingHours == 'includingouthours') {
            this.datashow = false;
          } else {
            this.datashow = true;
          }
          if (this.attendancepolicydata.coff == 'NULL') {
            this.coffcheck = false;
            this.leaveshow = false;
          } else if (this.attendancepolicydata.coff == '') {
            this.coffcheck = false;
            this.leaveshow = false;
          } else if (this.attendancepolicydata.coff == 'EMPTY') {
            this.coffcheck = false;
            this.leaveshow = false;
          } else if (this.attendancepolicydata.coff == null) {
            this.coffcheck = false;
            this.leaveshow = false;
          } else if (this.attendancepolicydata.coff == 'Overtime') {
            this.coffcheck = true;
            this.leaveshow = false;
            this.Overtime = this.attendancepolicydata.coff;
            this.AddLeave = this.attendancepolicydata.coff;
          } else {
            this.AddLeave = this.attendancepolicydata.coff;
            this.Overtime = this.attendancepolicydata.coff;
            this.coffcheck = true;
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
            this.overtimesalary = true;
            this.toShowInSalarySlip = true;
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
            this.employeeESICPercentage = this.attendancepolicydata.employeeESICPer;
            this.employerESICPercentage = this.attendancepolicydata.employerESICPer;
          }

          this.selectedPayhead = this.attendancepolicydata.payheadMasterId;

          //  else {
          //   this.employeeESICPercentage = 0.75;
          //   this.employerESICPercentage = 3.25;
          // }
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
  coffvalue(event) {
    this.coffval = event.target.value;
    if (this.coffval == 'Overtime') {
      this.leaveshow = false;
    } else {
      this.leaveshow = true;
    }
  }

  sandwich(event) {
    this.attendancepolicydata.holidaysandwichLeave = false;
    this.attendancepolicydata.BeforeAfterLeave = false;
    this.attendancepolicydata.HFDBeforeAfterLeave = false;
    this.sandwichleave = event.target.checked;
    this.attendancepolicydata.weekoffsandwichLeave = event.target.checked;
  }
  calltoshow(event) {
    if (event.target.value == 'notincludingouthours') {
      this.datashow = true;
    } else {
      this.datashow = false;
    }
  }

  overtimesalarychange(event) {
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  miss_punch(event: any) {
    if (event == '1') {
      this.showMissPunch = true;
    } else {
      this.showMissPunch = false;
      this.seletedmisspunchminutes = null;
    }
  }
}
