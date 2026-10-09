import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryRegisterReportComponent } from './salary-register-report.component';


const routes: Routes = [
  { path: '', component: SalaryRegisterReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryRegisterReportMasterRoutingModule { }
