import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LwfReportComponent } from './lwf-report.component';


const routes: Routes = [
  { path: '', component: LwfReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LwfReportMasterRoutingModule { }
