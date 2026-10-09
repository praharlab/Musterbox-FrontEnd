import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LwfChallanComponent } from './lwf-challan.component';

const routes: Routes = [{ path: '', component: LwfChallanComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LwfChallanRoutingModule {}
