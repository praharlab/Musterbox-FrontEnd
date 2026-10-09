import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositreportComponent } from './depositreport.component';


const routes: Routes = [
  { path: '', component: DepositreportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositreportMasterRoutingModule { }
