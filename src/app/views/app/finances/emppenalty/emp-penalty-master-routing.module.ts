import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmppenaltyComponent } from './emppenalty.component';


const routes: Routes = [
  { path: '', component: EmppenaltyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpPenaltyMasterRoutingModule { }
