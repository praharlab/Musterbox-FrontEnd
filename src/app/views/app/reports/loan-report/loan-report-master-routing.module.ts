import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanReportComponent } from './loan-report.component';


const routes: Routes = [
  { path: '', component: LoanReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanReportMasterRoutingModule { }
