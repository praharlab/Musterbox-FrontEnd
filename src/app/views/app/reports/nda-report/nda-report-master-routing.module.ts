import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NdaReportComponent } from './nda-report.component'

const routes: Routes = [
  { path: '', component: NdaReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdaReportMasterRoutingModule { }
