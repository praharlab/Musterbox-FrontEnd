import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceComponent } from './performance.component';


const routes: Routes = [
  {
    path: '',
    component: PerformanceComponent,
    children: [
      { path: '', redirectTo: 'address', pathMatch: 'full'},
      
      { path: 'address', loadChildren: () => import('./address-master/address-master.module').then((m) => m.AddressMasterModule) },
      
      { path: 'experience', loadChildren: () => import('./experience-master/experience-master.module').then((m) => m.ExperienceMasterModule) },

      { path: 'education', loadChildren: () => import('./education-master/education-master.module').then((m) => m.EducationMasterModule) },

      { path: 'family', loadChildren: () => import('./family-master/family-master.module').then((m) => m.FamilyMasterModule) },

      { path: 'reportsTo', loadChildren: () => import('./reports-to-master/reports-to-master.module').then((m) => m.ReportsToMasterModule) },

      { path: 'branch', loadChildren: () => import('./branch-master/branch-master.module').then((m) => m.BranchMasterModule) },
     
      { path: 'department', loadChildren: () => import('./department-master/department-master.module').then((m) => m.DepartmentMasterModule) },

      { path: 'designation', loadChildren: () => import('./designation-master/designation-master.module').then((m) => m.DesignationMasterModule) },
      
      { path: 'shift', loadChildren: () => import('./shift-master/shift-master.module').then((m) => m.ShiftMasterModule) },
      
      { path: 'company-document', loadChildren: () => import('./company-document-master/company-document-master.module').then((m) => m.CompanyDocumentMasterModule) },
      
      { path: 'employee-document', loadChildren: () => import('./employee-document-master/employee-document-master.module').then((m) => m.EmployeeDocumentMasterModule) },
      
      { path: 'attendance-policy', loadChildren: () => import('./attendance-policy-master/attendance-policy-master.module').then((m) => m.AttendancePolicyMasterModule) },
      
      { path: 'weekoff-policy', loadChildren: () => import('../../employee-weekoff-policy/employee-weekoff-policy-master.module').then((m) => m.EmployeeWeekoffPolicyMasterModule) },
      
      { path: 'holiday-policy', loadChildren: () => import('../../employee-holiday-policy/employee-holiday-policy-master.module').then((m) => m.EmployeeHolidayPolicyMasterModule) },
      
      { path: 'short-leave-policy', loadChildren: () => import('../list-emp-short-leave-policy/emp-short-leave-policy-master.module').then((m) => m.EmpShortLeavePolicyMasterModule) },
      
      { path: 'attendance-bonus-policy', loadChildren: () => import('../../employee-attendance-bonus-policy/employee-attendance-bonus-policy-master.module').then((m) => m.EmployeeAttendanceBonusPolicyMasterModule) },
      
      { path: 'food-allowance-policy', loadChildren: () => import('../../employee-foodAllowance-policy/employee-food-allowance-policy-master/employee-food-allowance-policy-master.module').then((m) => m.EmployeeFoodAllowancePolicyMasterModule) },
      
      { path: 'idcard', loadChildren: () => import('../employee-id-card/employee-idcard-master.module').then((m) => m.EmployeeIdcardMasterModule) },
      
      { path: 'anonymous-feedback', loadChildren: () => import('./anonymous-feedback-master/anonymous-feedback-master.module').then((m) => m.AnonymousFeedbackMasterModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeMasterRoutingModule { }

