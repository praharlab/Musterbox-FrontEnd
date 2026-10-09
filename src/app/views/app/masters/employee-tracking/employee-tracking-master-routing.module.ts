import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeTrackingComponent } from './employee-tracking.component';


const routes: Routes = [
  { path: '', component: EmployeeTrackingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTrackingMasterRoutingModule { }
