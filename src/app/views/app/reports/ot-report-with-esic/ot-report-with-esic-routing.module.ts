import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtReportWithEsicComponent } from './ot-report-with-esic.component';


const routes: Routes = [ { path: '', component: OtReportWithEsicComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtReportWithEsicRoutingModule { }
