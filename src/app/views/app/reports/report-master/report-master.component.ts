import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-report-master',
    templateUrl: './report-master.component.html',
    styleUrls: ['./report-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReportMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  ReportArray: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });

    this.ReportArray = [
      {
        icon: 'iconsminds-optimization',
        label: 'Advance Report',
        menu: 'AdvanceReport',
        to: `${this.adminRoot}/reports/advance_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Asset Report',
        menu: 'AssetReport',
        to: `${this.adminRoot}/reports/asset_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Attendance Register-1',
        menu: 'AttendanceRegister-1',
        to: `${this.adminRoot}/reports/daily_attendance`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Attendance Register-2',
        menu: 'AttendanceRegister-2',
        to: `${this.adminRoot}/reports/daily_attendance_new`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Attendance Register-3',
        menu: 'AttendanceRegister-3',
        to: `${this.adminRoot}/reports/attendance_Register3`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Attendance Register - 4',
        menu: 'AttendanceRegister-4',
        to: `${this.adminRoot}/reports/attendance_Report4`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'CTC Report',
        menu: 'CTCReport',
        to: `${this.adminRoot}/reports/salaryregister`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Consolidated Report',
        menu: 'ConsolidatedReport',
        to: `${this.adminRoot}/reports/consolidated-report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Customer Wise Visit report',
        menu: 'CustomerWiseVisitReport',
        to: `${this.adminRoot}/reports/visit_report_customer`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Deposit Report',
        menu: 'DepositReport',
        to: `${this.adminRoot}/reports/deposit_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'ESIC Challan',
        menu: 'ESICChallan',
        to: `${this.adminRoot}/reports/esic_challan`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'ESIC Report',
        menu: 'ESICReport',
        to: `${this.adminRoot}/reports/esic_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Expense Report',
        menu: 'ExpenseReport',
        to: `${this.adminRoot}/reports/expense_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Increment Report',
        menu: 'IncrementReport',
        to: `${this.adminRoot}/reports/increment-report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Kms Report',
        menu: 'KmsReport',
        to: `${this.adminRoot}/reports/km_report`,
      },

      {
        icon: 'iconsminds-optimization',
        label: 'Leave Application Report',
        menu: 'LeaveApplicationReport',
        to: `${this.adminRoot}/reports/leave-report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Leave Balance Report',
        menu: 'LeavebalanceReport',
        to: `${this.adminRoot}/reports/leave-balance-report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Nda Report',
        menu: 'NdaReport',
        to: `${this.adminRoot}/reports/nda_report`,
      },


      {
        icon: 'iconsminds-optimization',
        label: 'Penalty Report',
        menu: 'PenaltyReport',
        to: `${this.adminRoot}/reports/penalty_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'PF Challan',
        menu: 'PFChallan',
        to: `${this.adminRoot}/reports/pf_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'PF Report',
        menu: 'PFReport',
        to: `${this.adminRoot}/reports/pfreportdata`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'LWF Challan',
        menu: 'LWFChallan',
        to: `${this.adminRoot}/reports/lwf_challan`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Punchin Punchout Report',
        menu: 'PunchinPunchoutReport',
        to: `${this.adminRoot}/reports/punchin_Punchout_Report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Miss Punch Report',
        menu: 'MissPunchReport',
        to: `${this.adminRoot}/reports/miss_punch_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Salary Register',
        menu: 'SalaryRegisterReport',
        to: `${this.adminRoot}/reports/salary-register`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Visit Report',
        menu: 'VisitReport',
        to: `${this.adminRoot}/reports/visitReport`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Visit Report Summary',
        menu: 'VisitSummaryReport',
        to: `${this.adminRoot}/reports/visitReportSummary`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Wages/Salary Register',
        menu: 'WagesSalaryRegister',
        to: `${this.adminRoot}/reports/wages-salary-register`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Hourly-Salary Register ',
        menu: 'HourlySalaryRegister',
        to: `${this.adminRoot}/reports/hourly-salary-register`,
      },
      {
        icon: 'iconsminds-location-2',
        label: 'Tracking Report',
        menu: 'TrackingReport',
        to: `${this.adminRoot}/reports/tracking_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Distinct Locations Tracking Report',
        menu: 'DistinctLoationsTrackingReport',
        to: `${this.adminRoot}/reports/distinct_Locations_Tracking_Report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: '5 Minute Gap Tracking Report',
        menu: 'FiveMinuteGapTrackingReport',
        to: `${this.adminRoot}/reports/5_Minute_Gap_Tracking_Report`,
      },
      {
        icon: 'iconsminds-location-2',
        label: 'LateIn EarlyGo Report',
        menu: 'LateInEarlyByReport',
        to: `${this.adminRoot}/reports/lateCome_earlyGo_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'FY Leave Report',
        menu: 'FYWiseLeaveReport',
        to: `${this.adminRoot}/reports/leave_update_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Leave Balance Summary Report',
        menu: 'LeaveBalanceSummaryReport',
        to: `${this.adminRoot}/reports/leave_balance_summary_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Daily Cost Report',
        menu: 'DailyCostReport',
        to: `${this.adminRoot}/reports/perday_cost_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Bank Statement Report',
        menu: 'BankStatementReport',
        to: `${this.adminRoot}/reports/bankStatementReport`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Daily Hourly Report',
        menu: 'DailyHourlyReport',
        to: `${this.adminRoot}/reports/dailyHourlyReport`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Employee ReportsTo Report',
        menu: 'EmployeeReportsToReport',
        to: `${this.adminRoot}/reports/employee_ReportsTo_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Tally Format Attendance Report',
        menu: 'TallyFormateAttendanceReport',
        to: `${this.adminRoot}/reports/Tale_Attendance_Report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Salary Register With Date Of Pay',
        menu: 'SalaryRegisterWithDateOfPay',
        to: `${this.adminRoot}/reports/salary_register_with_DateOfPay`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Daily In Out Report',
        menu: 'DailyInOutReport',
        to: `${this.adminRoot}/reports/daily_inout_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Monthly Attendance Report',
        menu: 'MonthlyAttendanceReport',
        to: `${this.adminRoot}/reports/monthly_attendance_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Employee Month Wise Salary Report',
        menu: 'EmployeeWiseSalaryReport',
        to: `${this.adminRoot}/reports/employee_month_wise_salary_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Shiftwise Attendance Count Report',
        menu: 'ShiftwiseAttendanceCountReport',
        to: `${this.adminRoot}/reports/shiftwise_attendance_count_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Loan Report',
        menu: 'LoanReport',
        to: `${this.adminRoot}/reports/loan_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Shift & Department Wise Attendance Count Report',
        menu: 'ShiftAndDepartmentWiseAttendanceCountReport',
        to: `${this.adminRoot}/reports/shiftDepartmentwise_attendance_count_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'User Document Expiry  Report',
        menu: 'UserDocumentExpiryReport',
        to: `${this.adminRoot}/reports/UserDocument_Expiry`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Monthly Salary Summary Register',
        menu: 'MonthlySalarySummaryRegister',
        to: `${this.adminRoot}/reports/monthly_salary_summary`,
      },
      {
        icon: 'iconsminds-network',
        label: 'WeekOff Day Work Report',
        menu: 'WeekOffDayWorkReport',
        to: `${this.adminRoot}/reports/weekoff_day_work_Report`,
      },

      {
        icon: 'iconsminds-network',
        label: 'Outdoor Duty Application Report',
        menu: 'OutdoorDutyApplicationReport',
        to: `${this.adminRoot}/reports/outdoor_duty_application_Report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Attendance Timing Report',
        menu: 'AttendanceTimingReport',
        to: `${this.adminRoot}/reports/attendance_timing_report`,
      },

      {
        icon: 'iconsminds-network',
        label: 'Slot Wise Attendance Report',
        menu: 'SlotWiseAttendanceReport',
        to: `${this.adminRoot}/reports/slot_wise_attendance_report`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Short Leave Application Report',
        menu: 'ShortLeaveApplicationReport',
        to: `${this.adminRoot}/reports/short_leave_application_report`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Salary Wages Sheet',
        menu: 'SalaryWagesSheet',
        to: `${this.adminRoot}/reports/wages_sheet`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Service Charges Bill',
        menu: 'ServiceChargesBill',
        to: `${this.adminRoot}/reports/service_charges_bill`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Labour Charges Bill',
        menu: 'LabourChargesBill',
        to: `${this.adminRoot}/reports/labour_charges_bill`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Overtime Sheet With ESIC',
        menu: 'OvertimeSheetWithESIC',
        to: `${this.adminRoot}/reports/ot_report_with_esic`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Salary Summary',
        menu: 'SalarySummary',
        to: `${this.adminRoot}/reports/salarySummary`,
      },

      {
        icon: 'iconsminds-network',
        label: 'Bonus Report',
        menu: 'BonusReport',
        to: `${this.adminRoot}/reports/bonusReport`,
      },

      {
        icon: 'iconsminds-network',
        label: 'Professional Tax Register',
        menu: 'ProfessionalTaxRegister',
        to: `${this.adminRoot}/reports/pt_register`,
      },

      {
        icon: 'iconsminds-network',
        label: 'Attendance Correction Request Report',
        menu: 'AttendanceCorrectionRequestReport',
        to: `${this.adminRoot}/reports/attendanceCorrectionReport`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Expense Claim Report',
        menu: 'ExpenseClaimReport',
        to: `${this.adminRoot}/reports/expenseClaimReport`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Expense Report MARS',
        menu: 'ExpenseReportMARS',
        to: `${this.adminRoot}/reports/expenseReportMARS`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Completed Tenure Report',
        menu: 'CompletedTenureReport',
        to: `${this.adminRoot}/reports/completedTenureReport`,
      },
      {
        icon: 'iconsminds-network',
        label: 'Office Expense Report',
        menu: 'OfficeExpenseReport',
        to: `${this.adminRoot}/reports/officeExpenseReport`,
      },
    ];
  }
}
