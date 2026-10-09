import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeGatepassComponent } from './list-employee-gatepass/list-employee-gatepass.component';
import { AddEmployeeGatepassComponent } from './add-employee-gatepass/add-employee-gatepass.component';
import { EditEmployeeGatepassComponent } from './edit-employee-gatepass/edit-employee-gatepass.component';


const routes: Routes = [
  { path: '', component: ListEmployeeGatepassComponent },
  { path: 'add_emp_gatepass', component: AddEmployeeGatepassComponent },
  { path: 'edit_emp_gatepass', component: EditEmployeeGatepassComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeGatepassMasterRoutingModule { }
