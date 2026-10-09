import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddWeekoffpolicyComponent } from './bulk-add-weekoffpolicy.component';


const routes: Routes = [
  { path: '', component: BulkAddWeekoffpolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkWeekoffPolicyMasterRoutingModule { }
