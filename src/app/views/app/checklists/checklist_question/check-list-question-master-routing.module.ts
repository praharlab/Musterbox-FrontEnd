import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListChecklistQuestionComponent } from './list-checklist-question/list-checklist-question.component';
import { AddChecklistQuestionComponent } from './add-checklist-question/add-checklist-question.component';


const routes: Routes = [
  { path: '', component: ListChecklistQuestionComponent },
  { path: 'add_checklistQuestion', component: AddChecklistQuestionComponent },
  // { path: 'edit_checklistQuestion/:id', component: EditChecklistQuestionComponent }, // not use right now
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckListQuestionMasterRoutingModule { }
