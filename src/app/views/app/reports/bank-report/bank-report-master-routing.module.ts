import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankReportComponent } from './bank-report.component';


const routes: Routes = [
  { path: '', component: BankReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankReportMasterRoutingModule { }
