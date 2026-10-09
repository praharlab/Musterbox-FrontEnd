import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddEmpLeavePolicyComponent } from './bulk-add-emp-leave-policy.component';


const routes: Routes = [
  { path: '', component: BulkAddEmpLeavePolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkEmpLeavePolicyMasterRoutingModule { }
