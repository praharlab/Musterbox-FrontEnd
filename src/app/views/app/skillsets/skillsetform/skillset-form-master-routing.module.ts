import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSkillsetformComponent } from './list-skillsetform/list-skillsetform.component';
import { AddSkillsetformComponent } from './add-skillsetform/add-skillsetform.component';
import { EditSkillsetformComponent } from './edit-skillsetform/edit-skillsetform.component';


const routes: Routes = [
  { path: '', component: ListSkillsetformComponent },
  { path: 'add_skillsetform', component: AddSkillsetformComponent },
  { path: 'edit_skillsetform', component: EditSkillsetformComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsetFormMasterRoutingModule { }
