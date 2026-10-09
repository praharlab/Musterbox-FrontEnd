import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GatepassesComponent } from './gatepasses.component';
import { GatePassMasterComponent } from './gate-pass-master/gate-pass-master.component';

const routes: Routes = [
  {
    path: '',
    component: GatepassesComponent,
    children: [
      { path: '', redirectTo: 'gatepass_master', pathMatch: 'full' },
      { path: 'gatepass_master', component: GatePassMasterComponent },

      { path: 'gatepass', loadChildren: () => import('./gatepass/gatepass-master/gatepass-master.module').then((m) => m.GatepassMasterModule) },

      { path: 'mygatepass', loadChildren: () => import('./gatepass/my-gatepass-master.module').then((m) => m.MyGatepassMasterModule) },

      { path: 'gatepass-dashboard', loadChildren: () => import('./gatepass-dashboard/gatepass-dashboard-master.module').then((m) => m.GatepassDashboardMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GatepassesRoutingModule {}
