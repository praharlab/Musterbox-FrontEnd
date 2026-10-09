import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignBiometricUserListComponent } from './assign-biometric-user-list.component';


const routes: Routes = [
  { path: '', component: AssignBiometricUserListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignBiometricUserListRoutingModule { }
