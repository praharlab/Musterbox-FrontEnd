import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeSalaryStructureComponent } from './employee-salary-structure.component';


const routes: Routes = [
  { path: '', component: EmployeeSalaryStructureComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeSalaryStructureRoutingModule { }
