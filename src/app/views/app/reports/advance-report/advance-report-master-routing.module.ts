import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvanceReportComponent } from './advance-report.component';


const routes: Routes = [
  { path: '', component: AdvanceReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceReportMasterRoutingModule { }
