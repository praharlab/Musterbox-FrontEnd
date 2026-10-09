import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeLeavePolicyComponent } from './list-employee-leave-policy/list-employee-leave-policy.component';
import { AddEmployeeLeavePolicyComponent } from './add-employee-leave-policy/add-employee-leave-policy.component';
import { EditEmployeeLeavePolicyComponent } from './edit-employee-leave-policy/edit-employee-leave-policy.component';


const routes: Routes = [
  { path: '', component: ListEmployeeLeavePolicyComponent },
  { path: 'add_employee_leave_policy', component: AddEmployeeLeavePolicyComponent },
  { path: 'edit_employee_leave_policy', component: EditEmployeeLeavePolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpLeavePolicyMasterRoutingModule { }
