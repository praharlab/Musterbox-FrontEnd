import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCallFollowupComponent } from './list-call-followup/list-call-followup.component';
import { AddCallFollowupComponent } from './add-call-followup/add-call-followup.component';
import { EditCallFollowupComponent } from './edit-call-followup/edit-call-followup.component';


const routes: Routes = [
  { path: '', component: ListCallFollowupComponent },
  { path: 'add_callfollowup', component: AddCallFollowupComponent },
  { path: 'edit_callfollowup', component: EditCallFollowupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallFollowupMasterRoutingModule { }
