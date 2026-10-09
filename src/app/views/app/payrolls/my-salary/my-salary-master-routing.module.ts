import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MySalaryComponent } from './my-salary.component';


const routes: Routes = [
  { path: '', component: MySalaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MySalaryMasterRoutingModule { }
