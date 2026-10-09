import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PfReportComponent } from './pf-report.component';


const routes: Routes = [
  { path: '', component: PfReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PfReportMasterRoutingModule { }
