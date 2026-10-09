import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListJoiningLetterComponent } from './list-joining-letter/list-joining-letter.component';
import { AddJoiningLetterComponent } from './add-joining-letter/add-joining-letter.component';
import { EditJoiningLetterComponent } from './edit-joining-letter/edit-joining-letter.component';


const routes: Routes = [
  { path: '', component: ListJoiningLetterComponent },
  { path: 'Add-Joining-Letter', component: AddJoiningLetterComponent },
  { path: 'Edit-Joining-Letter', component: EditJoiningLetterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoiningLetterMasterRoutingModule { }
