import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddServiceChargeComponent } from './add-service-charge/add-service-charge.component';
import { EditServiceChargeComponent } from './edit-service-charge/edit-service-charge.component';
import { ListServiceChargeComponent } from './list-service-charge/list-service-charge.component';

const routes: Routes = [
  { path: '', component: ListServiceChargeComponent },
  { path: 'add_service_charge', component: AddServiceChargeComponent },
  { path: 'edit_service_charge', component: EditServiceChargeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceChargeRoutingModule {}
