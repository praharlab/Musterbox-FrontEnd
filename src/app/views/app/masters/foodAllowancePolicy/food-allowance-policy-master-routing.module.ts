import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListFoodAllowancePolicyComponent } from './list-food-allowance-policy/list-food-allowance-policy.component';
import { AddFoodAllowancePolicyComponent } from './add-food-allowance-policy/add-food-allowance-policy.component';
import { EditFoodAllowancePolicyComponent } from './edit-food-allowance-policy/edit-food-allowance-policy.component';


const routes: Routes = [
  { path: '', component: ListFoodAllowancePolicyComponent },
  { path: 'add_foodAllowancePolicy', component: AddFoodAllowancePolicyComponent },
  { path: 'edit_foodAllowancePolicy', component: EditFoodAllowancePolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodAllowancePolicyMasterRoutingModule { }
