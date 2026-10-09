import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyIncentiveComponent } from './my-incentive.component';


const routes: Routes = [
  { path: '', component: MyIncentiveComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyIncentiveMasterRoutingModule { }
