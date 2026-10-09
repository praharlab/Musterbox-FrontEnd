import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyShortLeaveApplicationComponent } from './list-my-short-leave-application/my-short-leave-application.component';
import { AddShortLeaveApplicationComponent } from './add-short-leave-application/add-short-leave-application.component';
import { EditShortLeaveApplicationComponent } from './edit-short-leave-application/edit-short-leave-application.component';


const routes: Routes = [
  { path: '', component: MyShortLeaveApplicationComponent },
  { path: 'add-short-leave-application', component: AddShortLeaveApplicationComponent },
  { path: 'edit-short-leave-application', component: EditShortLeaveApplicationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortLeaveApplicationMasterRoutingModule { }
