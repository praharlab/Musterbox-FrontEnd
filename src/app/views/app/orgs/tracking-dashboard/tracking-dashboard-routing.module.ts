import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackingDashboardMasterComponent } from './tracking-dashboard-master/tracking-dashboard-master.component';


const routes: Routes = [
  { path: '', component: TrackingDashboardMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingDashboardRoutingModule { }
