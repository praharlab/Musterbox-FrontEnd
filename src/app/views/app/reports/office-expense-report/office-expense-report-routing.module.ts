import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfficeExpenseReportComponent } from './office-expense-report.component';


const routes: Routes = [
  { path: '', component: OfficeExpenseReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeExpenseReportRoutingModule { }
