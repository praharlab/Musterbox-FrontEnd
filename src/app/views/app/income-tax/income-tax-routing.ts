import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListEmployeeInvestmentsComponent } from './employee-investments/list-employee-investments/list-employee-investments.component';
import { AddEmployeeInvestmentsComponent } from './employee-investments/add-employee-investments/add-employee-investments.component';
import { EditEmployeeInvestmentsComponent } from './employee-investments/edit-employee-investments/edit-employee-investments.component';
import { IncomeTaxComponent } from './income-tax.component';
import { IncomeTaxMasterComponent } from './income-tax-master/income-tax-master.component';

const routes: Routes = [
  {
    path: '',
    component: IncomeTaxComponent,
    children: [
      { path: '', redirectTo: 'incometax_master', pathMatch: 'full' },
      { path: 'incometax_master', component: IncomeTaxMasterComponent },

      { path: 'list_emp_investment', component: ListEmployeeInvestmentsComponent },
      { path: 'add_emp_investment', component: AddEmployeeInvestmentsComponent },
      { path: 'edit_emp_investment/:id', component: EditEmployeeInvestmentsComponent },

      { path: 'list_employee_tax_regime', loadChildren: () => import('./employee-tax-regime/employee-tax-regime-master.module').then((m) => m.EmployeeTaxRegimeMasterModule) },

      { path: 'list_my_incometax_regime', loadChildren: () => import('./my-income-tax-regime/my-income-tax-regime-master.module').then((m) => m.MyIncomeTaxRegimeMasterModule) },

      { path: 'incometax_declaration_request', loadChildren: () => import('./income-tax-declaration-request/income-tax-declaration-request-master.module').then((m) => m.IncomeTaxDeclarationRequestMasterModule) },

      {
        path: 'incometax_declaration',
        loadChildren: () => import('./income-tax-declaration/income-tax-declaration.module').then((m) => m.IncomeTaxDeclarationModule),
      },

      {
        path: 'employeeIncomeTaxDeclaration',
        loadChildren: () => import('./employee-income-tax-declaration/employee-income-tax-declaration.module').then((m) => m.EmployeeIncomeTaxDeclarationModule),
      },


      { path: 'monthlyTax_Deductions_Of_employees', loadChildren: () => import('./monthly-tax-deductions-of-employees/monthly-tax-deduction-of-employees-master.module').then((m) => m.MonthlyTaxDeductionOfEmployeesMasterModule) },

      { path: 'form16', loadChildren: () => import('./form16/form16-master.module').then((m) => m.Form16MasterModule) },

      { path: 'employee-declaration-report', loadChildren: () => import('./employee-declaration-report/employee-declaration-report-master.module').then((m) => m.EmployeeDeclarationReportMasterModule) }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeTaxRoutingModule { }
