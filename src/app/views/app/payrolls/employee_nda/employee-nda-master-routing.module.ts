import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeNdaComponent } from './list-employee-nda/list-employee-nda.component';
import { AddEmployeeNdaComponent } from './add-employee-nda/add-employee-nda.component';
import { EditEmployeeNdaComponent } from './edit-employee-nda/edit-employee-nda.component';


const routes: Routes = [
  { path: '', component: ListEmployeeNdaComponent },
  { path: 'add_employee_nda', component: AddEmployeeNdaComponent },
  { path: 'edit_employee_nda', component: EditEmployeeNdaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeNdaMasterRoutingModule { }
