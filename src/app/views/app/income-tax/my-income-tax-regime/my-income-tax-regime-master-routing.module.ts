import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMyIncomeTaxRegimeComponent } from './list-my-income-tax-regime/list-my-income-tax-regime.component';
import { AddMyIncomeTaxRegimeComponent } from './add-my-income-tax-regime/add-my-income-tax-regime.component';


const routes: Routes = [
  { path: '', component: ListMyIncomeTaxRegimeComponent },
  { path: 'add_my_incometax_regime', component: AddMyIncomeTaxRegimeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyIncomeTaxRegimeMasterRoutingModule { }
