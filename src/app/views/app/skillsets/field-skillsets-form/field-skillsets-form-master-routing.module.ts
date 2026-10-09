import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FieldSkillsetsFormComponent } from './field-skillsets-form.component';


const routes: Routes = [
  { path: '', component: FieldSkillsetsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FieldSkillsetsFormMasterRoutingModule { }
