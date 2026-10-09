import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddSalarypolicyComponent } from './bulk-add-salarypolicy.component';


const routes: Routes = [
  { path: '', component: BulkAddSalarypolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkSalaryPolicyMasterRoutingModule { }
