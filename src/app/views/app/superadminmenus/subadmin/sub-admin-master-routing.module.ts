import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSubadminComponent } from './list-subadmin/list-subadmin.component';
import { AddSubadminComponent } from './add-subadmin/add-subadmin.component';
import { EditSubadminComponent } from './edit-subadmin/edit-subadmin.component';


const routes: Routes = [
  { path: '', component: ListSubadminComponent },
  { path: 'add_subadmin', component: AddSubadminComponent },
  { path: 'edit_subadmin', component: EditSubadminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAdminMasterRoutingModule { }
