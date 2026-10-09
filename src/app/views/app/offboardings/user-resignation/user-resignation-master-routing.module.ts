import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserResignationComponent } from './user-resignation.component';


const routes: Routes = [
  { path: '', component: UserResignationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserResignationMasterRoutingModule { }
