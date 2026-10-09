import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryslipComponent } from './salaryslip.component';


const routes: Routes = [
  { path: '', component: SalaryslipComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalarySlipMasterRoutingModule { }
