import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserTrackingComponent } from './user-tracking.component';


const routes: Routes = [
  { path: '', component: UserTrackingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserTrackingMasterRoutingModule { }
