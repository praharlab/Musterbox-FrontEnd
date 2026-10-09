import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnassignedBiometricCodeComponent } from './unassigned-biometric-code.component';


const routes: Routes = [
  {path : '', component: UnassignedBiometricCodeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnassignedBiometricCodeRoutingModule { }
