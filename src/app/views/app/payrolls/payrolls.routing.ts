import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollsComponent } from './payrolls.component';
import { PayrollMasterComponent } from './payroll-master/payroll-master.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
// import { CompensatoryOffAuthorizationRequestComponent } from './compensatory-off-authorization-request/compensatory-off-authorization-request.component';
// import { MyCompensatoryOffComponent } from './my-compensatory-off/my-compensatory-off.component';
import { ListEmployeeStatusComponent } from './list-employee-status/list-employee-status.component';
import { ListEmployeePunchInPunchOutComponent } from './list-employee-punch-in-punch-out/list-employee-punch-in-punch-out.component';

const routes: Routes = [
  {
    path: '',
    component: PayrollsComponent,
    children: [
      { path: '', redirectTo: 'payroll_master', pathMatch: 'full' },
      { path: 'payroll_master', component: PayrollMasterComponent },

      { path: 'salaryslip', loadChildren: () => import('./salaryslip/salary-slip-master.module').then((m) => m.SalarySlipMasterModule) },

      { path: 'my_salary', loadChildren: () => import('./my-salary/my-salary-master.module').then((m) => m.MySalaryMasterModule) },
      
      { path: 'my-pay-slip', loadChildren: () => import('./my-pay-slip/my-pay-slip.module').then((m) => m.MyPaySlipModule) },
      { path: 'datewiseAttendancePolicy', loadChildren: () => import('./datewiseAttendacePolicy/datewise-attendance-policy-master.module').then((m) => m.DatewiseAttendancePolicyMasterModule) },

      { path: 'announcement', loadChildren: () => import('./announcement/announcement-master.module').then((m) => m.AnnouncementMasterModule) },

      { path: 'hr-dashboard', loadChildren: () => import('./hr-dashboard/hr-dashboard.module').then((m) => m.HrDashboardModule) },

      { path: 'employee_list', component: EmployeeListComponent },

      { path: 'employee-policy', loadChildren: () => import('./employee-policy/employee-policy-master.module').then((m) => m.EmployeePolicyMasterModule) },

      { path: 'employee_nda', loadChildren: () => import('./employee_nda/employee-nda-master.module').then((m) => m.EmployeeNdaMasterModule) },

      { path: 'toolkit', loadChildren: () => import('../masters/toolkit/toolkit-master.module').then((m) => m.ToolkitMasterModule) },

      { path: 'id_card', loadChildren: () => import('./list-id-card/list-id-card-master.module').then((m) => m.ListIdCardMasterModule) },

      { path: 'list_employee_accident', loadChildren: () => import('./Employee-Accident/employee-accident-master.module').then((m) => m.EmployeeAccidentMasterModule) },

      { path: 'attendancecal', loadChildren: () => import('./attendanceCal/attendance-cal-master.module').then((m) => m.AttendanceCalMasterModule) },

      { path: 'manage_panelty', loadChildren: () => import('./manage-panelty/manage-panelty-master.module').then((m) => m.ManagePaneltyMasterModule) },

      { path: 'manage_coff', loadChildren: () => import('./manage-coff/manage-coff-master.module').then((m) => m.ManageCoffMasterModule) },

      { path: 'list-employeeincentive', loadChildren: () => import('./employeeincentive/employee-incentive-master.module').then((m) => m.EmployeeIncentiveMasterModule) },

      { path: 'add_leave_balance', loadChildren: () => import('./add-leave-balance/add-leave-balance-master.module').then((m) => m.AddLeaveBalanceMasterModule) },

      { path: 'e_mail_salary_slip', loadChildren: () => import('./e-mail-salary-slip/e-mail-salary-slip-master.module').then((m) => m.EMailSalarySlipMasterModule) },

      { path: 'bulk_salarySlip_download', loadChildren: () => import('./bulk-slary-slip-download/bulk-salary-slip-download-master.module').then((m) => m.BulkSalarySlipDownloadMasterModule) },

      { path: 'previous_salary', loadChildren: () => import('./previous-salary/previous-salary-master.module').then((m) => m.PreviousSalaryMasterModule) },

      { path: 'listJoiningRequestform', loadChildren: () => import('./employeeJoiningRequest/employee-joining-request-master.module').then((m) => m.EmployeeJoiningRequestMasterModule) },

      { path: 'listJoiningRequest', loadChildren: () => import('./employeeJoiningRequest/listjoining-request/list-joining-request-master.module').then((m) => m.ListJoiningRequestMasterModule) },

      { path: 'weekoff_shuffle', loadChildren: () => import('./week-off-shuffle/week-off-shuffle-master.module').then((m) => m.WeekOffShuffleMasterModule) },
      
      { path: 'employee-salary-structure', loadChildren: () => import('./employee-salary-structure/employee-salary-structure.module').then((m) => m.EmployeeSalaryStructureModule) },

      { path: 'extradays', loadChildren: () => import('./extra-days-master/extra-days-master.module').then((m) => m.ExtraDaysMasterModule) },

      { path: 'manage-leave-balance', loadChildren: () => import('./manage-leave-balance-master/manage-leave-balance-master.module').then((m) => m.ManageLeaveBalanceMasterModule) },

      { path: 'employee_status',component:ListEmployeeStatusComponent},
      { path: 'employee_punch_in_out',component:ListEmployeePunchInPunchOutComponent},
      { path: 'leaveEncashment', loadChildren: () => import('./leave-encashment/leave-encashment.module').then((m) => m.LeaveEncashmentModule) },
      
      { path: 'fnf', loadChildren: () => import('./fnf/list-fnf/list-fnf.module').then((m) => m.ListFnfModule) },

      { path: 'employee_bonus', loadChildren: () => import('./employee-bonus/employee-bonus.module').then((m) => m.EmployeeBonusModule) },

      { path: 'empBonusPayment', loadChildren: () => import('./emp-bonus-payment/emp-bonus-payment.module').then((m) => m.EmpBonusPaymentModule) },

      { path: 'paySlipGenerator', loadChildren: () => import('./pay-slip-generator/pay-slip-generator.module').then((m) => m.PaySlipGeneratorModule) },

      { path: 'customizeProfile', loadChildren: () => import('./customize-profile/customize-profile.module').then((m) => m.CustomizeProfileModule) },

      { path: 'monthlyAttendanceEntry', loadChildren: () => import('./monthly-attendance-entry/monthly-attendance-entry.module').then((m) => m.MonthlyAttendanceEntryModule) },

      { path: 'minimumWagesMaster', loadChildren: () => import('./minimum-wages-master/minimum-wages-master.module').then((m) => m.MinimumWagesMasterModule) }


    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollsRoutingModule { }
