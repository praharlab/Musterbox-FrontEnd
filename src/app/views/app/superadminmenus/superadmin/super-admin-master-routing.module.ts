import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSuperadminComponent } from './list-superadmin/list-superadmin.component';
import { AddSuperadminComponent } from './add-superadmin/add-superadmin.component';
import { EditSuperadminComponent } from './edit-superadmin/edit-superadmin.component';


const routes: Routes = [
  { path: '', component: ListSuperadminComponent },
  { path: 'add_superadmin', component: AddSuperadminComponent },
  { path: 'edit_superadmin', component: EditSuperadminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminMasterRoutingModule { }
