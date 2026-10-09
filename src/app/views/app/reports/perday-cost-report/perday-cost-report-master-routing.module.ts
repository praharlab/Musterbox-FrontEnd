import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerdayCostReportComponent } from './perday-cost-report.component';


const routes: Routes = [
  { path: '', component: PerdayCostReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerdayCostReportMasterRoutingModule { }
