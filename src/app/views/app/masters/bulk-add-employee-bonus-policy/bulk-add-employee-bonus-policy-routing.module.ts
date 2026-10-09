import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddEmployeeBonusPolicyComponent } from './bulk-add-employee-bonus-policy.component';


const routes: Routes = [
   {path: '', component: BulkAddEmployeeBonusPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkAddEmployeeBonusPolicyRoutingModule { }
