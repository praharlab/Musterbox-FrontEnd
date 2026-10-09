import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EsicChallanComponent } from './esic-challan.component';


const routes: Routes = [
  { path: '', component: EsicChallanComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsicChallanMasterRoutingModule { }
