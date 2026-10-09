import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListJoiningRequestFormComponent } from './list-joining-request-form/list-joining-request-form.component';
import { AddJoiningRequestFormComponent } from './add-joining-request-form/add-joining-request-form.component';
import { EditJoiningRequestFormComponent } from './edit-joining-request-form/edit-joining-request-form.component';


const routes: Routes = [
  { path: '', component: ListJoiningRequestFormComponent },
  { path: 'addJoiningRequestform', component: AddJoiningRequestFormComponent },
  { path: 'editJoiningRequestform', component: EditJoiningRequestFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeJoiningRequestMasterRoutingModule { }
