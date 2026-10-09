import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { ImportCustomerComponent } from './import-customer/import-customer.component';


const routes: Routes = [
  { path: '', component: ViewCustomerComponent },
  { path: 'add_customer', component: AddCustomerComponent },
  { path: 'edit_customer', component: EditCustomerComponent },
  { path: 'import_customer', component: ImportCustomerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMasterRoutingModule { }
