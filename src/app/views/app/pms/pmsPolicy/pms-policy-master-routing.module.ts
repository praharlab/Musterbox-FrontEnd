import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPmsPolicyComponent } from './list-pms-policy/list-pms-policy.component';
import { AddPmsPolicyComponent } from './add-pms-policy/add-pms-policy.component';
import { EditPmsPolicyComponent } from './edit-pms-policy/edit-pms-policy.component';


const routes: Routes = [
  { path: '', component: ListPmsPolicyComponent },
  { path: 'add_pmspolicy', component: AddPmsPolicyComponent },
  { path: 'edit_pmspolicy', component: EditPmsPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmsPolicyMasterRoutingModule { }
