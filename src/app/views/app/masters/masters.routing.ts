import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MastersComponent } from './masters.component';
import { MasterComponent } from './master/master.component';
import { ListCompanyContactComponent } from './company_contact/list-company-contact/list-company-contact.component';
import { EditEmployeeMasterComponent } from './employee_master/edit-employee-master/edit-employee-master.component';
import { AddCompanyContactComponent } from './company_contact/add-company-contact/add-company-contact.component';
import { EditCompanyContactComponent } from './company_contact/edit-company-contact/edit-company-contact.component';
import { ListEmployeeMasterComponent } from './employee_master/list-employee-master/list-employee-master.component';
import { DeleteEmployeeMasterComponent } from './employee_master/delete-employee-master/delete-employee-master.component';
import { DeactiveEmployeeMasterComponent } from './employee_master/deactive-employee-master/deactive-employee-master.component';
import { BulkInitialLeaveOpeingBalanceComponent } from './bulk-initial-leave-opeing-balance/bulk-initial-leave-opeing-balance.component';
import { BulkUpdateBranchJobComponent } from './bulk-update-branch-job/bulk-update-branch-job.component';
const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      { path: '', redirectTo: 'master', pathMatch: 'full' },

      // Master(org)
      { path: 'master', component: MasterComponent },
      {
        path: 'company_master',
        loadChildren: () =>
          import('./company_master/company-master.module').then((m) => m.CompanyMasterModule),
      },

      {
        path: 'branch',
        loadChildren: () =>
          import('./branch_master/branch-master.module').then((m) => m.BranchMasterModule),
      },

      {
        path: 'department',
        loadChildren: () =>
          import('./department/department-master.module').then((m) => m.DepartmentMasterModule),
      },
      {
        path: 'site',
        loadChildren: () =>
          import('./site-master/site-master.module').then((m) => m.SiteMasterModule),
      },

      {
        path: 'designation',
        loadChildren: () =>
          import('./designation/designation-master.module').then((m) => m.DesignationMasterModule),
      },

      {
        path: 'leavetypes',
        loadChildren: () =>
          import('./leaveTypes/leave-type-master.module').then((m) => m.LeaveTypeMasterModule),
      },

      //Master(Payroll)
      { path: 'employee', component: ListEmployeeMasterComponent },
      { path: 'edit_employee', component: EditEmployeeMasterComponent },
      { path: 'delete_employee', component: DeleteEmployeeMasterComponent },
      { path: 'deactive_employee', component: DeactiveEmployeeMasterComponent },

      { path: 'company_contact', component: ListCompanyContactComponent },
      { path: 'add_company_contact', component: AddCompanyContactComponent },
      { path: 'edit_company_contact', component: EditCompanyContactComponent },
      { path: 'bulkUpdateBranchJob', component: BulkUpdateBranchJobComponent },

      {
        path: 'employee_leave_policy',
        loadChildren: () =>
          import('./employeeLeavePolicy/emp-leave-policy-master.module').then(
            (m) => m.EmpLeavePolicyMasterModule,
          ),
      },

      {
        path: 'attendance_policy',
        loadChildren: () =>
          import('./attendancepolicy/attendance-policy-master.module').then(
            (m) => m.AttendancePolicyMasterModule,
          ),
      },

      {
        path: 'lateComeEarlyGo',
        loadChildren: () =>
          import('./late_early_policy/late-early-policy-master.module').then(
            (m) => m.LateEarlyPolicyMasterModule,
          ),
      },

      {
        path: 'short_leave_policy',
        loadChildren: () =>
          import('./short-leave-policy/short-leave-policy-master.module').then(
            (m) => m.ShortLeavePolicyMasterModule,
          ),
      },

      {
        path: 'salary_policy',
        loadChildren: () =>
          import('./salarypolicy/salary-policy-master.module').then(
            (m) => m.SalaryPolicyMasterModule,
          ),
      },

      {
        path: 'grade',
        loadChildren: () =>
          import('./grade/salary-grade-master.module').then((m) => m.SalaryGradeMasterModule),
      },

      {
        path: 'shift',
        loadChildren: () => import('./shift/shift-master.module').then((m) => m.ShiftMasterModule),
      },

      {
        path: 'weekoffpolicy',
        loadChildren: () =>
          import('./weekoffpolicy/weekoff-policy-master.module').then(
            (m) => m.WeekoffPolicyMasterModule,
          ),
      },

      {
        path: 'holidayPolicy',
        loadChildren: () =>
          import('./holidy_policy/holiday-policy-master.module').then(
            (m) => m.HolidayPolicyMasterModule,
          ),
      },

      {
        path: 'hr_field_salary',
        loadChildren: () =>
          import('./hr_salary_fields/hr-salary-fields-master.module').then(
            (m) => m.HrSalaryFieldsMasterModule,
          ),
      },

      {
        path: 'employee_tracking',
        loadChildren: () =>
          import('./employee-tracking/employee-tracking-master.module').then(
            (m) => m.EmployeeTrackingMasterModule,
          ),
      },

      {
        path: 'nda_category',
        loadChildren: () =>
          import('./nda_category/nda-category-master.module').then(
            (m) => m.NdaCategoryMasterModule,
          ),
      },

      {
        path: 'bulk_add_shift',
        loadChildren: () =>
          import('./bulk-add-shift/bulk-shift-master.module').then((m) => m.BulkShiftMasterModule),
      },

      {
        path: 'bulk_add_weekoff',
        loadChildren: () =>
          import('./bulk-add-weekoffpolicy/bulk-weekoff-policy-master.module').then(
            (m) => m.BulkWeekoffPolicyMasterModule,
          ),
      },

      {
        path: 'bulk_add_holiday',
        loadChildren: () =>
          import('./bulk-add-holidaypolicy/bulk-holiday-policy-master.module').then(
            (m) => m.BulkHolidayPolicyMasterModule,
          ),
      },

      {
        path: 'bulk__attendance__policy',
        loadChildren: () =>
          import('./bulk-add-attendancepolicy/bulk-attendance-policy-master.module').then(
            (m) => m.BulkAttendancePolicyMasterModule,
          ),
      },

      {
        path: 'bulk__salary__policy',
        loadChildren: () =>
          import('./bulk-add-salarypolicy/bulk-salary-policy-master.module').then(
            (m) => m.BulkSalaryPolicyMasterModule,
          ),
      },

      {
        path: 'toolkit',
        loadChildren: () =>
          import('./toolkit/toolkit-master.module').then((m) => m.ToolkitMasterModule),
      },

      {
        path: 'clearance-and-exit',
        loadChildren: () =>
          import('./resignation_process/resignation-process-master.module').then(
            (m) => m.ResignationProcessMasterModule,
          ),
      },

      {
        path: 'list-incentivetype',
        loadChildren: () =>
          import('./incentivetype/incentive-type-master.module').then(
            (m) => m.IncentiveTypeMasterModule,
          ),
      },

      //Master(Finance)
      {
        path: 'expense_category',
        loadChildren: () =>
          import('./expense_category/expense-category-master.module').then(
            (m) => m.ExpenseCategoryMasterModule,
          ),
      },

      {
        path: 'expense_head',
        loadChildren: () =>
          import('./expense_head/expense-head-master.module').then(
            (m) => m.ExpenseHeadMasterModule,
          ),
      },

      {
        path: 'depositCategory',
        loadChildren: () =>
          import('./deposit_category/deposit-category-master.module').then(
            (m) => m.DepositCategoryMasterModule,
          ),
      },

      {
        path: 'penalty',
        loadChildren: () =>
          import('./penalty/penalty-master.module').then((m) => m.PenaltyMasterModule),
      },

      //Master(Visit)
      {
        path: 'visit_field_customize',
        loadChildren: () =>
          import('./visit-customize-field/visit-customize-field-master.module').then(
            (m) => m.VisitCustomizeFieldMasterModule,
          ),
      },

      {
        path: 'visit_purpose',
        loadChildren: () =>
          import('./visit_purpose/visit-purpose-master.module').then(
            (m) => m.VisitPurposeMasterModule,
          ),
      },

      {
        path: 'visit_report_master',
        loadChildren: () =>
          import('./visit_report_master/visit-report-master.module').then(
            (m) => m.VisitReportMasterModule,
          ),
      },

      {
        path: 'visit_report_customize',
        loadChildren: () =>
          import('./visit-report-customize/visit-report-customize-master.module').then(
            (m) => m.VisitReportCustomizeMasterModule,
          ),
      },

      {
        path: 'product',
        loadChildren: () =>
          import('./product/product-master.module').then((m) => m.ProductMasterModule),
      },

      {
        path: 'customer',
        loadChildren: () =>
          import('./customer/customer-master.module').then((m) => m.CustomerMasterModule),
      },

      //Master(Asset)
      {
        path: 'asset_category',
        loadChildren: () =>
          import('./assetcategory/asset-category-master.module').then(
            (m) => m.AssetCategoryMasterModule,
          ),
      },

      {
        path: 'assetMaster',
        loadChildren: () =>
          import('./assetMaster/asset-master.module').then((m) => m.AssetMasterModule),
      },

      // Master(Gatepass)
      {
        path: 'meetingPlace',
        loadChildren: () =>
          import('./meetingPlace/meeting-place-master.module').then(
            (m) => m.MeetingPlaceMasterModule,
          ),
      },

      {
        path: 'visitor',
        loadChildren: () =>
          import('./visitor/visitor-master.module').then((m) => m.VisitorMasterModule),
      },

      {
        path: 'workingLocation',
        loadChildren: () =>
          import('./workingLocation/working-location-master.module').then(
            (m) => m.WorkingLocationMasterModule,
          ),
      },

      {
        path: 'bulk_addworkingLocation',
        loadChildren: () =>
          import('./bulk-add-working-location/bulk-work-location-master.module').then(
            (m) => m.BulkWorkLocationMasterModule,
          ),
      },

      {
        path: 'bulk__lateinearlygo__policy',
        loadChildren: () =>
          import('./bulk-add-employee-late-early-policy/bulk-late-early-policy-master.module').then(
            (m) => m.BulkLateEarlyPolicyMasterModule,
          ),
      },

      {
        path: 'division',
        loadChildren: () =>
          import('./division/division-master.module').then((m) => m.DivisionMasterModule),
      },

      {
        path: 'working_area',
        loadChildren: () =>
          import('./working-area/working-area-master.module').then(
            (m) => m.WorkingAreaMasterModule,
          ),
      },

      {
        path: 'bulk_addEmployeeDivision',
        loadChildren: () =>
          import('./bulk-add-employee-division/bulk-emp-division-master.module').then(
            (m) => m.BulkEmpDivisionMasterModule,
          ),
      },

      {
        path: 'bulk_addEmployeeWorkingArea',
        loadChildren: () =>
          import('./bulk-add-employee-working-area/bulk-emp-working-area-master.module').then(
            (m) => m.BulkEmpWorkingAreaMasterModule,
          ),
      },

      {
        path: 'cotractor',
        loadChildren: () =>
          import('./contractor/contractor-master.module').then((m) => m.ContractorMasterModule),
      },

      {
        path: 'attendance_bonus_policy',
        loadChildren: () =>
          import('./attendance_bonus_policy/attendance-bonus-policy-master.module').then(
            (m) => m.AttendanceBonusPolicyMasterModule,
          ),
      },

      {
        path: 'bulk_attendanceBonus_policy',
        loadChildren: () =>
          import(
            './bulk-add-attendance-bonus-policy/bulk-attendance-bonus-policy-master.module'
          ).then((m) => m.BulkAttendanceBonusPolicyMasterModule),
      },

      {
        path: 'foodAllowancePolicy',
        loadChildren: () =>
          import('./foodAllowancePolicy/food-allowance-policy-master.module').then(
            (m) => m.FoodAllowancePolicyMasterModule,
          ),
      },

      {
        path: 'bulk_addEmployee_foodAllowancePolicy',
        loadChildren: () =>
          import(
            './bulk-add-employee-food-allowance-policy/bulk-emp-food-allowance-master.module'
          ).then((m) => m.BulkEmpFoodAllowanceMasterModule),
      },

      {
        path: 'bulk_addEmpLeavePolicy',
        loadChildren: () =>
          import('./bulk-add-emp-leave-policy/bulk-emp-leave-policy-master.module').then(
            (m) => m.BulkEmpLeavePolicyMasterModule,
          ),
      },

      {
        path: 'Profile_photo_lockunlock',
        loadChildren: () =>
          import('./profilephotolockunlock/profile-photo-lock-unlock-master.module').then(
            (m) => m.ProfilePhotoLockUnlockMasterModule,
          ),
      },

      {
        path: 'userIp',
        loadChildren: () =>
          import('./userIp/user-ip-master.module').then((m) => m.UserIpMasterModule),
      },

      {
        path: 'joiningDocumentType',
        loadChildren: () =>
          import('./joining-Document-Type/joining-doc-type-master.module').then(
            (m) => m.JoiningDocTypeMasterModule,
          ),
      },

      {
        path: 'import_Initial_Leave_Opening_Balance',
        component: BulkInitialLeaveOpeingBalanceComponent,
      },

      {
        path: 'designationWiseDocument',
        loadChildren: () =>
          import('./designationWiseDocument/designation-wise-doc-master.module').then(
            (m) => m.DesignationWiseDocMasterModule,
          ),
      },

      {
        path: 'bulk-short-leave-policy',
        loadChildren: () =>
          import('./bulk-short-leave-policy/bulk-short-leave-policy.module').then(
            (m) => m.BulkShortLeavePolicyModule,
          ),
      },

      {
        path: 'jobRoleClassification',
        loadChildren: () =>
          import('./job-role-classification/jobRoleClassification-master.module').then(
            (m) => m.JobRoleClassificationMasterModule,
          ),
      },
      {
        path: 'service_charge',
        loadChildren: () =>
          import('./service-charge/service-charge.module').then((m) => m.ServiceChargeModule),
      },

      {
        path: 'bulk_employee_skill_category',
        loadChildren: () =>
          import('./bulk-add-employee-skill-category/bulk-add-employee-skill-category.module').then(
            (m) => m.BulkAddEmployeeSkillCategoryModule,
          ),
      },

      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then((m) => m.ProjectModule),
      },

      {
        path: 'attendaceCorrectionReason',
        loadChildren: () =>
          import('./attendace-correction-reason/attendace-correction-reason.module').then(
            (m) => m.AttendaceCorrectionReasonModule,
          ),
      },

      {
        path: 'bulk_addProject',
        loadChildren: () =>
          import('./bulk-add-employee-project/bulk-add-employee-project.module').then(
            (m) => m.BulkAddEmployeeProjectModule,
          ),
      },

      {
        path: 'bonus_policy',
        loadChildren: () =>
          import('./bonus-policy/bonus-policy.module').then((m) => m.BonusPolicyModule),
      },

      {
        path: 'bulk_employee_bonus_policy',
        loadChildren: () =>
          import('./bulk-add-employee-bonus-policy/bulk-add-employee-bonus-policy.module').then(
            (m) => m.BulkAddEmployeeBonusPolicyModule,
          ),
      },

      {
        path: 'bankStatementFormat',
        loadChildren: () =>
          import('./bank-statement-format/bank-statement-format.module').then(
            (m) => m.BankStatementFormatModule,
          ),
      },

      {
        path: 'officeExpenseCategory',
        loadChildren: () =>
          import('./office-expense-category-master/office-expense-category-master.module').then(
            (m) => m.OfficeExpenseCategoryMasterModule,
          ),
      },

      {
        path: 'officeExpenseHead',
        loadChildren: () =>
          import('./office-expense-head-master/office-expense-head-master.module').then(
            (m) => m.OfficeExpenseHeadMasterModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}
