import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSkillsetsMasterComponent } from './list-skillsets-master/list-skillsets-master.component';
import { AddSkillsetsMasterComponent } from './add-skillsets-master/add-skillsets-master.component';
import { EditSkillsetsMasterComponent } from './edit-skillsets-master/edit-skillsets-master.component';


const routes: Routes = [
  { path: '', component: ListSkillsetsMasterComponent },
  { path: 'add_skillset', component: AddSkillsetsMasterComponent },
  { path: 'edit_skillset', component: EditSkillsetsMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsetsMasterRoutingModule { }
