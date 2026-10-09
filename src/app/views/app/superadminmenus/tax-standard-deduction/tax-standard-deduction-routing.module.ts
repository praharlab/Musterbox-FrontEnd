import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTaxStandardDeductionComponent } from './list-tax-standard-deduction/list-tax-standard-deduction.component';
import { AddTaxStandardDeductionComponent } from './add-tax-standard-deduction/add-tax-standard-deduction.component';
import { EditTaxStandardDeductionComponent } from './edit-tax-standard-deduction/edit-tax-standard-deduction.component';


const routes: Routes = [
  { path: '', component: ListTaxStandardDeductionComponent },
  { path: 'add', component: AddTaxStandardDeductionComponent },
  { path: 'edit', component: EditTaxStandardDeductionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxStandardDeductionRoutingModule { }
