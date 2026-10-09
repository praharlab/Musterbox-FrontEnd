import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InoutAttendanceRegisterComponent } from './inout-attendance-register.component';


const routes: Routes = [
  { path: '', component: InoutAttendanceRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InoutAttendancRegisterMasterRoutingModule { }
