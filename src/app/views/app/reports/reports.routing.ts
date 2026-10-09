import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { HourlySalaryRegisterComponent } from './hourly-salary-register/hourly-salary-register.component';
import { ReportMasterComponent } from './report-master/report-master.component';
import { SlotWiseAttendanceReportComponent } from './slot-wise-attendance-report/slot-wise-attendance-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: '', redirectTo: 'report_master', pathMatch: 'full' },
      { path: 'hourly-salary-register', component: HourlySalaryRegisterComponent },
      { path: 'report_master', component: ReportMasterComponent },
      {
        path: 'daily_attendance_new',
        loadChildren: () =>
          import('./dailyattendancereport-new/daily-attendance-report-new-master.module').then(
            (m) => m.DailyAttendanceReportNewMasterModule,
          ),
      },

      {
        path: 'daily_attendance',
        loadChildren: () =>
          import('./dailyattendancereport/daily-attendance-report-master.module').then(
            (m) => m.DailyAttendanceReportMasterModule,
          ),
      },

      {
        path: 'asset_report',
        loadChildren: () =>
          import('./asset-report/asset-report-master.module').then(
            (m) => m.AssetReportMasterModule,
          ),
      },

      {
        path: 'advance_report',
        loadChildren: () =>
          import('./advance-report/advance-report-master.module').then(
            (m) => m.AdvanceReportMasterModule,
          ),
      },

      {
        path: 'salaryregister',
        loadChildren: () =>
          import('./salary-register-report/salary-register-report-master.module').then(
            (m) => m.SalaryRegisterReportMasterModule,
          ),
      },

      {
        path: 'consolidated-report',
        loadChildren: () =>
          import('./consolidated-report/consolidated-report-master.module').then(
            (m) => m.ConsolidatedReportMasterModule,
          ),
      },

      {
        path: 'visit_report_customer',
        loadChildren: () =>
          import('./visit-report-customer/visit-report-customer-master.module').then(
            (m) => m.VisitReportCustomerMasterModule,
          ),
      },

      {
        path: 'deposit_report',
        loadChildren: () =>
          import('./depositreport/depositreport-master.module').then(
            (m) => m.DepositreportMasterModule,
          ),
      },

      {
        path: 'esic_challan',
        loadChildren: () =>
          import('./esic-challan/esic-challan-master.module').then(
            (m) => m.EsicChallanMasterModule,
          ),
      },

      {
        path: 'esic_report',
        loadChildren: () =>
          import('./esic-report/esic-report-master.module').then((m) => m.EsicReportMasterModule),
      },

      {
        path: 'expense_report',
        loadChildren: () =>
          import('./expense-report/expense-report-master.module').then(
            (m) => m.ExpenseReportMasterModule,
          ),
      },

      {
        path: 'increment-report',
        loadChildren: () =>
          import('./increment-report/increment-report-master.module').then(
            (m) => m.IncrementReportMasterModule,
          ),
      },

      {
        path: 'km_report',
        loadChildren: () =>
          import('./km-report/km-report-master.module').then((m) => m.KmReportMasterModule),
      },

      {
        path: 'leave-report',
        loadChildren: () =>
          import('./leave-report/leave-report-master.module').then(
            (m) => m.LeaveReportMasterModule,
          ),
      },

      {
        path: 'leave-balance-report',
        loadChildren: () =>
          import('./leave-balance-report/leave-balance-report-master.module').then(
            (m) => m.LeaveBalanceReportMasterModule,
          ),
      },

      {
        path: 'nda_report',
        loadChildren: () =>
          import('./nda-report/nda-report-master.module').then((m) => m.NdaReportMasterModule),
      },

      {
        path: 'punchin_Punchout_Report',
        loadChildren: () =>
          import('./attendance-report/attendance-report-master.module').then(
            (m) => m.AttendanceReportMasterModule,
          ),
      },

      {
        path: 'pfreportdata',
        loadChildren: () =>
          import('./pf-report-data/pf-report-data-master.module').then(
            (m) => m.PfReportDataMasterModule,
          ),
      },
      {
        path: 'salary-register',
        loadChildren: () =>
          import('./salary-register/salary-register-master.module').then(
            (m) => m.SalaryRegisterMasterModule,
          ),
      },

      {
        path: 'visitReport',
        loadChildren: () =>
          import('./visit-report/visit-report-master.module').then(
            (m) => m.VisitReportMasterModule,
          ),
      },

      {
        path: 'visitReportSummary',
        loadChildren: () =>
          import('./visit-report-summary/visit-report-summary-master.module').then(
            (m) => m.VisitReportSummaryMasterModule,
          ),
      },

      {
        path: 'wages-salary-register',
        loadChildren: () =>
          import('./wages-salary-register/wages-salary-register-master.module').then(
            (m) => m.WagesSalaryRegisterMasterModule,
          ),
      },

      {
        path: 'hourly-salary-register',
        loadChildren: () =>
          import('./hourly-salary-register/hourly-salary-register-master.module').then(
            (m) => m.HourlySalaryRegisterMasterModule,
          ),
      },

      {
        path: 'penalty_report',
        loadChildren: () =>
          import('./penalty-report/penalty-report-master.module').then(
            (m) => m.PenaltyReportMasterModule,
          ),
      },

      {
        path: 'pf_report',
        loadChildren: () =>
          import('./pf-report/pf-report-master.module').then((m) => m.PfReportMasterModule),
      },

      {
        path: 'tracking_report',
        loadChildren: () =>
          import('./tracking-report/tracking-report-master.module').then(
            (m) => m.TrackingReportMasterModule,
          ),
      },

      {
        path: 'lateCome_earlyGo_report',
        loadChildren: () =>
          import('./lateearlyreport/late-early-report-master.module').then(
            (m) => m.LateEarlyReportMasterModule,
          ),
      },

      {
        path: 'leave_update_report',
        loadChildren: () =>
          import('./leave-update-report/leave-update-report-master.module').then(
            (m) => m.LeaveUpdateReportMasterModule,
          ),
      },

      {
        path: 'leave_balance_summary_report',
        loadChildren: () =>
          import('./leave-balance-summary-report/leave-balance-summary-report-master.module').then(
            (m) => m.LeaveBalanceSummaryReportMasterModule,
          ),
      },

      {
        path: 'perday_cost_report',
        loadChildren: () =>
          import('./perday-cost-report/perday-cost-report-master.module').then(
            (m) => m.PerdayCostReportMasterModule,
          ),
      },

      {
        path: 'bankStatementReport',
        loadChildren: () =>
          import('./bank-report/bank-report-master.module').then((m) => m.BankReportMasterModule),
      },

      {
        path: 'dailyHourlyReport',
        loadChildren: () =>
          import('./daily-hourly-report/daily-hourly-report-master.module').then(
            (m) => m.DailyHourlyReportMasterModule,
          ),
      },

      {
        path: 'distinct_Locations_Tracking_Report',
        loadChildren: () =>
          import(
            './distinct-locations-tracking-report/distinct-locationstracking-report-master.module'
          ).then((m) => m.DistinctLocationstrackingReportMasterModule),
      },

      {
        path: '5_Minute_Gap_Tracking_Report',
        loadChildren: () =>
          import(
            './five-minute-gap-tracking-report/five-minute-gap-tracking-report-master.module'
          ).then((m) => m.FiveMinuteGapTrackingReportMasterModule),
      },

      {
        path: 'employee_ReportsTo_report',
        loadChildren: () =>
          import('./employee-reportsto-report/employee-reportsto-report-master.module').then(
            (m) => m.EmployeeReportstoReportMasterModule,
          ),
      },

      {
        path: 'Tale_Attendance_Report',
        loadChildren: () =>
          import('./tale-attendance-report/tale-attendance-report-master.module').then(
            (m) => m.TaleAttendanceReportMasterModule,
          ),
      },

      {
        path: 'salary_register_with_DateOfPay',
        loadChildren: () =>
          import(
            './salary-register-with-date-of-pay/salary-register-with-date-of-pay-master.module'
          ).then((m) => m.SalaryRegisterWithDateOfPayMasterModule),
      },

      {
        path: 'daily_inout_report',
        loadChildren: () =>
          import('./daily-inout-report/daily-inout-report-master.module').then(
            (m) => m.DailyInoutReportMasterModule,
          ),
      },

      {
        path: 'employee_month_wise_salary_report',
        loadChildren: () =>
          import(
            './employee-month-wise-salary-report/employee-month-wise-salary-report-master.module'
          ).then((m) => m.EmployeeMonthWiseSalaryReportMasterModule),
      },

      {
        path: 'monthly_attendance_report',
        loadChildren: () =>
          import('./monthly-attendance-report/monthly-attendance-report-master.module').then(
            (m) => m.MonthlyAttendanceReportMasterModule,
          ),
      },
      {
        path: 'shiftwise_attendance_count_report',
        loadChildren: () =>
          import(
            './daily-attendance-count-departmentwise/daily-attendance-count-departmentwise-master.module'
          ).then((m) => m.DailyAttendanceCountDepartmentwiseMasterModule),
      },

      {
        path: 'loan_report',
        loadChildren: () =>
          import('./loan-report/loan-report-master.module').then((m) => m.LoanReportMasterModule),
      },

      {
        path: 'shiftDepartmentwise_attendance_count_report',
        loadChildren: () =>
          import(
            './daily-attendance-count-shift-departmentwise-component/daily-attendance-count-shift-departmentwise-component-master.module'
          ).then((m) => m.DailyAttendanceCountShiftDepartmentwiseComponentMasterModule),
      },

      {
        path: 'UserDocument_Expiry',
        loadChildren: () =>
          import('./user-document-expiry/user-document-expiry-master.module').then(
            (m) => m.UserDocumentExpiryMasterModule,
          ),
      },
      {
        path: 'attendance_Register3',
        loadChildren: () =>
          import('./attendace-register3/attendance-register3-master.module').then(
            (m) => m.AttendanceRegister3MasterModule,
          ),
      },
      {
        path: 'attendance_Report4',
        loadChildren: () =>
          import('./attendance-report4/attendance-report4-master.module').then(
            (m) => m.AttendanceReport4MasterModule,
          ),
      },
      {
        path: 'monthly_salary_summary',
        loadChildren: () =>
          import(
            './monthly-salary-summary-report/monthly-salary-summary-report-master.module'
          ).then((m) => m.MonthlySalarySummaryReportMasterModule),
      },
      {
        path: 'outdoor_duty_application_Report',
        loadChildren: () =>
          import(
            './outdoor-duty-application-report/outdoor-duty-application-report-master.module'
          ).then((m) => m.OutdoorDutyApplicationReportMasterModule),
      },

      {
        path: 'weekoff_day_work_Report',
        loadChildren: () =>
          import('./weekoff-day-work-report/weekoff-day-work-report-master.module').then(
            (m) => m.WeekoffDayWorkReportMasterModule,
          ),
      },

      { path: 'slot_wise_attendance_report', component: SlotWiseAttendanceReportComponent },

      {
        path: 'attendance_timing_report',
        loadChildren: () =>
          import('./attendance-timing-report/attendance-timing-report-master.module').then(
            (m) => m.AttendanceTimingReportMasterModule,
          ),
      },

      {
        path: 'short_leave_application_report',
        loadChildren: () =>
          import('./short-leave-application-report/short-leave-application-report.module').then(
            (m) => m.ShortLeaveApplicationReportModule,
          ),
      },
      {
        path: 'wages_sheet',
        loadChildren: () =>
          import('./wages-sheet/wages-sheet.module').then((m) => m.WagesSheetModule),
      },
      {
        path: 'lwf_challan',
        loadChildren: () =>
          import('./lwf-challan/lwf-challan.module').then((m) => m.LwfChallanModule),
      },
      {
        path: 'service_charges_bill',
        loadChildren: () =>
          import('./service-charges-bill/service-charges-bill.module').then(
            (m) => m.ServiceChargesBillModule,
          ),
      },
      {
        path: 'service_charges_bill',
        loadChildren: () =>
          import('./service-charges-bill/service-charges-bill.module').then(
            (m) => m.ServiceChargesBillModule,
          ),
      },
      {
        path: 'labour_charges_bill',
        loadChildren: () =>
          import('./labour-bill/labour-bill.module').then((m) => m.LabourBillModule),
      },
      {
        path: 'ot_report_with_esic',
        loadChildren: () =>
          import('./ot-report-with-esic/ot-report-with-esic.module').then(
            (m) => m.OtReportWithEsicModule,
          ),
      },
      {
        path: 'miss_punch_report',
        loadChildren: () =>
          import('./miss-punch-report/miss-punch-report.module').then(
            (m) => m.MissPunchReportModule,
          ),
      },

      {
        path: 'salarySummary',
        loadChildren: () =>
          import('./salary-summary/salary-summary.module').then((m) => m.SalarySummaryModule),
      },
      {
        path: 'bonusReport',
        loadChildren: () =>
          import('./bonus-report/bonus-report.module').then((m) => m.BonusReportModule),
      },
      {
        path: 'pt_register',
        loadChildren: () =>
          import('./professional-tax-register/professional-tax-register.module').then(
            (m) => m.ProfessionalTaxRegisterModule,
          ),
      },

      {
        path: 'attendanceCorrectionReport',
        loadChildren: () =>
          import('./attendance-correction-report/attendance-correction-report.module').then(
            (m) => m.AttendanceCorrectionReportModule,
          ),
      },

      {
        path: 'expenseClaimReport',
        loadChildren: () =>
          import('./expense-claim-report/expense-claim-report.module').then(
            (m) => m.ExpenseClaimReportModule,
          ),
      },

      {
        path: 'expenseReportMARS',
        loadChildren: () =>
          import('./expense-report-mars/expense-report-mars.module').then(
            (m) => m.ExpenseReportMarsModule,
          ),
      },
      {
        path: 'completedTenureReport',
        loadChildren: () =>
          import('./completed-tenure-report/completed-tenure-report.module').then(
            (m) => m.CompletedTenureReportModule,
          ),
      },

      { path: 'officeExpenseReport', loadChildren: () => import('./office-expense-report/office-expense-report.module').then((m) => m.OfficeExpenseReportModule) }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule { }
