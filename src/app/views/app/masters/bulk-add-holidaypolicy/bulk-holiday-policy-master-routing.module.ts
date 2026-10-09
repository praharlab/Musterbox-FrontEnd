import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddHolidaypolicyComponent } from './bulk-add-holidaypolicy.component';


const routes: Routes = [
  { path: '', component: BulkAddHolidaypolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkHolidayPolicyMasterRoutingModule { }
