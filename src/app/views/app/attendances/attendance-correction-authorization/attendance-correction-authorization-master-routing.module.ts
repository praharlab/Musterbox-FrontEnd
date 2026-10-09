import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceCorrectionAuthorizationComponent } from './attendance-correction-authorization.component';


const routes: Routes = [
  { path: '', component: AttendanceCorrectionAuthorizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceCorrectionAuthorizationMasterRoutingModule { }
