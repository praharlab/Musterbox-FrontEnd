import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OvertimeConsolidateReportComponent } from './overtime-consolidate-report.component';


const routes: Routes = [
  { path: '', component: OvertimeConsolidateReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OvertimeConsolidateReportMasterRoutingModule { }
