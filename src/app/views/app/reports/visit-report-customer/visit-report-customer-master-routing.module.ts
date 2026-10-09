import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitReportCustomerComponent } from './visit-report-customer.component';


const routes: Routes = [
  { path: '', component: VisitReportCustomerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitReportCustomerMasterRoutingModule { }
