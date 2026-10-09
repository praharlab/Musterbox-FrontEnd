import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PenaltyReportComponent } from './penalty-report.component';


const routes: Routes = [
  { path: '', component: PenaltyReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PenaltyReportMasterRoutingModule { }
