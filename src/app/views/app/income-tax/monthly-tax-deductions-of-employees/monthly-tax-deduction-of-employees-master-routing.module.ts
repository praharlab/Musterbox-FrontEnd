import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlyTaxDeductionsOfEmployeesComponent } from './monthly-tax-deductions-of-employees.component';


const routes: Routes = [
  { path: '', component: MonthlyTaxDeductionsOfEmployeesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyTaxDeductionOfEmployeesMasterRoutingModule { }
