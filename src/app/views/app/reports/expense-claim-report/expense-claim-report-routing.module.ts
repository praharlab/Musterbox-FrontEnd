import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseClaimReportComponent } from './expense-claim-report.component';



const routes: Routes = [
  { path: '', component: ExpenseClaimReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseClaimReportRoutingModule { }
