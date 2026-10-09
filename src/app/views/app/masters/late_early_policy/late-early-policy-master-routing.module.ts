import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLateEarlyPolicyComponent } from './list-late-early-policy/list-late-early-policy.component';
import { AddLateEarlyPolicyComponent } from './add-late-early-policy/add-late-early-policy.component';
import { EditLateEarlyPolicyComponent } from './edit-late-early-policy/edit-late-early-policy.component';


const routes: Routes = [
  { path: '', component: ListLateEarlyPolicyComponent },
  { path: 'add_lateComeEarlyGo', component: AddLateEarlyPolicyComponent },
  { path: 'edit_lateComeEarlyGo', component: EditLateEarlyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LateEarlyPolicyMasterRoutingModule { }
