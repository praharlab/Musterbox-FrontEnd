import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeReportstoReportComponent } from './employee-reportsto-report.component';


const routes: Routes = [
  { path: '', component: EmployeeReportstoReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeReportstoReportMasterRoutingModule { }
