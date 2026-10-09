import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListGatepassComponent } from '../list-gatepass/list-gatepass.component';
import { AddGatepassComponent } from '../add-gatepass/add-gatepass.component';
import { EditGatepassComponent } from '../edit-gatepass/edit-gatepass.component';


const routes: Routes = [
  { path: '', component: ListGatepassComponent },
  { path: 'add_gatepass', component: AddGatepassComponent },
  { path: 'edit_gatepass', component: EditGatepassComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatepassMasterRoutingModule { }
