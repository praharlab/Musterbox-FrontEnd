import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddAttendanceBonusPolicyComponent } from './bulk-add-attendance-bonus-policy.component';


const routes: Routes = [
  { path: '', component: BulkAddAttendanceBonusPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkAttendanceBonusPolicyMasterRoutingModule { }
