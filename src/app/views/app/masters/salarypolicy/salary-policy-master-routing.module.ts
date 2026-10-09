import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSalarypolicyComponent } from './list-salarypolicy/list-salarypolicy.component';
import { AddSalarypolicyComponent } from './add-salarypolicy/add-salarypolicy.component';
import { EditSalarypolicyComponent } from './edit-salarypolicy/edit-salarypolicy.component';


const routes: Routes = [
  { path: '', component: ListSalarypolicyComponent },
  { path: 'add_salary_policy', component: AddSalarypolicyComponent },
  { path: 'edit_salary_policy', component: EditSalarypolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryPolicyMasterRoutingModule { }
