import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDealerPlanComponent } from './list-dealer-plan/list-dealer-plan.component';
import { AddDealerPlanComponent } from './add-dealer-plan/add-dealer-plan.component';
import { EditDealerPlanComponent } from './edit-dealer-plan/edit-dealer-plan.component';


const routes: Routes = [
  { path: '', component: ListDealerPlanComponent },
  { path: 'add_dealerplan', component: AddDealerPlanComponent },
  { path: 'edit_dealerplan', component: EditDealerPlanComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealerPlanMasterRoutingModule { }
