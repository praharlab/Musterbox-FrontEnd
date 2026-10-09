import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HourlySalaryRegisterComponent } from './hourly-salary-register.component';


const routes: Routes = [
  { path: '', component: HourlySalaryRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HourlySalaryRegisterMasterRoutingModule { }
