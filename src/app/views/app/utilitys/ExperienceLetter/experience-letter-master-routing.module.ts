import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListExperienceLetterComponent } from './list-experience-letter/list-experience-letter.component';
import { AddExperienceLetterComponent } from './add-experience-letter/add-experience-letter.component';
import { EditExperienceLetterComponent } from './edit-experience-letter/edit-experience-letter.component';


const routes: Routes = [
  { path: '', component: ListExperienceLetterComponent },
  { path: 'Add-experience-Letter', component: AddExperienceLetterComponent },
  { path: 'Edit-experience-Letter', component: EditExperienceLetterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExperienceLetterMasterRoutingModule { }
