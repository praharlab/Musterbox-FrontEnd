import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBulkShortLeavePolicyComponent } from './add-bulk-short-leave-policy/add-bulk-short-leave-policy.component'

const routes: Routes = [
  {path: '', component: AddBulkShortLeavePolicyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkShortLeavePolicyRoutingModule { }
