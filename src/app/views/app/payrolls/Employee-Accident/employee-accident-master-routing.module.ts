import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeAccidentComponent } from './list-employee-accident/list-employee-accident.component';
import { AddEmployeeAccidentComponent } from './add-employee-accident/add-employee-accident.component';
import { EditEmployeeAccidentComponent } from './edit-employee-accident/edit-employee-accident.component';


const routes: Routes = [
  { path: '', component: ListEmployeeAccidentComponent },
  { path: 'add_employee_accident', component: AddEmployeeAccidentComponent },
  { path: 'edit_employee_accident', component: EditEmployeeAccidentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAccidentMasterRoutingModule { }
