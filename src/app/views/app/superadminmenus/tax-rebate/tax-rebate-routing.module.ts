import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTaxRebateComponent } from './list-tax-rebate/list-tax-rebate.component';
import { AddTaxRebateComponent } from './add-tax-rebate/add-tax-rebate.component';
import { EditTaxRebateComponent } from './edit-tax-rebate/edit-tax-rebate.component';


const routes: Routes = [
  { path: '', component: ListTaxRebateComponent },
  { path: 'add', component: AddTaxRebateComponent },
  { path: 'edit', component: EditTaxRebateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRebateRoutingModule { }
