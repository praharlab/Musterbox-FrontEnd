import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MannualAttendanceComponent } from './mannual-attendance.component';


const routes: Routes = [
  { path: '', component: MannualAttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualAttendanceMasterRoutingModule { }
