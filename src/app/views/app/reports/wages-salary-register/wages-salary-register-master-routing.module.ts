import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WagesSalaryRegisterComponent } from './wages-salary-register.component';


const routes: Routes = [
  { path: '', component: WagesSalaryRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WagesSalaryRegisterMasterRoutingModule { }
