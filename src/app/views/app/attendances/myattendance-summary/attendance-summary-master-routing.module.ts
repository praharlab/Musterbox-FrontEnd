import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyattendanceSummaryComponent } from './myattendance-summary.component';


const routes: Routes = [
  {path: '', component: MyattendanceSummaryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceSummaryMasterRoutingModule { }
