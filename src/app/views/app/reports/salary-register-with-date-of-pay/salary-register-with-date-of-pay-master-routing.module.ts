import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryRegisterWithDateOfPayComponent } from './salary-register-with-date-of-pay.component';


const routes: Routes = [
  { path: '', component: SalaryRegisterWithDateOfPayComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryRegisterWithDateOfPayMasterRoutingModule { }
