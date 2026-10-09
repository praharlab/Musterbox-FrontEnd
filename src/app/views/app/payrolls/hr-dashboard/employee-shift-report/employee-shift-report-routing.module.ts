import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeShiftReportComponent } from './employee-shift-report.component';


const routes: Routes = [{
  path: '',
  component: EmployeeShiftReportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeShiftReportRoutingModule { }
