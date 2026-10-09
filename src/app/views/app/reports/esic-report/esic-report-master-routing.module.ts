import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EsicReportComponent } from './esic-report.component';


const routes: Routes = [
  { path: '', component: EsicReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsicReportMasterRoutingModule { }
