import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GatepassAuthorizationComponent } from './gatepass-authorization.component';


const routes: Routes = [
  { path: '', component: GatepassAuthorizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatepassAuthorizationMasterRoutingModule { }
