import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PFReportDataComponent } from './pf-report-data.component';


const routes: Routes = [
  { path: '', component: PFReportDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PfReportDataMasterRoutingModule { }
