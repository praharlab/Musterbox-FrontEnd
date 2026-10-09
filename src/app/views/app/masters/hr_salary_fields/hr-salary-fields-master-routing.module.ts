import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListHrSalaryFieldsComponent } from './list-hr-salary-fields/list-hr-salary-fields.component';
import { AddHrSalaryFieldsComponent } from './add-hr-salary-fields/add-hr-salary-fields.component';
import { EditHrSalaryFieldsComponent } from './edit-hr-salary-fields/edit-hr-salary-fields.component';


const routes: Routes = [
  { path: '', component: ListHrSalaryFieldsComponent },
  { path: 'add_hr_field_salary', component: AddHrSalaryFieldsComponent },
  { path: 'edit_hr_field_salary', component: EditHrSalaryFieldsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrSalaryFieldsMasterRoutingModule { }
