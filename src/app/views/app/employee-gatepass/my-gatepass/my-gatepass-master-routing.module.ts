import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMyGatepassComponent } from './list-my-gatepass/list-my-gatepass.component';
import { AddMyGatepassComponent } from './add-my-gatepass/add-my-gatepass.component';
import { EditMyGatepassComponent } from './edit-my-gatepass/edit-my-gatepass.component';


const routes: Routes = [
  { path: '', component: ListMyGatepassComponent },
  { path: 'add_mygatepass', component: AddMyGatepassComponent },
  { path: 'edit_mygatepass', component: EditMyGatepassComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGatepassMasterRoutingModule { }
