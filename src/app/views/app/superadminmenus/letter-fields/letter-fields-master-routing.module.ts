import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLetterFieldsComponent } from './list-letter-fields/list-letter-fields.component';
import { AddLetterFieldsComponent } from './add-letter-fields/add-letter-fields.component';


const routes: Routes = [
  { path: '', component: ListLetterFieldsComponent },
  { path: 'add_letter_fields', component: AddLetterFieldsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LetterFieldsMasterRoutingModule { }
