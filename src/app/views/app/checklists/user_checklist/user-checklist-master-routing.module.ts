import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserChecklistComponent } from './list-user-checklist/list-user-checklist.component';
import { AddUserChecklistComponent } from './add-user-checklist/add-user-checklist.component';
import { EditUserChecklistComponent } from './edit-user-checklist/edit-user-checklist.component';


const routes: Routes = [
  { path: '', component: ListUserChecklistComponent },
  { path: 'add_userCheckList', component: AddUserChecklistComponent },
  { path: 'edit_userCheckList', component: EditUserChecklistComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserChecklistMasterRoutingModule { }
