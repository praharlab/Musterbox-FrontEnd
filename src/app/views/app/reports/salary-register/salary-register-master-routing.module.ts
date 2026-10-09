import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryRegisterComponent } from './salary-register.component';


const routes: Routes = [
  { path: '', component: SalaryRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryRegisterMasterRoutingModule { }
