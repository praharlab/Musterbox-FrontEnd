import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListIncomeTaxSlabMasterComponent } from './list-income-tax-slab-master/list-income-tax-slab-master.component';
import { AddIncomeTaxSlabMasterComponent } from './add-income-tax-slab-master/add-income-tax-slab-master.component';
import { EditIncomeTaxSlabMasterComponent } from './edit-income-tax-slab-master/edit-income-tax-slab-master.component';


const routes: Routes = [
  { path: '', component: ListIncomeTaxSlabMasterComponent },
  { path: 'add_incomeTaxSlabMaster', component: AddIncomeTaxSlabMasterComponent },
  { path: 'edit_incomeTaxSlabMaster', component: EditIncomeTaxSlabMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeTaxSlabMasterRoutingModule { }
