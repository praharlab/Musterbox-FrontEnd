import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListFormMasterComponent } from './list-form-master/list-form-master.component';
import { AddFormMasterComponent } from './add-form-master/add-form-master.component';
import { EditFormMasterComponent } from './edit-form-master/edit-form-master.component';


const routes: Routes = [
  { path: '', component: ListFormMasterComponent },
  { path: 'add_form', component: AddFormMasterComponent },
  { path: 'edit_form', component: EditFormMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormMasterRoutingModule { }
