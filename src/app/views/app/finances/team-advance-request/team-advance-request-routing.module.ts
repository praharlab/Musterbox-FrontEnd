import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTeamAdvanceRequestComponent } from './list-team-advance-request/list-team-advance-request.component';
import { AddTeamAdvanceRequestComponent } from './add-team-advance-request/add-team-advance-request.component';
import { EditTeamAdvanceRequestComponent } from './edit-team-advance-request/edit-team-advance-request.component';

const routes: Routes = [
  { path: '', component: ListTeamAdvanceRequestComponent },
  { path: 'addTeamAdvanceRequest', component: AddTeamAdvanceRequestComponent },
  { path: 'editTeamAdvanceRequest', component: EditTeamAdvanceRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamAdvanceRequestRoutingModule {}
