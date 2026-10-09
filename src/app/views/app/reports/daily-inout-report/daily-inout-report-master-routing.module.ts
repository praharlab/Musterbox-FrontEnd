import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyInoutReportComponent } from './daily-inout-report.component';


const routes: Routes = [
  { path: '', component: DailyInoutReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyInoutReportMasterRoutingModule { }
