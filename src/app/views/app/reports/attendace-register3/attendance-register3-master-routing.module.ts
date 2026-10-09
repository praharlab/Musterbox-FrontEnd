import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendaceRegister3Component } from './attendace-register3.component';


const routes: Routes = [
  { path: '', component: AttendaceRegister3Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRegister3MasterRoutingModule { }
