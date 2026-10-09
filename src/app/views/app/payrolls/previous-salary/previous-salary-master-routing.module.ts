import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreviousSalaryComponent } from './previous-salary.component';


const routes: Routes = [
  { path: '', component: PreviousSalaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviousSalaryMasterRoutingModule { }
