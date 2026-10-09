import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminOutdoorDutyComponent } from './admin-outdoor-duty.component';

const routes: Routes = [{ path: '', component: AdminOutdoorDutyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminOutdoorDutyRoutingModule {}
