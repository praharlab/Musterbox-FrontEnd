import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListForm16Component } from './list-form16/list-form16.component';
import { AddForm16Component } from './add-form16/add-form16.component';
import { EditForm16Component } from './edit-form16/edit-form16.component';


const routes: Routes = [
  { path: '', component: ListForm16Component },
  { path: 'add_form16', component: AddForm16Component },
  { path: 'edit_form16', component: EditForm16Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form16MasterRoutingModule { }
