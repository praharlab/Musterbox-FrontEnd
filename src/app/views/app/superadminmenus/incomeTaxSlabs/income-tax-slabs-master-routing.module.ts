import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListIncomeTaxSlabComponent } from './list-income-tax-slab/list-income-tax-slab.component';
import { AddIncomeTaxSlabComponent } from './add-income-tax-slab/add-income-tax-slab.component';
import { EditIncomeTaxSlabComponent } from './edit-income-tax-slab/edit-income-tax-slab.component';


const routes: Routes = [
  { path: '', component: ListIncomeTaxSlabComponent },
  { path: 'add_incomeTaxSlab', component: AddIncomeTaxSlabComponent },
  { path: 'edit_incomeTaxSlab', component: EditIncomeTaxSlabComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeTaxSlabsMasterRoutingModule { }
