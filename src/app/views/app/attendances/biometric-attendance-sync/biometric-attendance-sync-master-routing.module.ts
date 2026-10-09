import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BiometricAttendanceSyncComponent } from './biometric-attendance-sync.component';


const routes: Routes = [
  { path: '', component: BiometricAttendanceSyncComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiometricAttendanceSyncMasterRoutingModule { }
