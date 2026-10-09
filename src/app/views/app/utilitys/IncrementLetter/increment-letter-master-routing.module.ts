import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListIncrementLetterComponent } from './list-increment-letter/list-increment-letter.component';
import { AddIncrementLetterComponent } from './add-increment-letter/add-increment-letter.component';
import { EditIncrementLetterComponent } from './edit-increment-letter/edit-increment-letter.component';


const routes: Routes = [
  { path: '', component: ListIncrementLetterComponent },
  { path: 'Add-increment-Letter', component: AddIncrementLetterComponent },
  { path: 'Edit-increment-Letter', component: EditIncrementLetterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncrementLetterMasterRoutingModule { }
