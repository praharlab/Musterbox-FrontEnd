import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingBiometricSyncComponent } from './pending-biometric-sync.component';


const routes: Routes = [
  { path: '', component: PendingBiometricSyncComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingBiometricSyncMasterRoutingModule { }
