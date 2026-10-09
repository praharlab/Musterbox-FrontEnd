import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceReport4Component } from './attendance-report4.component';


const routes: Routes = [
  { path: '', component: AttendanceReport4Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceReport4MasterRoutingModule { }
