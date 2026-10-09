import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListErpIntegrationComponent } from './list-erp-integration/list-erp-integration.component';
import { AddErpIntegrationComponent } from './add-erp-integration/add-erp-integration.component';
import { EditErpIntegrationComponent } from './edit-erp-integration/edit-erp-integration.component';


const routes: Routes = [
  { path: '', component: ListErpIntegrationComponent },
  { path: 'Add-ErpIntegration', component: AddErpIntegrationComponent },
  { path: 'Edit-ErpIntegration', component: EditErpIntegrationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErpIntegrationMasterRoutingModule { }
