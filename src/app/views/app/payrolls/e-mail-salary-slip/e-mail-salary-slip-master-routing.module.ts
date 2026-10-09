import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EMailSalarySlipComponent } from './e-mail-salary-slip.component';


const routes: Routes = [
  { path: '', component: EMailSalarySlipComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EMailSalarySlipMasterRoutingModule { }
