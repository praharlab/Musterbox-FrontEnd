import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeMonthWiseSalaryReportComponent } from './employee-month-wise-salary-report.component';


const routes: Routes = [
  { path: '', component: EmployeeMonthWiseSalaryReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeMonthWiseSalaryReportMasterRoutingModule { }
