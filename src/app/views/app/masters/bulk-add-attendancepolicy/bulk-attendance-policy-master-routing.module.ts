import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddAttendancepolicyComponent } from './bulk-add-attendancepolicy.component';


const routes: Routes = [
  { path: '', component: BulkAddAttendancepolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkAttendancePolicyMasterRoutingModule { }
