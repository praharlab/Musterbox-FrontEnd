import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamLocationTrackingComponent } from './team-location-tracking.component';


const routes: Routes = [
  { path: '', component: TeamLocationTrackingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamLocationTrackingMasterRoutingModule { }
