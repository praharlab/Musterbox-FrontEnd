import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLetterTemplatetypeComponent } from './list-letter-templatetype/list-letter-templatetype.component';
import { AddLetterTemplatetypeComponent } from './add-letter-templatetype/add-letter-templatetype.component';
import { EditLetterTemplatetypeComponent } from './edit-letter-templatetype/edit-letter-templatetype.component';


const routes: Routes = [
  { path: '', component: ListLetterTemplatetypeComponent },
  { path: 'add_letter_templatetype', component: AddLetterTemplatetypeComponent },
  { path: 'edit_letter_templatetype', component: EditLetterTemplatetypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LetterTemplateMasterRoutingModule { }
