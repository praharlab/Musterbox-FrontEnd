import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PenaltyUserwiseComponent } from './penalty-userwise.component';


const routes: Routes = [
  { path: '', component: PenaltyUserwiseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PenaltyUserwiseMasterRoutingModule { }
