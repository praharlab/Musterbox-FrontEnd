import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KmReportComponent } from './km-report.component';


const routes: Routes = [
  { path: '', component: KmReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KmReportMasterRoutingModule { }
