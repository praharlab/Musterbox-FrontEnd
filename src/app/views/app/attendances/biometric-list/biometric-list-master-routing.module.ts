import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BiometricListComponent } from './biometric-list.component';
import { AddBiometricListComponent } from '../add-biometric-list/add-biometric-list.component';


const routes: Routes = [
  { path: '', component: BiometricListComponent },
  { path: 'add_biometric', component: AddBiometricListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiometricListMasterRoutingModule { }
