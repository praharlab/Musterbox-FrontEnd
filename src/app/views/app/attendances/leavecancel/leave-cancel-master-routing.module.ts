import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeavecancelComponent } from './leavecancel.component';


const routes: Routes = [
  { path: '', component: LeavecancelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveCancelMasterRoutingModule { }
