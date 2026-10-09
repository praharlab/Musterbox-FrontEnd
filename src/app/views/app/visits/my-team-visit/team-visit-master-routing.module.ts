import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMyteamvisitComponent } from './list-myteamvisit/list-myteamvisit.component';
import { AddMyteamvisitComponent } from './add-myteamvisit/add-myteamvisit.component';
import { EditMyteamvisitComponent } from './edit-myteamvisit/edit-myteamvisit.component';


const routes: Routes = [
  { path: '', component: ListMyteamvisitComponent },
  { path: 'add_myteamvisit', component: AddMyteamvisitComponent },
  { path: 'edit_myteamvisit', component: EditMyteamvisitComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamVisitMasterRoutingModule { }
