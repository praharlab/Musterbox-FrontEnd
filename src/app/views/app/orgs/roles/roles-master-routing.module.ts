import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { CloneRolesComponent } from './clone-roles/clone-roles.component';


const routes: Routes = [
  { path: '', component: ListRolesComponent },
  { path: 'add_roles', component: AddRolesComponent },
  { path: 'edit_roles', component: EditRolesComponent },
  { path: 'clonerole', component: CloneRolesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesMasterRoutingModule { }
