import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyVehicleUsageReportComponent } from './daily-vehicle-usage-report.component';


const routes: Routes = [
  { path: '', component: DailyVehicleUsageReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyVehicleUsageReportMasterRoutingModule { }
