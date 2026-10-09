import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyPaySlipComponent } from './my-pay-slip.component';



const routes: Routes = [
  { path: '', component: MyPaySlipComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPaySlipRoutingModule { }
