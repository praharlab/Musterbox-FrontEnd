import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabourBillComponent } from './labour-bill.component';


const routes: Routes = [{path:'',component:LabourBillComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabourBillRoutingModule { }
