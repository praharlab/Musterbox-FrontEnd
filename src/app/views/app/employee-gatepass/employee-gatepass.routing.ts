import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeGatepassComponent } from './employee-gatepass.component';
import { EmployeeGatepassMasterComponent } from './employee-gatepass-master/employee-gatepass-master.component';
import { GatepassRequestComponent } from './gatepass-request/gatepass-request.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeGatepassComponent,
    children: [
      { path: '', redirectTo: 'employee_gatepass_master', pathMatch: 'full' },
      { path: 'employee_gatepass_master', component: EmployeeGatepassMasterComponent },

      { path: 'list_empgatepass', loadChildren: () => import('./employeeGatepass/employee-gatepass-master.module').then((m) => m.EmployeeGatepassMasterModule) },

      { path: 'list_mygatepass', loadChildren: () => import('./my-gatepass/my-gatepass-master.module').then((m) => m.MyGatepassMasterModule) },

      { path: 'gatepassRequest', component: GatepassRequestComponent },
      { path: 'gatepass-authorization', loadChildren: () => import('./gatepass-authorization/gatepass-authorization-master.module').then((m) => m.GatepassAuthorizationMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeGatepassRoutingModule { }
