import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBonusPolicyComponent } from './list-bonus-policy/list-bonus-policy.component';
import { AddBonusPolicyComponent } from './add-bonus-policy/add-bonus-policy.component';
import { EditBonusPolicyComponent } from './edit-bonus-policy/edit-bonus-policy.component';


const routes: Routes = [
  { path: '', component: ListBonusPolicyComponent },
  { path: 'add_bonus_policy', component: AddBonusPolicyComponent },
  { path: 'edit_bonus_policy', component: EditBonusPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusPolicyRoutingModule { }
