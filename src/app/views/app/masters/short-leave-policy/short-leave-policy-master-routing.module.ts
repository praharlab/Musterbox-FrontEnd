import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListShortLeavePolicyComponent } from './list-short-leave-policy/list-short-leave-policy.component';
import { AddShortLeavePolicyComponent } from './add-short-leave-policy/add-short-leave-policy.component';
import { EditShortLeavePolicyComponent } from './edit-short-leave-policy/edit-short-leave-policy.component';


const routes: Routes = [
  { path: '', component: ListShortLeavePolicyComponent },
  { path: 'add_short_leave_policy', component: AddShortLeavePolicyComponent },
  { path: 'edit_short_leave_policy', component: EditShortLeavePolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortLeavePolicyMasterRoutingModule { }
