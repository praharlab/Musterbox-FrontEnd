import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBulkShortLeaveApplicationComponent } from './add-bulk-short-leave-application/add-bulk-short-leave-application.component';


const routes: Routes = [
  {path: '', component: AddBulkShortLeaveApplicationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkShortLeaveApplicationRoutingModule { }
