import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeBonusComponent } from './list-employee-bonus/list-employee-bonus.component';
import { AddEmployeeBonusComponent } from './add-employee-bonus/add-employee-bonus.component';
import { ImportEmployeeBonusComponent } from './import-employee-bonus/import-employee-bonus.component';




const routes: Routes = [
  { path: '', component: ListEmployeeBonusComponent },
  { path: 'add_employee_bonus', component: AddEmployeeBonusComponent },
  { path: 'import_employee_bonus', component: ImportEmployeeBonusComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeBonusRoutingModule { }
