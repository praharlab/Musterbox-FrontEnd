import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GatepassByUserComponent } from './gatepass-by-user/gatepass-by-user.component';
import { AddMygatepassComponent } from './add-mygatepass/add-mygatepass.component';
import { EditMygatepassComponent } from './edit-mygatepass/edit-mygatepass.component';


const routes: Routes = [
  { path: '', component: GatepassByUserComponent },
  { path: 'add_mygatepass', component: AddMygatepassComponent },
  { path: 'edit_mygatepass', component: EditMygatepassComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGatepassMasterRoutingModule { }
