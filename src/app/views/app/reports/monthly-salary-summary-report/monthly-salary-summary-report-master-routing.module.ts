import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlySalarySummaryReportComponent } from './monthly-salary-summary-report.component';


const routes: Routes = [
  { path: '', component: MonthlySalarySummaryReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlySalarySummaryReportMasterRoutingModule { }
