import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeTaxRegimeComponent } from './list-employee-tax-regime/list-employee-tax-regime.component';
import { AddEmployeeTaxRegimeComponent } from './add-employee-tax-regime/add-employee-tax-regime.component';
import { EditEmployeeTaxRegimeComponent } from './edit-employee-tax-regime/edit-employee-tax-regime.component';


const routes: Routes = [
  { path: '', component: ListEmployeeTaxRegimeComponent },
  { path: 'add_employee_tax_regime', component: AddEmployeeTaxRegimeComponent },
  { path: 'edit_employee_tax_regime', component: EditEmployeeTaxRegimeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTaxRegimeMasterRoutingModule { }
