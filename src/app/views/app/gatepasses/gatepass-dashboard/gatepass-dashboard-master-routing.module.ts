import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GatepassDashboardComponent } from './gatepass-dashboard.component';


const routes: Routes = [
  { path: '', component: GatepassDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatepassDashboardMasterRoutingModule { }
