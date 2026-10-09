import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlyAttendanceEntryComponent } from './monthly-attendance-entry.component';


const routes: Routes = [
  { path: '', component: MonthlyAttendanceEntryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyAttendanceEntryRoutingModule { }
