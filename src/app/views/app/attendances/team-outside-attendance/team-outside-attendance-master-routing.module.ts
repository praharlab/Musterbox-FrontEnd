import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamOutsideAttendanceComponent } from './team-outside-attendance.component';
import { AddTeamOutsideAttendanceComponent } from './add-team-outside-attendance/add-team-outside-attendance.component';
import { EditTeamOutsideAttendanceComponent } from './edit-team-outside-attendance/edit-team-outside-attendance.component';


const routes: Routes = [
  { path: '', component: TeamOutsideAttendanceComponent },
  { path: 'Add-Team-Outside-Attendance', component: AddTeamOutsideAttendanceComponent },
  { path: 'Edit-Team-Outside-Attendance', component: EditTeamOutsideAttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamOutsideAttendanceMasterRoutingModule { }
