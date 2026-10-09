import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSkillsetsFormComponent } from './user-skillsets-form.component';


const routes: Routes = [
  { path: '', component: UserSkillsetsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSkillsetsFormMasterRoutingModule { }
