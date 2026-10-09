import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddEmployeeLateEarlyPolicyComponent } from './bulk-add-employee-late-early-policy.component';


const routes: Routes = [
  { path: '', component: BulkAddEmployeeLateEarlyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkLateEarlyPolicyMasterRoutingModule { }
