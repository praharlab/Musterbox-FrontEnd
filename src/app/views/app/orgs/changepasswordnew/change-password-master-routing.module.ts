import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangepasswordnewComponent } from './changepasswordnew.component';


const routes: Routes = [
  { path: '', component: ChangepasswordnewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePasswordMasterRoutingModule { }
