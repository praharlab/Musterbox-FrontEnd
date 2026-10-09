import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSubscriptionPlanComponent } from './list-subscription-plan/list-subscription-plan.component';
import { AddSubscriptionPlanComponent } from './add-subscription-plan/add-subscription-plan.component';
import { EditSubscriptionPlanComponent } from './edit-subscription-plan/edit-subscription-plan.component';


const routes: Routes = [
  { path: '', component: ListSubscriptionPlanComponent },
  { path: 'add_company_subscription', component: AddSubscriptionPlanComponent },
  { path: 'edit_company_subscription', component: EditSubscriptionPlanComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionPlanMasterRoutingModule { }
