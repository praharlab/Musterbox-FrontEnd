import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListattendanceCalComponent } from './listattendance-cal/listattendance-cal.component';
import { AddattendanceCalComponent } from './addattendance-cal/addattendance-cal.component';
import { EditattendanceCalComponent } from './editattendance-cal/editattendance-cal.component';
import { AttendanceVerifiedComponent } from './attendance-verified/attendance-verified.component';


const routes: Routes = [
  { path: '', component: ListattendanceCalComponent },
  { path: 'addattendancecal', component: AddattendanceCalComponent }, 
  { path: 'editattendancecal/:id/:year/:cid', component: EditattendanceCalComponent }, 
  { path: 'attendance_verified', component: AttendanceVerifiedComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceCalMasterRoutingModule { }
