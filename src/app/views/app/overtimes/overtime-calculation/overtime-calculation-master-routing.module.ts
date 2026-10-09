import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OvertimeCalculationComponent } from './overtime-calculation.component';


const routes: Routes = [
  { path: '', component: OvertimeCalculationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OvertimeCalculationMasterRoutingModule { }
