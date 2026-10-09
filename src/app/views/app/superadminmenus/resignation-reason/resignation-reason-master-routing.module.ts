import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddResignationReasonComponent } from './add-resignation-reason/add-resignation-reason.component';
import { EditResignationReasonComponent } from './edit-resignation-reason/edit-resignation-reason.component';
import { ListResignationReasonComponent } from './list-resignation-reason/list-resignation-reason.component';


const routes: Routes = [
  { path: '', component: ListResignationReasonComponent },
  { path: 'add-resignation-reason', component: AddResignationReasonComponent },
  { path: 'edit-resignation-reason', component: EditResignationReasonComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResignationReasonMasterRoutingModule { }
