import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LateearlyreportComponent } from './lateearlyreport.component';


const routes: Routes = [
  { path: '', component: LateearlyreportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LateEarlyReportMasterRoutingModule { }
