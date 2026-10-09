import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutdoorDutyAuthorizationComponent } from './outdoor-duty-authorization.component';


const routes: Routes = [
  { path: '', component: OutdoorDutyAuthorizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutdoorDutyAuthorizationMasterRoutingModule { }
