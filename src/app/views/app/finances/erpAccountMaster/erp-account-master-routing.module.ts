import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListErpAccountMasterComponent } from './list-erp-account-master/list-erp-account-master.component';
import { AddErpAccountMasterComponent } from './add-erp-account-master/add-erp-account-master.component';
import { EditErpAccountMasterComponent } from './edit-erp-account-master/edit-erp-account-master.component';


const routes: Routes = [
  { path: '', component: ListErpAccountMasterComponent },
  { path: 'add_erpAccountMaster', component: AddErpAccountMasterComponent },
  { path: 'edit_erpAccountMaster/:id', component: EditErpAccountMasterComponent }, //not use right now
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErpAccountMasterRoutingModule { }
