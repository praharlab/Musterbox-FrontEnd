import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositUserwiseComponent } from './deposit-userwise.component';


const routes: Routes = [
  { path: '', component: DepositUserwiseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositUserwiseMasterRoutingModule { }
