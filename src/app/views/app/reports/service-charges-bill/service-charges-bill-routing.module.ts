import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceChargesBillComponent } from './service-charges-bill.component';


const routes: Routes = [{path:'',component:ServiceChargesBillComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceChargesBillRoutingModule { }
