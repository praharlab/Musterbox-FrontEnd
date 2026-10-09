import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddEmployeeFoodAllowancePolicyComponent } from './bulk-add-employee-food-allowance-policy.component';


const routes: Routes = [
  { path: '', component: BulkAddEmployeeFoodAllowancePolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkEmpFoodAllowanceMasterRoutingModule { }
