import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDepartmentComponent } from './list-department/list-department.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';
import { ImportDepartmentComponent } from './import-department/import-department.component';


const routes: Routes = [
  { path: '', component: ListDepartmentComponent },
  { path: 'add_department', component: AddDepartmentComponent },
  { path: 'edit_department', component: EditDepartmentComponent },
  { path: 'import_department', component: ImportDepartmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentMasterRoutingModule { }
