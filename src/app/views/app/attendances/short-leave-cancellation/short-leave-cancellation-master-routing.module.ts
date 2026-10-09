import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShortLeaveCancellationComponent } from './short-leave-cancellation.component';


const routes: Routes = [
  { path: '', component: ShortLeaveCancellationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortLeaveCancellationMasterRoutingModule { }
